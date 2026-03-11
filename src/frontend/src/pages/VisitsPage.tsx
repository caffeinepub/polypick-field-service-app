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
  ArrowLeft,
  ArrowRight,
  Ban,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  FileDown,
  FileSpreadsheet,
  FileUp,
  Loader2,
  MapPin,
  MapPinOff,
  Plus,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
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

// ── Monthly PDF print helper ─────────────────────────────────────────────────

function printMonthlyVisitsPDF(
  visits: T[],
  monthYear: string,
  getClientName: (id: bigint) => string,
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const genDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Group visits by date
  const byDate = new Map<string, T[]>();
  for (const v of visits) {
    const d = new Date(Number(v.plannedDate / 1_000_000n));
    const key = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(v);
  }

  const sortedDates = Array.from(byDate.keys()).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const sections = sortedDates
    .map((dateKey) => {
      const dayVisits = byDate.get(dateKey)!;
      const rows = dayVisits
        .map((v) => {
          const meta = decodeTravelMeta(v.purpose);
          const route =
            meta.from || meta.to
              ? `${meta.from || "—"} → ${meta.to || "—"}${meta.dist ? ` (${meta.dist} km)` : ""}`
              : "—";
          return `<tr>
            <td>${getClientName(v.clientId)}</td>
            <td>${route}</td>
            <td>${meta.dist ? `${meta.dist} km` : "—"}</td>
            <td style="text-transform:capitalize">${v.status}</td>
            <td>${meta.purpose || "—"}</td>
          </tr>`;
        })
        .join("");
      return `
      <div class="date-section">
        <h3>${dateKey}</h3>
        <table>
          <thead>
            <tr><th>Client</th><th>Route</th><th>Distance</th><th>Status</th><th>Purpose</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    })
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monthly Visit Plan – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        .date-section { margin-bottom: 20px; page-break-inside: avoid; }
        .date-section h3 { background: #f0f0f0; padding: 6px 10px; margin: 0 0 4px 0; font-size: 13px; border-left: 3px solid #222; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8f8f8; padding: 6px 5px; text-align: left; font-size: 11px; border: 1px solid #ccc; }
        td { padding: 5px; border: 1px solid #ddd; font-size: 11px; }
        tr:nth-child(even) td { background: #fafafa; }
        @media print { body { margin: 10px; } .date-section { page-break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>Monthly Visit Plan – ${monthYear}</p>
        <p>Total Visits: ${visits.length} &nbsp;|&nbsp; Generated: ${genDate}</p>
      </div>
      ${sections || "<p style='text-align:center;color:#888'>No visits for this month.</p>"}
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

// ── Calendar helpers ─────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getVisitsForDay(
  visits: T[],
  year: number,
  month: number,
  day: number,
): T[] {
  return visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1_000_000n));
    return (
      d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    );
  });
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

  // ── Check-in / Check-out State ───────────────────────────────────────────────
  const [checkInMap, setCheckInMap] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("polypick_visit_checkins") ?? "{}",
      );
    } catch {
      return {};
    }
  });
  const [checkOutMap, setCheckOutMap] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("polypick_visit_checkouts") ?? "{}",
      );
    } catch {
      return {};
    }
  });

  const handleCheckIn = (visitId: string) => {
    const now = new Date().toISOString();
    const updated = { ...checkInMap, [visitId]: now };
    setCheckInMap(updated);
    localStorage.setItem("polypick_visit_checkins", JSON.stringify(updated));
    toast.success("Checked in!");
  };

  const handleCheckOut = (visitId: string) => {
    const now = new Date().toISOString();
    const updated = { ...checkOutMap, [visitId]: now };
    setCheckOutMap(updated);
    localStorage.setItem("polypick_visit_checkouts", JSON.stringify(updated));
    toast.success("Checked out!");
  };

  const formatDuration = (checkIn: string, checkOut: string) => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    if (diff <= 0) return "—";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // ── Cancel Visit State ─────────────────────────────────────────────────────
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancellingVisit, setCancellingVisit] = useState<T | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // ── Copy Last Month State ──────────────────────────────────────────────────
  const [copyOpen, setCopyOpen] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  // ── Calendar State ────────────────────────────────────────────────────────
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calSelectedDay, setCalSelectedDay] = useState<number | null>(null);

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

  // ── Calendar month visits ─────────────────────────────────────────────────
  const calMonthVisits = visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1_000_000n));
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  });

  // ── Last month info ───────────────────────────────────────────────────────
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthName = MONTH_NAMES[lastMonthDate.getMonth()];
  const lastMonthYear = lastMonthDate.getFullYear();
  const currentMonthName = MONTH_NAMES[currentMonth];

  const lastMonthPlannedVisits = visits.filter((v) => {
    const d = new Date(Number(v.plannedDate / 1_000_000n));
    return (
      d.getFullYear() === lastMonthYear &&
      d.getMonth() === lastMonthDate.getMonth() &&
      v.status === "planned"
    );
  });

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

  // ── Cancel Visit Handler ──────────────────────────────────────────────────

  const handleCancelOpen = (visit: T) => {
    setCancellingVisit(visit);
    setCancelReason("");
    setCancelOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancellingVisit) return;
    try {
      await updateVisit.mutateAsync({
        id: cancellingVisit.id,
        visit: {
          ...cancellingVisit,
          status: Status.cancelled,
          completionNotes: cancelReason.trim()
            ? `Cancelled: ${cancelReason.trim()}`
            : "Cancelled",
        },
      });
      toast.success("Visit cancelled");
      setCancelOpen(false);
      setCancellingVisit(null);
    } catch {
      toast.error("Failed to cancel visit");
    }
  };

  // ── Copy Last Month Handler ───────────────────────────────────────────────

  const handleCopyLastMonth = async () => {
    if (!identity || lastMonthPlannedVisits.length === 0) return;
    setIsCopying(true);
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    let copied = 0;
    let skipped = 0;
    for (const v of lastMonthPlannedVisits) {
      const lastD = new Date(Number(v.plannedDate / 1_000_000n));
      const dayOfMonth = lastD.getDate();
      // Skip if day doesn't exist in current month (e.g. Feb 30)
      if (dayOfMonth > daysInCurrentMonth) {
        skipped++;
        continue;
      }
      const newDate = new Date(currentYear, currentMonth, dayOfMonth);
      const yyyy = newDate.getFullYear();
      const mm = String(newDate.getMonth() + 1).padStart(2, "0");
      const dd = String(newDate.getDate()).padStart(2, "0");
      try {
        await createVisit.mutateAsync({
          id: 0n,
          userId: identity.getPrincipal() as Principal,
          clientId: v.clientId,
          plannedDate: dateInputToNs(`${yyyy}-${mm}-${dd}`),
          purpose: v.purpose,
          status: Status.planned,
          completionNotes: "",
          completedAt: 0n,
        });
        copied++;
      } catch {
        skipped++;
      }
    }
    setIsCopying(false);
    setCopyOpen(false);
    toast.success(
      `${copied} visit${copied !== 1 ? "s" : ""} copied from ${lastMonthName} to ${currentMonthName}${skipped > 0 ? ` (${skipped} skipped)` : ""}`,
    );
  };

  // ── Export Monthly Excel ──────────────────────────────────────────────────

  const handleExportMonthlyExcel = () => {
    const monthVisits = visits.filter((v) => {
      const d = new Date(Number(v.plannedDate / 1_000_000n));
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });
    const rows = monthVisits.map((v) => {
      const meta = decodeTravelMeta(v.purpose);
      const d = new Date(Number(v.plannedDate / 1_000_000n));
      return {
        Date: d.toLocaleDateString("en-CA"), // YYYY-MM-DD
        Client: getClientName(v.clientId),
        From: meta.from || "",
        To: meta.to || "",
        "Distance (km)": meta.dist || "",
        Purpose: meta.purpose || "",
        Status: v.status,
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visit Plan");
    const monthStr = `${MONTH_NAMES[currentMonth]}${currentYear}`;
    XLSX.writeFile(wb, `visit_plan_${monthStr}.xlsx`);
    toast.success("Excel exported");
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

  const parseBulkRows = (
    data: string[][],
    clientList: { id: bigint; name: string; company?: string }[],
  ): BulkRow[] => {
    const dataRows = data.slice(1);
    return dataRows.map((cols) => {
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
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const clientList = clients ?? [];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "xlsx" || ext === "xls") {
      // Parse Excel with SheetJS
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          // Convert to array of arrays (header + rows)
          const rows: string[][] = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
            raw: false,
          }) as string[][];
          if (rows.length < 2) {
            toast.error("Excel file is empty or has no data rows");
            return;
          }
          setBulkRows(parseBulkRows(rows, clientList));
        } catch {
          toast.error("Failed to parse Excel file");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Parse CSV
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length < 2) {
          toast.error("CSV file is empty or has no data rows");
          return;
        }
        setBulkRows(parseBulkRows(parsed, clientList));
      };
      reader.readAsText(file);
    }
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

  // ── Calendar nav ──────────────────────────────────────────────────────────

  const handleCalPrev = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
    setCalSelectedDay(null);
  };

  const handleCalNext = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
    setCalSelectedDay(null);
  };

  const selectedDayVisits =
    calSelectedDay !== null
      ? getVisitsForDay(visits, calYear, calMonth, calSelectedDay)
      : [];

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
        <div className="flex flex-wrap items-center gap-2">
          {filtered.length > 0 && activeTab !== "calendar" && (
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
            data-ocid="visits.monthly_pdf.button"
            onClick={() => {
              const monthVisits = visits.filter((v) => {
                const d = new Date(Number(v.plannedDate / 1_000_000n));
                return (
                  d.getFullYear() === currentYear &&
                  d.getMonth() === currentMonth
                );
              });
              printMonthlyVisitsPDF(
                monthVisits,
                `${MONTH_NAMES[currentMonth]} ${currentYear}`,
                getClientName,
              );
            }}
            className="gap-2"
          >
            <FileDown size={15} />
            Monthly PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            data-ocid="visits.export_excel.button"
            onClick={handleExportMonthlyExcel}
            className="gap-2"
          >
            <FileSpreadsheet size={15} />
            Export Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            data-ocid="visits.copy_last_month.button"
            onClick={() => setCopyOpen(true)}
            className="gap-2"
          >
            <Copy size={15} />
            Copy Last Month
          </Button>
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

      {/* Table with Tabs + Calendar */}
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
          <TabsTrigger
            value="calendar"
            data-ocid="visits.calendar.tab"
            className="gap-1.5"
          >
            <CalendarDays size={14} />
            Calendar
          </TabsTrigger>
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
                    <TableHead className="font-semibold text-right w-40">
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
                                <>
                                  {!checkInMap[visit.id.toString()] ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      data-ocid={`visits.checkin_button.${idx + 1}`}
                                      onClick={() =>
                                        handleCheckIn(visit.id.toString())
                                      }
                                      className="h-7 text-xs gap-1 text-blue-700 border-blue-200 hover:bg-blue-50"
                                    >
                                      <Clock size={12} />
                                      Check In
                                    </Button>
                                  ) : !checkOutMap[visit.id.toString()] ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      data-ocid="visits.checkout_button"
                                      onClick={() =>
                                        handleCheckOut(visit.id.toString())
                                      }
                                      className="h-7 text-xs gap-1 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                                    >
                                      <Clock size={12} />
                                      Check Out
                                    </Button>
                                  ) : (
                                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                                      <Clock size={11} />
                                      {formatDuration(
                                        checkInMap[visit.id.toString()],
                                        checkOutMap[visit.id.toString()],
                                      )}
                                    </span>
                                  )}
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
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    data-ocid={`visits.cancel_button.${idx + 1}`}
                                    onClick={() => handleCancelOpen(visit)}
                                    className="h-7 text-xs gap-1 text-red-700 border-red-200 hover:bg-red-50"
                                  >
                                    <Ban size={12} />
                                    Cancel
                                  </Button>
                                </>
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

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <div className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-ocid="visits.calendar.prev_button"
                    onClick={handleCalPrev}
                    className="h-8 w-8"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <CardTitle className="font-display text-base">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-ocid="visits.calendar.next_button"
                    onClick={handleCalNext}
                    className="h-8 w-8"
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-semibold text-muted-foreground py-1"
                      >
                        {d}
                      </div>
                    ),
                  )}
                </div>
                {/* Calendar grid */}
                <CalendarGrid
                  year={calYear}
                  month={calMonth}
                  visits={calMonthVisits}
                  selectedDay={calSelectedDay}
                  onSelectDay={(day) =>
                    setCalSelectedDay((prev) => (prev === day ? null : day))
                  }
                />

                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Planned
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Completed
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                    Cancelled
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected day panel */}
            {calSelectedDay !== null && (
              <Card data-ocid="visits.calendar.panel">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-sm flex items-center gap-2">
                    <CalendarCheck size={15} className="text-primary" />
                    {calSelectedDay} {MONTH_NAMES[calMonth]} {calYear} —{" "}
                    {selectedDayVisits.length} visit
                    {selectedDayVisits.length !== 1 ? "s" : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {selectedDayVisits.length === 0 ? (
                    <p
                      className="text-sm text-muted-foreground py-4 text-center"
                      data-ocid="visits.calendar.empty_state"
                    >
                      No visits on this day
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedDayVisits.map((v, i) => {
                        const meta = decodeTravelMeta(v.purpose);
                        return (
                          <li
                            key={v.id.toString()}
                            data-ocid={`visits.calendar.item.${i + 1}`}
                            className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 border border-border"
                          >
                            <StatusBadge status={v.status} />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm">
                                {getClientName(v.clientId)}
                              </p>
                              {(meta.from || meta.to) && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  {meta.from || "—"}
                                  <ArrowRight size={10} />
                                  {meta.to || "—"}
                                  {meta.dist && ` (${meta.dist} km)`}
                                </p>
                              )}
                              {meta.purpose && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {meta.purpose}
                                </p>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
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

      {/* Cancel Visit Dialog */}
      <Dialog
        open={cancelOpen}
        onOpenChange={(o) => {
          if (!updateVisit.isPending) {
            setCancelOpen(o);
            if (!o) setCancellingVisit(null);
          }
        }}
      >
        <DialogContent className="max-w-sm" data-ocid="visits.cancel.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Ban size={18} className="text-destructive" />
              Cancel Visit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {cancellingVisit && (
              <p className="text-sm text-muted-foreground">
                Cancel visit to{" "}
                <span className="font-medium text-foreground">
                  {getClientName(cancellingVisit.clientId)}
                </span>{" "}
                on{" "}
                <span className="font-medium text-foreground">
                  {formatDate(cancellingVisit.plannedDate)}
                </span>
                ?
              </p>
            )}
            <div className="space-y-1.5">
              <Label>Reason (optional)</Label>
              <Textarea
                data-ocid="visits.cancel.textarea"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="Why is this visit being cancelled?"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="visits.cancel.cancel_button"
              onClick={() => {
                setCancelOpen(false);
                setCancellingVisit(null);
              }}
              disabled={updateVisit.isPending}
            >
              Keep Visit
            </Button>
            <Button
              type="button"
              variant="destructive"
              data-ocid="visits.cancel.confirm_button"
              onClick={handleCancelConfirm}
              disabled={updateVisit.isPending}
              className="gap-2"
            >
              {updateVisit.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Ban size={14} />
              )}
              Cancel Visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Last Month Dialog */}
      <Dialog
        open={copyOpen}
        onOpenChange={(o) => {
          if (!isCopying) setCopyOpen(o);
        }}
      >
        <DialogContent className="max-w-sm" data-ocid="visits.copy.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Copy size={18} className="text-primary" />
              Copy Last Month's Plan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <p className="text-sm text-muted-foreground">
              Copy all{" "}
              <span className="font-medium text-foreground">
                {lastMonthPlannedVisits.length} planned visit
                {lastMonthPlannedVisits.length !== 1 ? "s" : ""}
              </span>{" "}
              from{" "}
              <span className="font-medium text-foreground">
                {lastMonthName} {lastMonthYear}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {currentMonthName} {currentYear}
              </span>
              ?
            </p>
            {lastMonthPlannedVisits.length === 0 && (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                No planned visits found in {lastMonthName} {lastMonthYear}.
              </p>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="visits.copy.cancel_button"
              onClick={() => setCopyOpen(false)}
              disabled={isCopying}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="visits.copy.confirm_button"
              onClick={handleCopyLastMonth}
              disabled={isCopying || lastMonthPlannedVisits.length === 0}
              className="gap-2"
            >
              {isCopying ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Copy size={14} />
              )}
              {isCopying ? "Copying…" : "Copy Visits"}
            </Button>
          </DialogFooter>
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
                Step 2: Upload Filled CSV or Excel File
              </p>
              <label
                htmlFor="bulk-csv-input"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer p-6 text-center"
                data-ocid="visits.bulk_upload.dropzone"
              >
                <FileUp size={24} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to select CSV or Excel file
                </span>
                <span className="text-xs text-muted-foreground/70">
                  Supported: .csv, .xlsx
                </span>
                <input
                  id="bulk-csv-input"
                  ref={bulkFileRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
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

// ── Calendar Grid Component ──────────────────────────────────────────────────

function CalendarGrid({
  year,
  month,
  visits,
  selectedDay,
  onSelectDay,
}: {
  year: number;
  month: number;
  visits: T[];
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="grid grid-cols-7 gap-0.5">
      {cells.map((day, i) => {
        if (day === null) {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: calendar grid
            <div key={`empty-${i}`} className="h-12 rounded-md" />
          );
        }
        const dayVisits = getVisitsForDay(visits, year, month, day);
        const isToday = isCurrentMonth && today.getDate() === day;
        const isSelected = selectedDay === day;
        const plannedVisits = dayVisits.filter((v) => v.status === "planned");
        const completedVisits = dayVisits.filter(
          (v) => v.status === "completed",
        );
        const cancelledVisits = dayVisits.filter(
          (v) => v.status === "cancelled",
        );

        return (
          <button
            key={day}
            type="button"
            data-ocid="visits.calendar.toggle"
            onClick={() => onSelectDay(day)}
            className={[
              "h-12 rounded-md flex flex-col items-center justify-start pt-1 text-xs transition-colors relative cursor-pointer",
              isSelected
                ? "bg-primary text-primary-foreground"
                : isToday
                  ? "bg-primary/10 text-primary font-bold"
                  : "hover:bg-muted/50",
            ].join(" ")}
          >
            <span
              className={[
                "text-xs font-medium",
                isSelected ? "text-primary-foreground" : "",
              ].join(" ")}
            >
              {day}
            </span>
            {dayVisits.length > 0 && (
              <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center px-0.5">
                {plannedVisits.length > 0 && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                )}
                {completedVisits.length > 0 && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
                {cancelledVisits.length > 0 && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
