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
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Check,
  ChevronsUpDown,
  FileDown,
  GitBranch,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type T__1,
  useClients,
  useCreateInteraction,
  useDeleteInteraction,
  useInteractions,
  usePipelineStats,
  useUpdateInteraction,
} from "../hooks/useQueries";
import {
  dateInputToNs,
  formatDate,
  nsToDateInput,
  todayInputStr,
} from "../utils/dateUtils";

const TYPES = ["all", "inquiry", "offer", "order", "service", "payment"];

const TYPE_LABELS: Record<string, string> = {
  inquiry: "Enquiry",
  offer: "Offer",
  order: "Order",
  service: "Service",
  payment: "Payment",
};

const TYPE_COLORS: Record<string, string> = {
  inquiry: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  offer: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
  order:
    "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200",
  service:
    "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
  payment: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
};

const TYPE_ACTIVE: Record<string, string> = {
  inquiry: "bg-blue-600 text-white border-blue-600",
  offer: "bg-amber-500 text-white border-amber-500",
  order: "bg-emerald-600 text-white border-emerald-600",
  service: "bg-purple-600 text-white border-purple-600",
  payment: "bg-red-600 text-white border-red-600",
};

// ── PDF print helper ─────────────────────────────────────────────────────────

function printInteractionsPDF(
  interactions: T__1[],
  getClientName: (id: bigint) => string,
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const rows = interactions
    .map((int) => {
      const { displayTitle, priority } = decodePriority(int.title);
      const intDate = new Date(
        Number(int.date / 1_000_000n),
      ).toLocaleDateString("en-IN");
      const amount =
        int.amount !== undefined
          ? `₹${Number(int.amount).toLocaleString("en-IN")}`
          : "—";
      return `
      <tr>
        <td>${displayTitle}</td>
        <td>${getClientName(int.clientId)}</td>
        <td style="text-transform:capitalize">${TYPE_LABELS[int.type] ?? int.type}</td>
        <td style="text-transform:capitalize">${int.status}</td>
        <td style="text-transform:capitalize">${priority !== "none" ? priority : "—"}</td>
        <td>${amount}</td>
        <td>${intDate}</td>
      </tr>`;
    })
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PPI Pipeline Report – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; color: #111; font-size: 12px; }
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
        <p>PPI Pipeline Report</p>
        <p>Generated: ${date} &nbsp;|&nbsp; Total Entries: ${interactions.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Client</th>
            <th>Type</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Amount</th>
            <th>Date</th>
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

// ── Priority helpers ─────────────────────────────────────────────────────────
const PRIORITY_PREFIX_REGEX = /^\[P:(HIGH|MEDIUM|LOW)\]\s*/;

function encodePriority(title: string, priority: string): string {
  const stripped = title.replace(PRIORITY_PREFIX_REGEX, "");
  if (!priority || priority === "none") return stripped;
  return `[P:${priority.toUpperCase()}] ${stripped}`;
}

function decodePriority(title: string): {
  displayTitle: string;
  priority: string;
} {
  const m = title.match(PRIORITY_PREFIX_REGEX);
  if (m) {
    return {
      displayTitle: title.replace(PRIORITY_PREFIX_REGEX, ""),
      priority: m[1].toLowerCase(),
    };
  }
  return { displayTitle: title, priority: "none" };
}

// ── Type badge colors ─────────────────────────────────────────────────────────
const TYPE_BADGE_CLASSES: Record<string, string> = {
  inquiry: "bg-blue-50 text-blue-700 border-blue-200",
  offer: "bg-amber-50 text-amber-700 border-amber-200",
  order: "bg-emerald-50 text-emerald-700 border-emerald-200",
  service: "bg-purple-50 text-purple-700 border-purple-200",
  payment: "bg-red-50 text-red-700 border-red-200",
};

const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

const emptyForm = {
  clientId: "",
  type: "inquiry",
  title: "",
  priority: "none",
  description: "",
  status: "open",
  amount: "",
  date: todayInputStr(),
};

type FormState = typeof emptyForm;

// ── InteractionForm extracted OUTSIDE parent to prevent remount on re-render ──
function InteractionForm({
  form,
  setForm,
  clients,
  onSubmit,
  onCancel,
  submitting,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  clients: { id: bigint; name: string; company: string }[] | undefined;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  const [clientDropOpen, setClientDropOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-2">
      {/* Task Type Buttons */}
      <div className="space-y-1.5">
        <Label>Task Type *</Label>
        <div className="flex flex-wrap gap-2">
          {["inquiry", "offer", "order", "service", "payment"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((p) => ({ ...p, type: t }))}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                form.type === t
                  ? (TYPE_ACTIVE[t] ?? "bg-primary text-white")
                  : (TYPE_COLORS[t] ??
                    "bg-muted text-muted-foreground border-border")
              }`}
              data-ocid={`interaction.type.${t}.toggle`}
            >
              {TYPE_LABELS[t] ?? t}
            </button>
          ))}
        </div>
      </div>

      {/* Client Search */}
      <div className="space-y-1.5">
        <Label>Client *</Label>
        <Popover open={clientDropOpen} onOpenChange={setClientDropOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-ocid="interaction.client.select"
              className="w-full justify-between font-normal"
            >
              {form.clientId
                ? (() => {
                    const c = (clients ?? []).find(
                      (c) => c.id.toString() === form.clientId,
                    );
                    return c ? `${c.name} – ${c.company}` : "Select client";
                  })()
                : "Select client"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Client ka naam type karein..."
                value={clientSearch}
                onValueChange={setClientSearch}
                autoFocus
              />
              <CommandEmpty>No client found.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-y-auto">
                {(clients ?? [])
                  .filter(
                    (c) =>
                      c.name
                        .toLowerCase()
                        .includes(clientSearch.toLowerCase()) ||
                      c.company
                        .toLowerCase()
                        .includes(clientSearch.toLowerCase()),
                  )
                  .map((c) => (
                    <CommandItem
                      key={c.id.toString()}
                      value={c.id.toString()}
                      onSelect={(v) => {
                        setForm((p) => ({ ...p, clientId: v }));
                        setClientSearch("");
                        setClientDropOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          form.clientId === c.id.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {c.name} – {c.company}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Title *</Label>
          <Input
            data-ocid="interaction.title.input"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
            placeholder="e.g. Pump supply inquiry"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select
            value={form.priority}
            onValueChange={(v) => setForm((p) => ({ ...p, priority: v }))}
          >
            <SelectTrigger data-ocid="interaction.priority.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— None —</SelectItem>
              <SelectItem value="high">🔴 High</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="low">🔵 Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea
          data-ocid="interaction.description.textarea"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          rows={3}
          autoComplete="off"
          placeholder="Details..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
          >
            <SelectTrigger data-ocid="interaction.status.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Amount (₹)</Label>
          <Input
            data-ocid="interaction.amount.input"
            type="number"
            min="0"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Date *</Label>
          <Input
            data-ocid="interaction.date.input"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          data-ocid="interactions.cancel_button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-ocid="interactions.save_button"
          disabled={submitting || !form.clientId}
        >
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function InteractionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: interactions, isLoading } = useInteractions();
  const { data: clients } = useClients();
  const { data: pipelineStats } = usePipelineStats();
  const createInteraction = useCreateInteraction();
  const updateInteraction = useUpdateInteraction();
  const deleteInteraction = useDeleteInteraction();
  const { identity } = useInternetIdentity();

  const getClientName = (id: bigint) =>
    clients?.find((c) => c.id === id)?.name ?? `Client #${id}`;

  const allInteractions = interactions ?? [];

  // Count per type for badges
  const countByType = TYPES.reduce(
    (acc, t) => {
      acc[t] =
        t === "all"
          ? allInteractions.length
          : allInteractions.filter((i) => i.type === t).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const filtered = allInteractions
    .filter((i) => activeTab === "all" || i.type === activeTab)
    .filter((i) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const clientObj = clients?.find((c) => c.id === i.clientId);
      const clientName = (
        clientObj?.name ?? `Client #${i.clientId}`
      ).toLowerCase();
      const clientCompany = (clientObj?.company ?? "").toLowerCase();
      const { displayTitle } = decodePriority(i.title);
      return (
        displayTitle.toLowerCase().includes(q) ||
        clientName.includes(q) ||
        clientCompany.includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    });

  // Inactivity: entries not updated in 15+ days
  const INACTIVE_DAYS = 15;
  const inactiveIds = new Set(
    allInteractions
      .filter((i) => {
        if (!i.updatedAt) return false;
        const updated = new Date(Number(i.updatedAt / 1_000_000n));
        const diffDays =
          (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= INACTIVE_DAYS;
      })
      .map((i) => i.id.toString()),
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !form.clientId) return;
    try {
      const encodedTitle = encodePriority(form.title.trim(), form.priority);
      await createInteraction.mutateAsync({
        id: 0n,
        clientId: BigInt(form.clientId),
        type: form.type,
        title: encodedTitle,
        description: form.description.trim(),
        status: form.status as T__1["status"],
        amount: form.amount ? BigInt(form.amount) : undefined,
        date: dateInputToNs(form.date),
        createdBy: identity.getPrincipal() as Principal,
        updatedAt: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("PPI entry added");
      setForm(emptyForm);
      setAddOpen(false);
    } catch {
      toast.error("Failed to add PPI entry");
    }
  };

  const handleEditOpen = (int: T__1) => {
    setEditingId(int.id);
    const { displayTitle, priority } = decodePriority(int.title);
    setForm({
      clientId: int.clientId.toString(),
      type: int.type,
      title: displayTitle,
      priority,
      description: int.description,
      status: int.status,
      amount: int.amount !== undefined ? int.amount.toString() : "",
      date: nsToDateInput(int.date),
    });
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !identity) return;
    const orig = interactions?.find((i) => i.id === editingId);
    if (!orig) return;
    try {
      const encodedTitle = encodePriority(form.title.trim(), form.priority);
      await updateInteraction.mutateAsync({
        id: editingId,
        interaction: {
          ...orig,
          clientId: BigInt(form.clientId),
          type: form.type,
          title: encodedTitle,
          description: form.description.trim(),
          status: form.status as T__1["status"],
          amount: form.amount ? BigInt(form.amount) : undefined,
          date: dateInputToNs(form.date),
          updatedAt: BigInt(Date.now()) * 1_000_000n,
        },
      });
      toast.success("PPI entry updated");
      setEditOpen(false);
      setEditingId(null);
    } catch {
      toast.error("Failed to update PPI entry");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteInteraction.mutateAsync(deleteId);
      toast.success("Entry deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <GitBranch size={24} className="text-primary" />
            PPI – Sales Pipeline
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Track enquiries, offers, orders, services &amp; payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          {filtered.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              data-ocid="interactions.pdf.button"
              onClick={() => printInteractionsPDF(filtered, getClientName)}
              className="gap-2"
            >
              <FileDown size={15} />
              Export PDF
            </Button>
          )}
          <Button
            data-ocid="interactions.add_button"
            onClick={() => {
              setForm(emptyForm);
              setAddOpen(true);
            }}
            className="gap-2"
          >
            <Plus size={16} />
            Add PPI Entry
          </Button>
        </div>
      </div>

      {/* Search Bar - full width on mobile */}
      <div className="relative w-full">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          data-ocid="interactions.search_input"
          type="text"
          placeholder="Client naam ya title search karein..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      {/* Quick Task Type Filter */}
      <div className="flex flex-wrap gap-2">
        {["inquiry", "offer", "order", "service", "payment"].map((t) => {
          const count = countByType[t] ?? 0;
          const isActive = activeTab === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(isActive ? "all" : t)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                isActive
                  ? (TYPE_ACTIVE[t] ?? "bg-primary text-white")
                  : (TYPE_COLORS[t] ??
                    "bg-muted text-muted-foreground border-border")
              }`}
              data-ocid={`interactions.type_filter.${t}.toggle`}
            >
              {TYPE_LABELS[t] ?? t}
              {count > 0 && (
                <span
                  className={`inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/30 text-white" : "bg-white/80"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
        {activeTab !== "all" && (
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:bg-muted transition-all"
          >
            Clear
          </button>
        )}
      </div>

      {/* Pipeline Summary */}
      {pipelineStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Enquiries",
              value: pipelineStats.inquiry,
              color: "text-blue-600 bg-blue-50",
            },
            {
              label: "Offers",
              value: pipelineStats.offer,
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Orders",
              value: pipelineStats.order,
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Follow-ups",
              value: pipelineStats.followup,
              color: "text-purple-600 bg-purple-50",
            },
          ].map((s) => (
            <Card key={s.label} className="overflow-hidden">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {s.label}
                    </p>
                    <p className="font-display text-2xl font-bold mt-0.5">
                      {Number(s.value)}
                    </p>
                  </div>
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}
                  >
                    <TrendingUp size={18} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Inactivity Warning Banner */}
      {inactiveIds.size > 0 && (
        <div
          data-ocid="interactions.inactivity.card"
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-sm font-medium"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
          {inactiveIds.size} PPI entr{inactiveIds.size !== 1 ? "ies" : "y"}{" "}
          inactive for 15+ days — follow-up needed
        </div>
      )}

      {/* Tabs + Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          data-ocid="interactions.tab"
          className="flex-wrap h-auto gap-1"
        >
          {TYPES.map((t) => {
            const count = countByType[t] ?? 0;
            const label = t === "all" ? "All" : (TYPE_LABELS[t] ?? t);
            return (
              <TabsTrigger
                key={t}
                value={t}
                className="capitalize text-xs sm:text-sm"
              >
                {label}
                {count > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TYPES.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="rounded-lg border border-border overflow-hidden shadow-xs mt-4">
              <Table data-ocid="interactions.table">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">
                      Priority
                    </TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="w-24 text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                      <TableRow key={`skeleton-${i}`}>
                        {Array.from({ length: 8 }).map((__, j) => (
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
                        colSpan={8}
                        data-ocid="interactions.empty_state"
                        className="text-center py-12 text-muted-foreground"
                      >
                        <GitBranch
                          size={36}
                          className="mx-auto mb-2 opacity-30"
                        />
                        <p className="text-sm">No PPI entries found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((int, idx) => {
                      const { displayTitle, priority } = decodePriority(
                        int.title,
                      );
                      const typeBadgeClass =
                        TYPE_BADGE_CLASSES[int.type] ??
                        "bg-muted text-muted-foreground border-border";
                      const priorityBadgeClass =
                        priority !== "none"
                          ? (PRIORITY_BADGE_CLASSES[priority] ?? "")
                          : "";

                      return (
                        <TableRow
                          key={int.id.toString()}
                          data-ocid={`interactions.item.${idx + 1}`}
                          className="hover:bg-muted/20"
                        >
                          <TableCell className="font-medium max-w-[180px]">
                            <span className="truncate block">
                              {displayTitle}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {getClientName(int.clientId)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant="outline"
                              className={`capitalize text-xs ${typeBadgeClass}`}
                            >
                              {TYPE_LABELS[int.type] ?? int.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <StatusBadge status={int.status} />
                              {inactiveIds.has(int.id.toString()) && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                                  Inactive 15+ days
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {priority !== "none" ? (
                              <Badge
                                variant="outline"
                                className={`text-xs capitalize ${priorityBadgeClass}`}
                              >
                                {priority}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground">
                            {int.amount !== undefined
                              ? `₹${Number(int.amount).toLocaleString("en-IN")}`
                              : "—"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                            {formatDate(int.date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                data-ocid={`interactions.edit_button.${idx + 1}`}
                                onClick={() => handleEditOpen(int)}
                                className="h-7 w-7"
                              >
                                <Pencil size={13} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                data-ocid={`interactions.delete_button.${idx + 1}`}
                                onClick={() => setDeleteId(int.id)}
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

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg" data-ocid="interactions.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Add PPI Entry</DialogTitle>
          </DialogHeader>
          <InteractionForm
            form={form}
            setForm={setForm}
            clients={clients}
            onSubmit={handleAdd}
            onCancel={() => setAddOpen(false)}
            submitting={createInteraction.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="max-w-lg"
          data-ocid="interactions.edit.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Edit PPI Entry</DialogTitle>
          </DialogHeader>
          <InteractionForm
            form={form}
            setForm={setForm}
            clients={clients}
            onSubmit={handleEdit}
            onCancel={() => {
              setEditOpen(false);
              setEditingId(null);
            }}
            submitting={updateInteraction.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="interactions.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete PPI Entry</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="interactions.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="interactions.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteInteraction.isPending ? (
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
