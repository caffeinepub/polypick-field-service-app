import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Package,
  Plus,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { exportCSV } from "../utils/exportUtils";

type Stage = "visit" | "inquiry" | "offer" | "order" | "dispatched";

interface ActivityEntry {
  id: string;
  client: string;
  date: string;
  stage: Stage;
  details: string;
  output: string;
  amount: string;
}

const STAGE_CONFIG: Record<
  Stage,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  visit: {
    label: "Client Visit",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: <Users size={14} />,
  },
  inquiry: {
    label: "Inquiry Received",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    icon: <TrendingUp size={14} />,
  },
  offer: {
    label: "Offer Sent",
    color: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    icon: <Send size={14} />,
  },
  order: {
    label: "Order Received",
    color: "text-green-700 dark:text-green-300",
    bg: "bg-green-100 dark:bg-green-900/30",
    icon: <ShoppingCart size={14} />,
  },
  dispatched: {
    label: "Dispatched",
    color: "text-teal-700 dark:text-teal-300",
    bg: "bg-teal-100 dark:bg-teal-900/30",
    icon: <Package size={14} />,
  },
};

const STAGE_ORDER: Stage[] = [
  "visit",
  "inquiry",
  "offer",
  "order",
  "dispatched",
];

const EMPTY: Omit<ActivityEntry, "id"> = {
  client: "",
  date: new Date().toISOString().split("T")[0],
  stage: "visit",
  details: "",
  output: "",
  amount: "",
};

