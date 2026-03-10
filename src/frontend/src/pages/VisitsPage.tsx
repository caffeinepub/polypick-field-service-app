import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  FileDown,
  FileUp,
  Loader2,
  MapPin,
  MapPinOff,
  Plus,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Status } from "../backend.d";
import { StatusBadge } from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type T,
  useAllVisits,
  useClients,
  useCreateVisit,
  useDeleteVisit,
  useIsAdmin,
  useMyVisits,
  useUpdateVisit,
} from "../hooks/useQueries";
import { dateInputToNs, formatDate, todayInputStr } from "../utils/dateUtils";
import {
  captureLocation,
  formatGPS,
  gpsToMapsURL,
  parseGPS,
} from "../utils/locationUtils";

const STATUS_TABS = ["all", "planned", "completed", "cancelled"];

// ── PDF print helper ─────────────────────────────────────────────────────────

function printVisitsPDF(
  visits: T[],
  tabLabel: string,
  getClientName: (id: bigint) => string,
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const rows = visits
    .map((v) => {
      const meta = decodeTravelMeta(v.purpose);
      const route =
        meta.from || meta.to
          ? `${meta.from || "—"} → ${meta.to || "—"}${meta.dist ? ` (${meta.dist} km)` : ""}`
          : meta.purpose || "—";
      const statusDate = new Date(
        Number(v.plannedDate / 1_000_000n),
      ).toLocaleDateString("en-IN");
      return `
      <tr>
        <td>${statusDate}</td>
        <td>${getClientName(v.clientId)}</td>
        <td>${route}</td>
        <td style="text-transform:capitalize">${v.status}</td>
      </tr>`;
    })
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Visit Report – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f0f0f0; padding: 8px 6px; text-align: left; font-size: 11px; border: 1px solid #ccc; }
        td { padding: 7px 6px; border: 1px solid #ddd; }
        tr:nth-child(even) td { background: #fafafa; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>Visit Report – ${tabLabel}</p>
        <p>Generated: ${date} &nbsp;|&nbsp; Total: ${visits.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Route / Purpose</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// ── Travel metadata helpers ──────────────────────────────────────────────────

function encodeTravelMeta(
  from: string,
  to: string,
  dist: string,
  purpose: string,
): string {
  let prefix = "";
  if (from) prefix += `[FROM:${from}]`;
  if (to) prefix += `[TO:${to}]`;
  if (dist) prefix += `[DIST:${dist}]`;
  return prefix ? `${prefix} ${purpose}` : purpose;
}

function decodeTravelMeta(purposeStr: string): {
  from: string;
  to: string;
  dist: string;
  purpose: string;
} {
  const fromM = purposeStr.match(/\[FROM:([^\]]*)\]/);
  const toM = purposeStr.match(/\[TO:([^\]]*)\]/);
  const distM = purposeStr.match(/\[DIST:([^\]]*)\]/);
  const stripped = purposeStr
    .replace(/\[FROM:[^\]]*\]/g, "")
    .replace(/\[TO:[^\]]*\]/g, "")
    .replace(/\[DIST:[^\]]*\]/g, "")
    .replace(/\[GPS:[^\]]+\]\s*/g, "")
    .trim();
  return {
    from: fromM ? fromM[1] : "",
    to: toM ? toM[1] : "",
    dist: distM ? distM[1] : "",
    purpose: stripped,
  };
}

// ── Bulk Upload Types ─────────────────────────────────────────────────────────

type BulkRow = {
  date: string;
  clientName: string;
  from: string;
  to: string;
  distanceKm: string;
  purpose: string;
  // resolved after validation
  clientId?: bigint;
  error?: string;
  valid: boolean;
};

// Simple CSV parser (handles quoted fields)
function parseCSV(text: string): string[][] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.map((line) => {
    const fields: string[] = [];
    let inQuotes = false;
    let current = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  });
}

const emptyForm = {
  clientId: "",
  plannedDate: todayInputStr(),
  purpose: "",
  fromLocation: "",
  toLocation: "",
  distanceKm: "",
  capturedGps: null as { lat: number; lng: number } | null,
  capturingGps: false,
};

