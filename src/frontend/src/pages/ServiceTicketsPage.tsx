import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  MapPin,
  Pencil,
  Plus,
  Settings2,
  Ticket,
  Trash2,
  Wrench,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ServiceTicket {
  id: string;
  ticketNo: string;
  clientName: string;
  issueDescription: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTo: string;
  dateCreated: string;
  dateResolved: string;
  notes: string;
  // New fields
  serviceType:
    | "Installation"
    | "Repair"
    | "Maintenance"
    | "Inspection"
    | "AMC"
    | "Other"
    | "";
  equipmentName: string;
  location: string;
  workDone: string;
  partsUsed: string;
  nextServiceDate: string;
  visitType: "First Visit" | "Revisit" | "Warranty" | "Paid" | "AMC Visit" | "";
}

type TicketFormValues = Omit<ServiceTicket, "id" | "ticketNo">;

function useTickets() {
  const [tickets, setTickets] = useState<ServiceTicket[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_tickets") ?? "[]");
    } catch {
      return [];
    }
  });

  const save = (next: ServiceTicket[]) => {
    setTickets(next);
    localStorage.setItem("polypick_tickets", JSON.stringify(next));
  };

  const add = (t: TicketFormValues) => {
    const now = Date.now();
    const ticketNo = `TKT-${String(now).slice(-6)}`;
    save([{ ...t, id: String(now), ticketNo }, ...tickets]);
  };

  const update = (id: string, updates: Partial<ServiceTicket>) => {
    save(tickets.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const remove = (id: string) => save(tickets.filter((t) => t.id !== id));

  return { tickets, add, update, remove };
}

const emptyForm: TicketFormValues = {
  clientName: "",
  issueDescription: "",
  priority: "Medium",
  status: "Open",
  assignedTo: "",
  dateCreated: new Date().toISOString().slice(0, 10),
  dateResolved: "",
  notes: "",
  serviceType: "",
  equipmentName: "",
  location: "",
  workDone: "",
  partsUsed: "",
  nextServiceDate: "",
  visitType: "",
};

const STATUS_CONFIG: Record<
  ServiceTicket["status"],
  { label: string; color: string; icon: React.FC<{ size?: number }> }
> = {
  Open: { label: "Open", color: "bg-blue-100 text-blue-700", icon: Clock },
  "In Progress": {
    label: "In Progress",
    color: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
  },
  Resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  Closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-600",
    icon: XCircle,
  },
};

const PRIORITY_COLOR: Record<ServiceTicket["priority"], string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

const SERVICE_TYPE_COLOR: Record<string, string> = {
  Installation: "bg-purple-100 text-purple-700",
  Repair: "bg-red-100 text-red-700",
  Maintenance: "bg-blue-100 text-blue-700",
  Inspection: "bg-cyan-100 text-cyan-700",
  AMC: "bg-green-100 text-green-700",
  Other: "bg-gray-100 text-gray-600",
};