function StageBadge({ stage }: { stage: Stage }) {
  const cfg = STAGE_CONFIG[stage];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export default function ActivityTrackerPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [filter, setFilter] = useState<Stage | "all">("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<ActivityEntry | null>(null);
  const [form, setForm] = useState<Omit<ActivityEntry, "id">>(EMPTY);
  const clientRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("polypick_activity_entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  function persist(updated: ActivityEntry[]) {
    setEntries(updated);
    localStorage.setItem("polypick_activity_entries", JSON.stringify(updated));
  }

  function openAdd() {
    setEditEntry(null);
    setForm(EMPTY);
    setDialogOpen(true);
  }

  function openEdit(entry: ActivityEntry) {
    setEditEntry(entry);
    setForm({
      client: entry.client,
      date: entry.date,
      stage: entry.stage,
      details: entry.details,
      output: entry.output,
      amount: entry.amount,
    });
    setDialogOpen(true);
  }

  function saveEntry() {
    if (!form.client.trim()) {
      toast.error("Client name is required");
      clientRef.current?.focus();
      return;
    }
    if (editEntry) {
      const updated = entries.map((e) =>
        e.id === editEntry.id ? { ...form, id: editEntry.id } : e,
      );
      persist(updated);
      toast.success("Entry updated");
    } else {
      const newEntry: ActivityEntry = { ...form, id: Date.now().toString() };
      persist([newEntry, ...entries]);
      toast.success("Activity entry added");
    }
    setDialogOpen(false);
  }

  function deleteEntry(id: string) {
    persist(entries.filter((e) => e.id !== id));
    toast.success("Entry deleted");
  }

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const counts = STAGE_ORDER.reduce(
    (acc, s) => {
      acc[s] = monthEntries.filter((e) => e.stage === s).length;
      return acc;
    },
    {} as Record<Stage, number>,
  );

  const filtered = entries.filter((e) => {
    const matchStage = filter === "all" || e.stage === filter;
    const matchSearch =
      e.client.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  function exportPDF() {
    const rows = filtered
      .map(
        (e) =>
          `<tr><td>${e.client}</td><td>${STAGE_CONFIG[e.stage].label}</td><td>${e.date}</td><td>${e.details}</td><td>${e.output}</td><td>${e.amount ? `₹${e.amount}` : ""}</td></tr>`,
      )
      .join("");
    const html = `<html><head><title>Activity Report</title><style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h2>Polypick Activity Report</h2><p>Generated: ${new Date().toLocaleDateString()}</p><table><thead><tr><th>Client</th><th>Stage</th><th>Date</th><th>Details</th><th>Output</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.print();
    }
  }

  function exportExcelCSV() {
    const date = new Date().toISOString().split("T")[0];
    exportCSV(
      filtered.map((e) => ({
        Client: e.client,
        Stage: STAGE_CONFIG[e.stage].label,
        Date: e.date,
        Details: e.details,
        Output: e.output,
        Amount: e.amount ? `₹${e.amount}` : "",
      })),
      `Activity_Report_${date}.csv`,
    );
    toast.success("CSV exported!");
  }

  const summaryCards = [
    {
      stage: "visit" as Stage,
      label: "Visits",
      icon: <Users size={16} />,
      color: "text-blue-600",
    },
    {
      stage: "inquiry" as Stage,
      label: "Inquiries",
      icon: <TrendingUp size={16} />,
      color: "text-amber-600",
    },
    {
      stage: "offer" as Stage,
      label: "Offers",
      icon: <Send size={16} />,
      color: "text-orange-600",
    },
    {
      stage: "order" as Stage,
      label: "Orders",
      icon: <ShoppingCart size={16} />,
      color: "text-green-600",
    },
    {
      stage: "dispatched" as Stage,
      label: "Dispatched",
      icon: <Package size={16} />,
      color: "text-teal-600",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-24 pt-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Activity Tracker
            </h1>
            <p className="text-sm text-muted-foreground">
              Visit → Inquiry → Offer → Order → Dispatch
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            data-ocid="activity.export_pdf.button"
            variant="outline"
            size="sm"
            onClick={exportPDF}
            className="gap-1.5"
          >
            <Download size={14} />
            PDF
          </Button>
          <Button
            data-ocid="activity.export_excel.button"
            variant="outline"
            size="sm"
            onClick={exportExcelCSV}
            className="gap-1.5"
          >
            <FileSpreadsheet size={14} />
            CSV
          </Button>
          <Button
            data-ocid="activity.add.primary_button"
            size="sm"
            onClick={openAdd}
            className="gap-1.5"
          >
            <Plus size={14} />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {summaryCards.map((s) => (
          <Card
            key={s.stage}
            className="cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => setFilter(s.stage)}
          >
            <CardContent className="p-3 flex flex-col gap-1">
              <div className={`flex items-center gap-1.5 ${s.color}`}>
                {s.icon}
                <span className="text-xs font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {counts[s.stage]}
              </p>
              <p className="text-[10px] text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline progress bar */}
      <div className="flex items-center gap-1 bg-muted/40 rounded-xl p-3 overflow-x-auto">
        {STAGE_ORDER.map((s, i) => (
          <div key={s} className="flex items-center gap-1 min-w-fit">
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === s
                  ? `${STAGE_CONFIG[s].bg} ${STAGE_CONFIG[s].color} ring-2 ring-current`
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => setFilter(filter === s ? "all" : s)}
            >
              {STAGE_CONFIG[s].icon}
              {STAGE_CONFIG[s].label}
              <span className="ml-1 rounded-full bg-current/20 px-1.5 py-0.5 text-[10px]">
                {entries.filter((e) => e.stage === s).length}
              </span>
            </button>
            {i < STAGE_ORDER.length - 1 && (
              <span className="text-muted-foreground/40 text-base">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="activity.search_input"
            placeholder="Search by client or details..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as Stage | "all")}
        >
          <TabsList className="h-9">
            <TabsTrigger
              data-ocid="activity.all.tab"
              value="all"
              className="text-xs"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              data-ocid="activity.visit.tab"
              value="visit"
              className="text-xs"
            >
              Visit
            </TabsTrigger>
            <TabsTrigger
              data-ocid="activity.inquiry.tab"
              value="inquiry"
              className="text-xs"
            >
              Inquiry
            </TabsTrigger>
            <TabsTrigger
              data-ocid="activity.offer.tab"
              value="offer"
              className="text-xs"
            >
              Offer
            </TabsTrigger>
            <TabsTrigger
              data-ocid="activity.order.tab"
              value="order"
              className="text-xs"
            >
              Order
            </TabsTrigger>
            <TabsTrigger
              data-ocid="activity.dispatched.tab"
              value="dispatched"
              className="text-xs"
            >
              Dispatched
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div
          data-ocid="activity.empty_state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Activity size={40} className="text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground font-medium">
            No activity entries found
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Add your first client visit or inquiry
          </p>
          <Button
            data-ocid="activity.empty.primary_button"
            className="mt-4 gap-1.5"
            onClick={openAdd}
          >
            <Plus size={14} /> Add Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="hidden md:grid grid-cols-[1fr_140px_100px_1fr_1fr_80px_80px] gap-3 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Client</span>
            <span>Stage</span>
            <span>Date</span>
            <span>Details</span>
            <span>Output</span>
            <span>Amount</span>
            <span>Actions</span>
          </div>
          {filtered.map((entry, idx) => (
            <Card
              key={entry.id}
              data-ocid={`activity.item.${idx + 1}`}
              className="hover:border-primary/30 transition-colors"
            >
              <CardContent className="p-4">
                {/* Mobile */}
                <div className="md:hidden space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {entry.client}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.date}
                      </p>
                    </div>
                    <StageBadge stage={entry.stage} />
                  </div>
                  {entry.details && (
                    <p className="text-sm text-muted-foreground">
                      {entry.details}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      {entry.output && (
                        <p className="text-xs">
                          <span className="text-muted-foreground">Output:</span>{" "}
                          {entry.output}
                        </p>
                      )}
                      {entry.amount && (
                        <p className="text-xs font-medium text-green-600">
                          ₹{entry.amount}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        data-ocid={`activity.edit_button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(entry)}
                        className="h-7 px-2 text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        data-ocid={`activity.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                        className="h-7 px-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[1fr_140px_100px_1fr_1fr_80px_80px] gap-3 items-center">
                  <span className="font-medium text-foreground truncate">
                    {entry.client}
                  </span>
                  <StageBadge stage={entry.stage} />
                  <span className="text-sm text-muted-foreground">
                    {entry.date}
                  </span>
                  <span className="text-sm text-muted-foreground truncate">
                    {entry.details || "—"}
                  </span>
                  <span className="text-sm truncate">
                    {entry.output || "—"}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {entry.amount ? `₹${entry.amount}` : "—"}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      data-ocid={`activity.edit_button.${idx + 1}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(entry)}
                      className="h-7 px-2 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      data-ocid={`activity.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="h-7 px-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="activity.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              {editEntry ? "Edit Activity" : "Add Activity Entry"}
            </DialogTitle>
          </DialogHeader>

          {/* Stage progress indicator */}
          <div className="flex items-center gap-1 mb-2 overflow-x-auto pb-1">
            {STAGE_ORDER.map((s, i) => (
              <div key={s} className="flex items-center gap-1 min-w-fit">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, stage: s }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    form.stage === s
                      ? `${STAGE_CONFIG[s].bg} ${STAGE_CONFIG[s].color} ring-1 ring-current`
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {STAGE_ORDER.indexOf(form.stage) > i ? (
                    <CheckCircle2 size={11} className="text-green-500" />
                  ) : (
                    STAGE_CONFIG[s].icon
                  )}
                  {STAGE_CONFIG[s].label}
                </button>
                {i < STAGE_ORDER.length - 1 && (
                  <span className="text-muted-foreground/40">›</span>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="act-client">Client Name *</Label>
              <Input
                id="act-client"
                ref={clientRef}
                data-ocid="activity.client.input"
                placeholder="e.g. JSL Jajpur, Rashmi Metallic"
                value={form.client}
                onChange={(e) =>
                  setForm((f) => ({ ...f, client: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="act-date">Date</Label>
                <Input
                  id="act-date"
                  data-ocid="activity.date.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-stage">Stage</Label>
                <Select
                  value={form.stage}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, stage: v as Stage }))
                  }
                >
                  <SelectTrigger
                    id="act-stage"
                    data-ocid="activity.stage.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_ORDER.map((s) => (
                      <SelectItem key={s} value={s}>
                        <span
                          className={`flex items-center gap-1.5 ${STAGE_CONFIG[s].color}`}
                        >
                          {STAGE_CONFIG[s].icon}
                          {STAGE_CONFIG[s].label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="act-details">Details / Notes</Label>
              <Textarea
                id="act-details"
                data-ocid="activity.details.textarea"
                placeholder="What was discussed? Any key points..."
                value={form.details}
                onChange={(e) =>
                  setForm((f) => ({ ...f, details: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="act-output">Output / Result</Label>
              <Input
                id="act-output"
                data-ocid="activity.output.input"
                placeholder="e.g. Offer accepted, Follow-up scheduled"
                value={form.output}
                onChange={(e) =>
                  setForm((f) => ({ ...f, output: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="act-amount">Amount (₹, optional)</Label>
              <Input
                id="act-amount"
                data-ocid="activity.amount.input"
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                data-ocid="activity.dialog.cancel_button"
                variant="outline"
                className="flex-1"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="activity.dialog.save_button"
                className="flex-1"
                onClick={saveEntry}
              >
                {editEntry ? "Update Entry" : "Add Entry"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
