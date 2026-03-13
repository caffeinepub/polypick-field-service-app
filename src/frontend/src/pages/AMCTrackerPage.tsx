import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Pencil, Plus, Shield, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type AMCStatus = "Active" | "Expired" | "Due Soon";

interface AMCRecord {
  id: string;
  client: string;
  equipment: string;
  startDate: string;
  endDate: string;
  contractValue: number;
  contactPerson: string;
  notes: string;
}

const STORAGE_KEY = "polypick_amc_tracker";

function load(): AMCRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(records: AMCRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getStatus(endDate: string): AMCStatus {
  if (!endDate) return "Active";
  const end = new Date(endDate);
  const today = new Date();
  const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "Expired";
  if (diff <= 30) return "Due Soon";
  return "Active";
}

const STATUS_COLORS: Record<AMCStatus, string> = {
  Active: "bg-green-100 text-green-700 border-green-200",
  Expired: "bg-red-100 text-red-700 border-red-200",
  "Due Soon": "bg-amber-100 text-amber-700 border-amber-200",
};

const emptyForm = (): Omit<AMCRecord, "id"> => ({
  client: "",
  equipment: "",
  startDate: "",
  endDate: "",
  contractValue: 0,
  contactPerson: "",
  notes: "",
});

export default function AMCTrackerPage() {
  const [records, setRecords] = useState<AMCRecord[]>(load);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AMCRecord | null>(null);
  const [form, setForm] = useState<Omit<AMCRecord, "id">>(emptyForm());
  const [filterStatus, setFilterStatus] = useState<AMCStatus | "All">("All");
  const [search, setSearch] = useState("");

  const persist = useCallback((updated: AMCRecord[]) => {
    setRecords(updated);
    save(updated);
  }, []);

  const recordsWithStatus = useMemo(
    () => records.map((r) => ({ ...r, status: getStatus(r.endDate) })),
    [records],
  );

  const filtered = useMemo(
    () =>
      recordsWithStatus.filter((r) => {
        const statusMatch = filterStatus === "All" || r.status === filterStatus;
        const searchMatch =
          r.client.toLowerCase().includes(search.toLowerCase()) ||
          r.equipment.toLowerCase().includes(search.toLowerCase());
        return statusMatch && searchMatch;
      }),
    [recordsWithStatus, filterStatus, search],
  );

  const counts = useMemo(
    () => ({
      total: records.length,
      active: recordsWithStatus.filter((r) => r.status === "Active").length,
      dueSoon: recordsWithStatus.filter((r) => r.status === "Due Soon").length,
      expired: recordsWithStatus.filter((r) => r.status === "Expired").length,
    }),
    [records, recordsWithStatus],
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (r: AMCRecord) => {
    setEditing(r);
    setForm({ ...r });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.client.trim()) {
      toast.error("Client name required");
      return;
    }
    let updated: AMCRecord[];
    if (editing) {
      updated = records.map((r) =>
        r.id === editing.id ? { ...form, id: editing.id } : r,
      );
    } else {
      updated = [{ ...form, id: Date.now().toString() }, ...records];
    }
    persist(updated);
    setOpen(false);
    toast.success(editing ? "AMC updated" : "AMC added");
  };

  const handleDelete = (id: string) => {
    persist(records.filter((r) => r.id !== id));
    toast.success("AMC record deleted");
  };

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">AMC Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Annual Maintenance Contracts track karein
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="amc.open_modal_button"
              size="sm"
              onClick={openAdd}
            >
              <Plus size={16} className="mr-1" /> Add AMC
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="amc.dialog">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit AMC" : "Add AMC"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Client *</Label>
                <Input
                  data-ocid="amc.input"
                  value={form.client}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, client: e.target.value }))
                  }
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label>Equipment</Label>
                <Input
                  value={form.equipment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, equipment: e.target.value }))
                  }
                  placeholder="Conveyor belt, liner..."
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Contract Value (₹)</Label>
                <Input
                  type="number"
                  value={form.contractValue}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      contractValue: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Contact Person</Label>
                <Input
                  value={form.contactPerson}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contactPerson: e.target.value }))
                  }
                  placeholder="Contact name"
                />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea
                  data-ocid="amc.textarea"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={2}
                  placeholder="Additional info..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="amc.cancel_button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button data-ocid="amc.save_button" onClick={handleSave}>
                {editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{counts.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-green-600">{counts.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-amber-600">{counts.dueSoon}</p>
            <p className="text-xs text-muted-foreground">Due Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-red-600">{counts.expired}</p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["All", "Active", "Due Soon", "Expired"] as const).map((s) => (
          <Button
            key={s}
            data-ocid="amc.tab"
            variant={filterStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(s)}
          >
            {s}
          </Button>
        ))}
        <Input
          data-ocid="amc.search_input"
          placeholder="Search client or equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <Card data-ocid="amc.empty_state">
          <CardContent className="py-12 text-center">
            <Shield
              size={32}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-muted-foreground">Koi AMC record nahi mila.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, idx) => (
            <Card
              key={r.id}
              data-ocid={`amc.item.${idx + 1}`}
              className={
                r.status === "Expired"
                  ? "border-red-200 bg-red-50/30 dark:bg-red-950/10"
                  : r.status === "Due Soon"
                    ? "border-amber-200 bg-amber-50/30 dark:bg-amber-950/10"
                    : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{r.client}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_COLORS[r.status]}`}
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.equipment}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.startDate} → {r.endDate}
                      {r.contractValue > 0 &&
                        ` · ₹${r.contractValue.toLocaleString("en-IN")}`}
                    </p>
                    {r.contactPerson && (
                      <p className="text-xs text-muted-foreground">
                        Contact: {r.contactPerson}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      data-ocid={`amc.edit_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(r)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      data-ocid={`amc.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(r.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
