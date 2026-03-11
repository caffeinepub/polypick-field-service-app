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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Pencil,
  Plus,
  Ticket,
  Trash2,
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
}

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

  const add = (t: Omit<ServiceTicket, "id" | "ticketNo">) => {
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

const empty: Omit<ServiceTicket, "id" | "ticketNo"> = {
  clientName: "",
  issueDescription: "",
  priority: "Medium",
  status: "Open",
  assignedTo: "",
  dateCreated: new Date().toISOString().slice(0, 10),
  dateResolved: "",
  notes: "",
};

const STATUS_CONFIG: Record<
  ServiceTicket["status"],
  { label: string; color: string; icon: React.FC<any> }
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

export default function ServiceTicketsPage() {
  const { tickets, add, update, remove } = useTickets();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTicket, setEditTicket] = useState<ServiceTicket | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });

  const filtered = tickets.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    const q = search.toLowerCase();
    if (
      q &&
      !t.clientName.toLowerCase().includes(q) &&
      !t.ticketNo.toLowerCase().includes(q) &&
      !t.issueDescription.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  const openAdd = () => {
    setForm({ ...empty, dateCreated: new Date().toISOString().slice(0, 10) });
    setAddOpen(true);
  };

  const openEdit = (t: ServiceTicket) => {
    setEditTicket(t);
    setForm({
      clientName: t.clientName,
      issueDescription: t.issueDescription,
      priority: t.priority,
      status: t.status,
      assignedTo: t.assignedTo,
      dateCreated: t.dateCreated,
      dateResolved: t.dateResolved,
      notes: t.notes,
    });
  };

  const handleSave = () => {
    if (!form.clientName.trim() || !form.issueDescription.trim()) {
      toast.error("Client name and issue description are required");
      return;
    }
    if (editTicket) {
      update(editTicket.id, form);
      toast.success("Ticket updated!");
      setEditTicket(null);
    } else {
      add(form);
      toast.success("Ticket created!");
      setAddOpen(false);
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    remove(deleteId);
    toast.success("Ticket deleted");
    setDeleteId(null);
  };

  const exportExcel = () => {
    const headers = [
      "Ticket No",
      "Client",
      "Issue",
      "Priority",
      "Status",
      "Assigned To",
      "Date Created",
      "Date Resolved",
      "Notes",
    ];
    const rows = tickets.map((t) => [
      t.ticketNo,
      t.clientName,
      t.issueDescription,
      t.priority,
      t.status,
      t.assignedTo,
      t.dateCreated,
      t.dateResolved,
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

  const TicketForm = () => (
    <div className="space-y-4">
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
          rows={3}
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
              setForm((p) => ({ ...p, status: v as ServiceTicket["status"] }))
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
        <Label>Notes</Label>
        <Textarea
          placeholder="Additional notes..."
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          data-ocid="ticket.notes.textarea"
        />
      </div>
    </div>
  );

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
            onClick={exportExcel}
            className="gap-2"
            data-ocid="tickets.export.button"
          >
            <Download size={14} />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={openAdd}
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
            placeholder="Search tickets..."
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
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        {t.clientName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {t.issueDescription}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        {t.assignedTo && <span>👤 {t.assignedTo}</span>}
                        <span>📅 {t.dateCreated}</span>
                        {t.dateResolved && (
                          <span>✅ Resolved: {t.dateResolved}</span>
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
                        onClick={() => openEdit(t)}
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
          <TicketForm />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="tickets.add.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} data-ocid="tickets.add.submit_button">
              Create Ticket
            </Button>
          </DialogFooter>
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
          <TicketForm />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTicket(null)}
              data-ocid="tickets.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} data-ocid="tickets.edit.save_button">
              Save Changes
            </Button>
          </DialogFooter>
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