// ── TicketFormContent extracted OUTSIDE parent component to prevent focus loss ──
function TicketFormContent({
  initialValues,
  onSave,
  onCancel,
  submitLabel,
}: {
  initialValues: TicketFormValues;
  onSave: (values: TicketFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<TicketFormValues>(initialValues);

  const handleSubmit = () => {
    if (!form.clientName.trim() || !form.issueDescription.trim()) {
      toast.error("Client name aur issue description zaroori hai");
      return;
    }
    onSave(form);
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      {/* Section: Basic Info */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Basic Info
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Client Name *</Label>
            <Input
              placeholder="Client ka naam"
              value={form.clientName}
              onChange={(e) =>
                setForm((p) => ({ ...p, clientName: e.target.value }))
              }
              data-ocid="ticket.client_name.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned To</Label>
            <Input
              placeholder="Staff member"
              value={form.assignedTo}
              onChange={(e) =>
                setForm((p) => ({ ...p, assignedTo: e.target.value }))
              }
              data-ocid="ticket.assigned_to.input"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Issue Description *</Label>
          <Textarea
            placeholder="Problem ki detail likhein..."
            rows={2}
            value={form.issueDescription}
            onChange={(e) =>
              setForm((p) => ({ ...p, issueDescription: e.target.value }))
            }
            data-ocid="ticket.issue.textarea"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  priority: v as ServiceTicket["priority"],
                }))
              }
            >
              <SelectTrigger data-ocid="ticket.priority.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  status: v as ServiceTicket["status"],
                }))
              }
            >
              <SelectTrigger data-ocid="ticket.status.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section: Service Details */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Service Details
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Service Type</Label>
            <Select
              value={form.serviceType}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  serviceType: v as ServiceTicket["serviceType"],
                }))
              }
            >
              <SelectTrigger data-ocid="ticket.service_type.select">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Installation">Installation</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Inspection">Inspection</SelectItem>
                <SelectItem value="AMC">AMC</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Visit Type</Label>
            <Select
              value={form.visitType}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  visitType: v as ServiceTicket["visitType"],
                }))
              }
            >
              <SelectTrigger data-ocid="ticket.visit_type.select">
                <SelectValue placeholder="Select visit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First Visit">First Visit</SelectItem>
                <SelectItem value="Revisit">Revisit</SelectItem>
                <SelectItem value="Warranty">Warranty</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="AMC Visit">AMC Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Equipment / Machine Name</Label>
          <Input
            placeholder="e.g. UHMWPE Liner, Conveyor Belt, Pump..."
            value={form.equipmentName}
            onChange={(e) =>
              setForm((p) => ({ ...p, equipmentName: e.target.value }))
            }
            data-ocid="ticket.equipment_name.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Site / Location</Label>
          <Input
            placeholder="e.g. RSP Rourkela, Plant Area B..."
            value={form.location}
            onChange={(e) =>
              setForm((p) => ({ ...p, location: e.target.value }))
            }
            data-ocid="ticket.location.input"
          />
        </div>
      </div>

      {/* Section: Work Report */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Work Report
        </p>
        <div className="space-y-1.5">
          <Label>Work Done</Label>
          <Textarea
            placeholder="Kya kaam kiya gaya -- detail mein likhein..."
            rows={3}
            value={form.workDone}
            onChange={(e) =>
              setForm((p) => ({ ...p, workDone: e.target.value }))
            }
            data-ocid="ticket.work_done.textarea"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Parts / Materials Used</Label>
          <Input
            placeholder="e.g. UHMWPE Sheet 10mm, Bolts M16, Sealant... (comma separated)"
            value={form.partsUsed}
            onChange={(e) =>
              setForm((p) => ({ ...p, partsUsed: e.target.value }))
            }
            data-ocid="ticket.parts_used.input"
          />
        </div>
      </div>

      {/* Section: Dates */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Dates
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Date Created</Label>
            <Input
              type="date"
              value={form.dateCreated}
              onChange={(e) =>
                setForm((p) => ({ ...p, dateCreated: e.target.value }))
              }
              data-ocid="ticket.date_created.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Date Resolved</Label>
            <Input
              type="date"
              value={form.dateResolved}
              onChange={(e) =>
                setForm((p) => ({ ...p, dateResolved: e.target.value }))
              }
              data-ocid="ticket.date_resolved.input"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Next Service Due Date</Label>
          <Input
            type="date"
            value={form.nextServiceDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, nextServiceDate: e.target.value }))
            }
            data-ocid="ticket.next_service_date.input"
          />
        </div>
      </div>

      {/* Section: Notes */}
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea
          placeholder="Additional notes..."
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          data-ocid="ticket.notes.textarea"
        />
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="tickets.form.cancel_button"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} data-ocid="tickets.form.submit_button">
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function ServiceTicketsPage() {
  const { tickets, add, update, remove } = useTickets();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTicket, setEditTicket] = useState<ServiceTicket | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = tickets.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    const q = search.toLowerCase();
    if (
      q &&
      !t.clientName.toLowerCase().includes(q) &&
      !t.ticketNo.toLowerCase().includes(q) &&
      !t.issueDescription.toLowerCase().includes(q) &&
      !(t.equipmentName ?? "").toLowerCase().includes(q) &&
      !(t.location ?? "").toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  const handleAddSave = (values: TicketFormValues) => {
    add(values);
    toast.success("Ticket created!");
    setAddOpen(false);
  };

  const handleEditSave = (values: TicketFormValues) => {
    if (!editTicket) return;
    update(editTicket.id, values);
    toast.success("Ticket updated!");
    setEditTicket(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    remove(deleteId);
    toast.success("Ticket deleted");
    setDeleteId(null);
  };

  const exportCsv = () => {
    const headers = [
      "Ticket No",
      "Client",
      "Service Type",
      "Visit Type",
      "Equipment",
      "Location",
      "Issue",
      "Work Done",
      "Parts Used",
      "Priority",
      "Status",
      "Assigned To",
      "Date Created",
      "Date Resolved",
      "Next Service Date",
      "Notes",
    ];
    const rows = tickets.map((t) => [
      t.ticketNo,
      t.clientName,
      t.serviceType ?? "",
      t.visitType ?? "",
      t.equipmentName ?? "",
      t.location ?? "",
      t.issueDescription,
      t.workDone ?? "",
      t.partsUsed ?? "",
      t.priority,
      t.status,
      t.assignedTo,
      t.dateCreated,
      t.dateResolved,
      t.nextServiceDate ?? "",
      t.notes,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Service_Tickets_Polypick.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const counts = {
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
    closed: tickets.filter((t) => t.status === "Closed").length,
  };

  const editInitialValues: TicketFormValues | null = editTicket
    ? {
        clientName: editTicket.clientName,
        issueDescription: editTicket.issueDescription,
        priority: editTicket.priority,
        status: editTicket.status,
        assignedTo: editTicket.assignedTo,
        dateCreated: editTicket.dateCreated,
        dateResolved: editTicket.dateResolved,
        notes: editTicket.notes,
        serviceType: editTicket.serviceType ?? "",
        equipmentName: editTicket.equipmentName ?? "",
        location: editTicket.location ?? "",
        workDone: editTicket.workDone ?? "",
        partsUsed: editTicket.partsUsed ?? "",
        nextServiceDate: editTicket.nextServiceDate ?? "",
        visitType: editTicket.visitType ?? "",
      }
    : null;

  return (
    <div
      className="p-4 md:p-6 space-y-5 animate-fade-in"
      data-ocid="tickets.section"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Ticket size={24} className="text-primary" />
            Service Tickets
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Client complaints aur service requests track karein
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            className="gap-2"
            data-ocid="tickets.export.button"
          >
            <Download size={14} />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="gap-2"
            data-ocid="tickets.add.primary_button"
          >
            <Plus size={14} />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Open",
            count: counts.open,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "In Progress",
            count: counts.inProgress,
            color: "text-amber-600 bg-amber-50",
          },
          {
            label: "Resolved",
            count: counts.resolved,
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Closed",
            count: counts.closed,
            color: "text-gray-600 bg-gray-50",
          },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="pt-4 pb-3 px-4">
              <p className="text-2xl font-bold text-foreground">{s.count}</p>
              <Badge className={`${s.color} border-0 text-xs mt-1`}>
                {s.label}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[160px]">
          <Input
            placeholder="Search tickets, equipment, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-3 h-8 text-sm"
            data-ocid="tickets.search.input"
          />
        </div>
        <Filter size={14} className="text-muted-foreground" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger
            className="h-8 text-xs w-[120px]"
            data-ocid="tickets.filter_status.select"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger
            className="h-8 text-xs w-[120px]"
            data-ocid="tickets.filter_priority.select"
          >
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent
            className="py-14 text-center text-muted-foreground"
            data-ocid="tickets.empty_state"
          >
            <Ticket size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">Koi ticket nahi mila</p>
            <p className="text-sm mt-1">Naya ticket add karein</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((t, idx) => {
            const statusCfg = STATUS_CONFIG[t.status];
            const StatusIcon = statusCfg.icon;
            return (
              <Card
                key={t.id}
                className="border border-border"
                data-ocid={`tickets.item.${idx + 1}`}
              >
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {/* Top badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {t.ticketNo}
                        </span>
                        <Badge
                          className={`${PRIORITY_COLOR[t.priority]} border-0 text-xs`}
                        >
                          {t.priority}
                        </Badge>
                        <Badge
                          className={`${statusCfg.color} border-0 text-xs flex items-center gap-1`}
                        >
                          <StatusIcon size={10} />
                          {t.status}
                        </Badge>
                        {t.serviceType && (
                          <Badge
                            className={`${
                              SERVICE_TYPE_COLOR[t.serviceType] ??
                              "bg-gray-100 text-gray-600"
                            } border-0 text-xs flex items-center gap-1`}
                          >
                            <Settings2 size={9} />
                            {t.serviceType}
                          </Badge>
                        )}
                        {t.visitType && (
                          <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs">
                            {t.visitType}
                          </Badge>
                        )}
                      </div>

                      {/* Client name */}
                      <p className="font-semibold text-sm text-foreground">
                        {t.clientName}
                      </p>

                      {/* Equipment + Location */}
                      {(t.equipmentName || t.location) && (
                        <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-muted-foreground">
                          {t.equipmentName && (
                            <span className="flex items-center gap-1">
                              <Wrench size={10} />
                              {t.equipmentName}
                            </span>
                          )}
                          {t.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={10} />
                              {t.location}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Issue */}
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {t.issueDescription}
                      </p>

                      {/* Work done (brief) */}
                      {t.workDone && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          🔧 {t.workDone}
                        </p>
                      )}

                      {/* Parts */}
                      {t.partsUsed && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          🔩 Parts: {t.partsUsed}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                        {t.assignedTo && <span>👤 {t.assignedTo}</span>}
                        <span>📅 {t.dateCreated}</span>
                        {t.dateResolved && (
                          <span>✅ Resolved: {t.dateResolved}</span>
                        )}
                        {t.nextServiceDate && (
                          <span className="text-amber-600 font-medium">
                            🔁 Next: {t.nextServiceDate}
                          </span>
                        )}
                      </div>

                      {t.notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          📝 {t.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditTicket(t)}
                        data-ocid={`tickets.edit_button.${idx + 1}`}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(t.id)}
                        data-ocid={`tickets.delete_button.${idx + 1}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg" data-ocid="tickets.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Ticket size={18} className="text-primary" />
              New Service Ticket
            </DialogTitle>
          </DialogHeader>
          <TicketFormContent
            key="add-ticket"
            initialValues={{
              ...emptyForm,
              dateCreated: new Date().toISOString().slice(0, 10),
            }}
            onSave={handleAddSave}
            onCancel={() => setAddOpen(false)}
            submitLabel="Create Ticket"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editTicket}
        onOpenChange={(o) => !o && setEditTicket(null)}
      >
        <DialogContent className="max-w-lg" data-ocid="tickets.edit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Edit Ticket — {editTicket?.ticketNo}
            </DialogTitle>
          </DialogHeader>
          {editInitialValues && (
            <TicketFormContent
              key={editTicket?.id}
              initialValues={editInitialValues}
              onSave={handleEditSave}
              onCancel={() => setEditTicket(null)}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm" data-ocid="tickets.delete.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Ticket Delete Karein?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Yeh action undo nahi ho sakti. Ticket permanently delete ho jayega.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="tickets.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              data-ocid="tickets.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