export default function VisitsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [completingVisit, setCompletingVisit] = useState<T | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");
  const [capturedCompleteGps, setCapturedCompleteGps] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [capturingCompleteGps, setCapturingCompleteGps] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // ── Bulk Upload State ──────────────────────────────────────────────────────
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([]);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const bulkFileRef = useRef<HTMLInputElement>(null);

  const { data: isAdmin } = useIsAdmin();
  const { data: allVisits, isLoading: allLoading } = useAllVisits();
  const { data: myVisits, isLoading: myLoading } = useMyVisits();
  const { data: clients } = useClients();
  const createVisit = useCreateVisit();
  const updateVisit = useUpdateVisit();
  const deleteVisit = useDeleteVisit();
  const { identity } = useInternetIdentity();

  const visits = isAdmin ? (allVisits ?? []) : (myVisits ?? []);
  const isLoading = isAdmin ? allLoading : myLoading;

  const getClientName = (id: bigint) =>
    clients?.find((c) => c.id === id)?.name ?? `Client #${id}`;

  const filtered = visits.filter(
    (v) => activeTab === "all" || v.status === activeTab,
  );

  const plannedCount = visits.filter((v) => v.status === "planned").length;
  const completedCount = visits.filter((v) => v.status === "completed").length;
  const todayCount = visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1_000_000n));
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }).length;

  // ── Travel Matrix ─────────────────────────────────────────────────────────
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthVisits = visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1_000_000n));
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const travelMatrix = (() => {
    const map = new Map<
      string,
      { clientId: bigint; count: number; lastVisit: bigint }
    >();
    for (const v of thisMonthVisits) {
      const key = v.clientId.toString();
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          clientId: v.clientId,
          count: 1,
          lastVisit: v.plannedDate,
        });
      } else {
        existing.count += 1;
        if (v.plannedDate > existing.lastVisit) {
          existing.lastVisit = v.plannedDate;
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  })();

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCaptureGpsForAdd = async () => {
    setForm((p) => ({ ...p, capturingGps: true }));
    const loc = await captureLocation();
    setForm((p) => ({ ...p, capturingGps: false }));
    if (loc) {
      setForm((p) => ({ ...p, capturedGps: loc }));
      toast.success(
        `Location captured: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`,
      );
    } else {
      toast.error("Could not capture location");
    }
  };

  const handleCaptureGpsForComplete = async () => {
    setCapturingCompleteGps(true);
    const loc = await captureLocation();
    setCapturingCompleteGps(false);
    if (loc) {
      setCapturedCompleteGps(loc);
      toast.success(
        `Location captured: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`,
      );
    } else {
      toast.error("Could not capture location");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !form.clientId) return;
    try {
      const travelPurpose = encodeTravelMeta(
        form.fromLocation,
        form.toLocation,
        form.distanceKm,
        form.purpose.trim(),
      );
      const purposeWithGps = form.capturedGps
        ? `${formatGPS(form.capturedGps.lat, form.capturedGps.lng)} ${travelPurpose}`
        : travelPurpose;
      await createVisit.mutateAsync({
        id: 0n,
        userId: identity.getPrincipal() as Principal,
        clientId: BigInt(form.clientId),
        plannedDate: dateInputToNs(form.plannedDate),
        purpose: purposeWithGps,
        status: Status.planned,
        completionNotes: "",
        completedAt: 0n,
      });
      toast.success("Visit planned");
      setForm(emptyForm);
      setAddOpen(false);
    } catch {
      toast.error("Failed to plan visit");
    }
  };

  const handleCompleteOpen = (visit: T) => {
    setCompletingVisit(visit);
    setCompletionNotes("");
    setCapturedCompleteGps(null);
    setCompleteOpen(true);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingVisit) return;
    try {
      const notesWithGps = capturedCompleteGps
        ? `${formatGPS(capturedCompleteGps.lat, capturedCompleteGps.lng)} ${completionNotes.trim()}`
        : completionNotes.trim();
      await updateVisit.mutateAsync({
        id: completingVisit.id,
        visit: {
          ...completingVisit,
          status: Status.completed,
          completionNotes: notesWithGps,
          completedAt: BigInt(Date.now()) * 1_000_000n,
        },
      });
      toast.success("Visit marked as completed");
      setCompleteOpen(false);
      setCompletingVisit(null);
    } catch {
      toast.error("Failed to update visit");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteVisit.mutateAsync(deleteId);
      toast.success("Visit deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete visit");
    }
  };

  // ── Bulk Upload Handlers ───────────────────────────────────────────────────

  const handleDownloadSampleCSV = () => {
    const header = "Date,Client Name,From,To,Distance (km),Purpose";
    const rows = [
      "2026-03-10,BRPL Barbil,Kolkata,Barbil,320,Payment follow-up discussion",
      "2026-03-11,JSL Jajpur,Barbil,Jajpur,180,Ceramic liner inquiry",
      "2026-03-12,Rashmi Metallic,Jajpur,Kharagpur,210,Roller offer presentation",
    ];
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visit_plan_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length < 2) {
        toast.error("CSV file is empty or has no data rows");
        return;
      }
      // Skip header row
      const dataRows = parsed.slice(1);
      const clientList = clients ?? [];
      const validated: BulkRow[] = dataRows.map((cols) => {
        const [
          date = "",
          clientName = "",
          from = "",
          to = "",
          dist = "",
          ...purposeParts
        ] = cols;
        const purpose = purposeParts.join(",").trim();
        const row: BulkRow = {
          date: date.trim(),
          clientName: clientName.trim(),
          from: from.trim(),
          to: to.trim(),
          distanceKm: dist.trim(),
          purpose,
          valid: false,
        };
        // Validate date
        if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
          row.error = "Invalid date (use YYYY-MM-DD)";
          return row;
        }
        // Validate client
        const matched = clientList.find(
          (c) =>
            c.name.toLowerCase() === row.clientName.toLowerCase() ||
            (c.company &&
              c.company.toLowerCase() === row.clientName.toLowerCase()),
        );
        if (!matched) {
          row.error = `Client not found: "${row.clientName}"`;
          return row;
        }
        row.clientId = matched.id;
        row.valid = true;
        return row;
      });
      setBulkRows(validated);
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (!identity) return;
    const validRows = bulkRows.filter(
      (r) => r.valid && r.clientId !== undefined,
    );
    setBulkImporting(true);
    setBulkProgress({ done: 0, total: validRows.length });
    let succeeded = 0;
    let skipped = 0;
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        const purposeEncoded = encodeTravelMeta(
          row.from,
          row.to,
          row.distanceKm,
          row.purpose,
        );
        await createVisit.mutateAsync({
          id: 0n,
          userId: identity.getPrincipal() as Principal,
          clientId: row.clientId!,
          plannedDate: dateInputToNs(row.date),
          purpose: purposeEncoded,
          status: Status.planned,
          completionNotes: "",
          completedAt: 0n,
        });
        succeeded++;
      } catch {
        skipped++;
      }
      setBulkProgress({ done: i + 1, total: validRows.length });
    }
    setBulkImporting(false);
    setBulkProgress(null);
    toast.success(
      `${succeeded} visit${succeeded !== 1 ? "s" : ""} planned successfully${skipped > 0 ? `, ${skipped} skipped` : ""}`,
    );
    setBulkOpen(false);
    setBulkRows([]);
    if (bulkFileRef.current) bulkFileRef.current.value = "";
  };

  const validBulkCount = bulkRows.filter((r) => r.valid).length;

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarCheck size={24} className="text-primary" />
            Visit Planner
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isAdmin ? "All staff visits" : "Plan and track your client visits"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {filtered.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              data-ocid="visits.pdf.button"
              onClick={() => {
                const tabLabel =
                  activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
                printVisitsPDF(filtered, tabLabel, getClientName);
              }}
              className="gap-2"
            >
              <FileDown size={15} />
              Export PDF
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            data-ocid="visits.bulk_upload.button"
            onClick={() => {
              setBulkRows([]);
              if (bulkFileRef.current) bulkFileRef.current.value = "";
              setBulkOpen(true);
            }}
            className="gap-2"
          >
            <FileUp size={15} />
            Bulk Upload
          </Button>
          <Button
            data-ocid="visits.add_button"
            onClick={() => setAddOpen(true)}
            className="gap-2"
          >
            <Plus size={16} />
            Plan Visit
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium">Today</p>
            <p className="font-display text-2xl font-bold text-blue-600 mt-1">
              {todayCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium">Planned</p>
            <p className="font-display text-2xl font-bold text-amber-600 mt-1">
              {plannedCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground font-medium">
              Completed
            </p>
            <p className="font-display text-2xl font-bold text-emerald-600 mt-1">
              {completedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              data-ocid="visits.filter.tab"
              className="capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_TABS.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="rounded-lg border border-border overflow-hidden shadow-xs mt-4">
              <Table data-ocid="visits.table">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">
                      Route / Purpose
                    </TableHead>
                    {isAdmin && (
                      <TableHead className="font-semibold hidden lg:table-cell">
                        Staff
                      </TableHead>
                    )}
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right w-36">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                      <TableRow key={`skeleton-${i}`}>
                        {Array.from({ length: 6 }).map((__, j) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                          <TableCell key={`cell-${j}`}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        data-ocid="visits.empty_state"
                        className="text-center py-12 text-muted-foreground"
                      >
                        <CalendarCheck
                          size={36}
                          className="mx-auto mb-2 opacity-30"
                        />
                        <p className="text-sm">No visits in this category</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((visit, idx) => {
                      const gps = parseGPS(
                        visit.completionNotes || visit.purpose,
                      );
                      const meta = decodeTravelMeta(visit.purpose);
                      const showRoute = meta.from || meta.to;
                      return (
                        <TableRow
                          key={visit.id.toString()}
                          data-ocid={`visits.item.${idx + 1}`}
                          className="hover:bg-muted/20"
                        >
                          <TableCell className="font-medium">
                            {formatDate(visit.plannedDate)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {getClientName(visit.clientId)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground max-w-[220px]">
                            {showRoute ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                                  <span>{meta.from || "—"}</span>
                                  <ArrowRight size={10} />
                                  <span>{meta.to || "—"}</span>
                                  {meta.dist && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1 py-0"
                                    >
                                      {meta.dist} km
                                    </Badge>
                                  )}
                                </div>
                                {meta.purpose && (
                                  <p className="truncate text-xs text-muted-foreground">
                                    {meta.purpose}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="truncate block">
                                {meta.purpose || "—"}
                              </span>
                            )}
                          </TableCell>
                          {isAdmin && (
                            <TableCell className="hidden lg:table-cell text-xs font-mono text-muted-foreground">
                              {visit.userId.toString().slice(0, 12)}…
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <StatusBadge status={visit.status} />
                              {gps && (
                                <a
                                  href={gpsToMapsURL(gps.lat, gps.lng)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`}
                                  className="text-primary hover:text-primary/70 transition-colors"
                                >
                                  <MapPin size={13} />
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              {visit.status === "planned" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-ocid={`visits.complete_button.${idx + 1}`}
                                  onClick={() => handleCompleteOpen(visit)}
                                  className="h-7 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                >
                                  <CheckCircle2 size={12} />
                                  Complete
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                data-ocid={`visits.delete_button.${idx + 1}`}
                                onClick={() => setDeleteId(visit.id)}
                                className="h-7 w-7 text-destructive hover:text-destructive"
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Travel Matrix */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              This Month's Travel Matrix
            </CardTitle>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {thisMonthVisits.length} visit
              {thisMonthVisits.length !== 1 ? "s" : ""} in{" "}
              {now.toLocaleString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {travelMatrix.length === 0 ? (
            <div
              data-ocid="travel.empty_state"
              className="text-center py-8 text-muted-foreground"
            >
              <MapPinOff size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No visits this month yet</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table data-ocid="travel.table">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold text-center">
                      Visits This Month
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Last Visit
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {travelMatrix.map((row, idx) => (
                    <TableRow
                      key={row.clientId.toString()}
                      data-ocid={`travel.item.${idx + 1}`}
                      className="hover:bg-muted/20"
                    >
                      <TableCell className="font-medium">
                        {getClientName(row.clientId)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {row.count}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatDate(row.lastVisit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Visit Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          setAddOpen(o);
          if (!o) setForm(emptyForm);
        }}
      >
        <DialogContent className="max-w-lg" data-ocid="visits.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Plan New Visit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Client *</Label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => setForm((p) => ({ ...p, clientId: v }))}
                >
                  <SelectTrigger data-ocid="visits.client.select">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {(clients ?? []).map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name} – {c.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Planned Date *</Label>
                <Input
                  data-ocid="visits.date.input"
                  type="date"
                  value={form.plannedDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, plannedDate: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            {/* From / To / Distance */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>From (optional)</Label>
                <Input
                  data-ocid="visits.from.input"
                  value={form.fromLocation}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fromLocation: e.target.value }))
                  }
                  placeholder="Departure"
                />
              </div>
              <div className="space-y-1.5">
                <Label>To (optional)</Label>
                <Input
                  data-ocid="visits.to.input"
                  value={form.toLocation}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, toLocation: e.target.value }))
                  }
                  placeholder="Destination"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Distance (km)</Label>
                <Input
                  data-ocid="visits.distance.input"
                  type="number"
                  min="0"
                  value={form.distanceKm}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, distanceKm: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Purpose *</Label>
              <Textarea
                data-ocid="visits.purpose.textarea"
                value={form.purpose}
                onChange={(e) =>
                  setForm((p) => ({ ...p, purpose: e.target.value }))
                }
                rows={3}
                placeholder="Purpose of this visit..."
                required
              />
            </div>
            {/* Optional location capture */}
            <div className="space-y-1.5">
              <Label>Current Location (optional)</Label>
              {form.capturedGps ? (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
                  <MapPin
                    size={14}
                    className="text-emerald-600 flex-shrink-0"
                  />
                  <span className="text-emerald-700 font-mono text-xs flex-1">
                    📍 {form.capturedGps.lat.toFixed(5)},{" "}
                    {form.capturedGps.lng.toFixed(5)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, capturedGps: null }))
                    }
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <MapPinOff size={13} />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="visits.capture_location.button"
                  onClick={handleCaptureGpsForAdd}
                  disabled={form.capturingGps}
                  className="w-full gap-2 text-xs"
                >
                  {form.capturingGps ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <MapPin size={13} />
                  )}
                  {form.capturingGps
                    ? "Capturing…"
                    : "Capture Current Location"}
                </Button>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="visits.add.cancel_button"
                onClick={() => {
                  setForm(emptyForm);
                  setAddOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="visits.add.save_button"
                disabled={createVisit.isPending || !form.clientId}
              >
                {createVisit.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Plan Visit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complete Visit Dialog */}
      <Dialog
        open={completeOpen}
        onOpenChange={(o) => {
          setCompleteOpen(o);
          if (!o) setCapturedCompleteGps(null);
        }}
      >
        <DialogContent className="max-w-md" data-ocid="visits.complete.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Mark Visit as Completed
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleComplete} className="space-y-4 mt-2">
            {/* Live Location Capture */}
            <div className="space-y-1.5">
              <Label>Live Location</Label>
              {capturedCompleteGps ? (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
                  <MapPin
                    size={14}
                    className="text-emerald-600 flex-shrink-0"
                  />
                  <span className="text-emerald-700 font-mono text-xs flex-1">
                    📍 {capturedCompleteGps.lat.toFixed(5)},{" "}
                    {capturedCompleteGps.lng.toFixed(5)}
                  </span>
                  <a
                    href={gpsToMapsURL(
                      capturedCompleteGps.lat,
                      capturedCompleteGps.lng,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-800 text-xs underline"
                  >
                    View
                  </a>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="visits.capture_complete_location.button"
                  onClick={handleCaptureGpsForComplete}
                  disabled={capturingCompleteGps}
                  className="w-full gap-2 text-xs"
                >
                  {capturingCompleteGps ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <MapPin size={13} />
                  )}
                  {capturingCompleteGps
                    ? "Capturing…"
                    : "Capture Live Location"}
                </Button>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Completion Notes</Label>
              <Textarea
                data-ocid="visits.completion.textarea"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={4}
                placeholder="What was discussed, achieved, or noted during the visit..."
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="visits.complete.cancel_button"
                onClick={() => {
                  setCompleteOpen(false);
                  setCapturedCompleteGps(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="visits.complete.confirm_button"
                disabled={updateVisit.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {updateVisit.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Mark Completed
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog
        open={bulkOpen}
        onOpenChange={(o) => {
          if (!bulkImporting) {
            setBulkOpen(o);
            if (!o) {
              setBulkRows([]);
              if (bulkFileRef.current) bulkFileRef.current.value = "";
            }
          }
        }}
      >
        <DialogContent
          className="max-w-2xl w-full"
          data-ocid="visits.bulk_upload.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <FileUp size={18} className="text-primary" />
              Bulk Upload Visit Plan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Step 1 */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Step 1: Download Template
              </p>
              <p className="text-xs text-muted-foreground">
                Download the sample CSV, fill in your visit plan, then upload it
                below.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleDownloadSampleCSV}
              >
                <FileDown size={14} />
                Download Sample CSV
              </Button>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Step 2: Upload Filled CSV
              </p>
              <label
                htmlFor="bulk-csv-input"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer p-6 text-center"
                data-ocid="visits.bulk_upload.dropzone"
              >
                <FileUp size={24} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to select CSV file
                </span>
                <input
                  id="bulk-csv-input"
                  ref={bulkFileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  data-ocid="visits.bulk_upload.upload_button"
                  onChange={handleBulkFileChange}
                  disabled={bulkImporting}
                />
              </label>
            </div>

            {/* Preview Table */}
            {bulkRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    Preview ({bulkRows.length} rows)
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-600 font-medium">
                      {validBulkCount} valid
                    </span>
                    {bulkRows.length - validBulkCount > 0 && (
                      <span className="text-destructive font-medium">
                        {bulkRows.length - validBulkCount} errors
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-border overflow-hidden max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-xs font-semibold py-2">
                          Date
                        </TableHead>
                        <TableHead className="text-xs font-semibold py-2">
                          Client
                        </TableHead>
                        <TableHead className="text-xs font-semibold py-2 hidden sm:table-cell">
                          From→To
                        </TableHead>
                        <TableHead className="text-xs font-semibold py-2 hidden sm:table-cell">
                          Purpose
                        </TableHead>
                        <TableHead className="text-xs font-semibold py-2">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulkRows.map((row, idx) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: bulk preview list
                        <TableRow key={idx} className="hover:bg-muted/10">
                          <TableCell className="text-xs py-1.5">
                            {row.date || "—"}
                          </TableCell>
                          <TableCell className="text-xs py-1.5 max-w-[100px] truncate">
                            {row.clientName || "—"}
                          </TableCell>
                          <TableCell className="text-xs py-1.5 hidden sm:table-cell">
                            {row.from || row.to ? (
                              <span className="flex items-center gap-1">
                                <span>{row.from || "—"}</span>
                                <ArrowRight size={10} />
                                <span>{row.to || "—"}</span>
                                {row.distanceKm && (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] px-1 py-0"
                                  >
                                    {row.distanceKm} km
                                  </Badge>
                                )}
                              </span>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="text-xs py-1.5 hidden sm:table-cell max-w-[140px] truncate text-muted-foreground">
                            {row.purpose || "—"}
                          </TableCell>
                          <TableCell className="py-1.5">
                            {row.valid ? (
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                                Valid
                              </Badge>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="text-[10px] px-1.5 py-0 whitespace-nowrap"
                                title={row.error}
                              >
                                {row.error ?? "Error"}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Progress bar */}
            {bulkProgress && (
              <div
                data-ocid="visits.bulk_upload.loading_state"
                className="space-y-1.5"
              >
                <p className="text-xs text-muted-foreground text-center">
                  Importing {bulkProgress.done}/{bulkProgress.total}…
                </p>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(bulkProgress.done / bulkProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="visits.bulk_upload.cancel_button"
              onClick={() => {
                setBulkOpen(false);
                setBulkRows([]);
                if (bulkFileRef.current) bulkFileRef.current.value = "";
              }}
              disabled={bulkImporting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="visits.bulk_upload.import_button"
              disabled={validBulkCount === 0 || bulkImporting || !identity}
              onClick={handleBulkImport}
              className="gap-2"
            >
              {bulkImporting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <FileUp size={14} />
              )}
              {bulkImporting
                ? "Importing…"
                : `Import ${validBulkCount} Valid Visit${validBulkCount !== 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="visits.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Visit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this visit log?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="visits.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="visits.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteVisit.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
