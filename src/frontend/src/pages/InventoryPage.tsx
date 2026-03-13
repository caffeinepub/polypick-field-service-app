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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Download,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface Part {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  supplier: string;
}

const STORAGE_KEY = "polypick_inventory";
const CATEGORIES = [
  "UHMWPE Liners",
  "Rollers",
  "Belt Scrapers",
  "Fasteners",
  "Tools",
  "Safety Equipment",
  "Electrical",
  "Hydraulic",
  "Other",
];

function load(): Part[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(parts: Part[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
}

const emptyForm = (): Part => ({
  id: "",
  name: "",
  partNumber: "",
  category: "Other",
  quantity: 0,
  minStock: 5,
  unit: "Pcs",
  supplier: "",
});

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>(load);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Part | null>(null);
  const [form, setForm] = useState<Part>(emptyForm());
  const [search, setSearch] = useState("");

  const persist = useCallback((updated: Part[]) => {
    setParts(updated);
    save(updated);
  }, []);

  const filtered = useMemo(
    () =>
      parts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.partNumber.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      ),
    [parts, search],
  );

  const lowStockCount = useMemo(
    () => parts.filter((p) => p.quantity <= p.minStock).length,
    [parts],
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (part: Part) => {
    setEditing(part);
    setForm({ ...part });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Part name required");
      return;
    }
    let updated: Part[];
    if (editing) {
      updated = parts.map((p) =>
        p.id === editing.id ? { ...form, id: editing.id } : p,
      );
    } else {
      updated = [...parts, { ...form, id: Date.now().toString() }];
    }
    persist(updated);
    setOpen(false);
    toast.success(editing ? "Part updated" : "Part added");
  };

  const handleDelete = (id: string) => {
    persist(parts.filter((p) => p.id !== id));
    toast.success("Part deleted");
  };

  const exportCSV = () => {
    const headers =
      "Part Name,Part Number,Category,Quantity,Min Stock,Unit,Supplier\n";
    const rows = parts
      .map(
        (p) =>
          `"${p.name}","${p.partNumber}","${p.category}",${p.quantity},${p.minStock},"${p.unit}","${p.supplier}"`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">
            Spare Parts Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Parts aur stock track karein
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="inventory.open_modal_button"
              size="sm"
              onClick={openAdd}
            >
              <Plus size={16} className="mr-1" /> Add Part
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="inventory.dialog">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Part" : "Add New Part"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Part Name *</Label>
                <Input
                  data-ocid="inventory.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. UHMWPE Liner 500mm"
                />
              </div>
              <div>
                <Label>Part Number</Label>
                <Input
                  value={form.partNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, partNumber: e.target.value }))
                  }
                  placeholder="PP-001"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger data-ocid="inventory.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
                  }
                />
              </div>
              <div>
                <Label>Min Stock Level</Label>
                <Input
                  type="number"
                  value={form.minStock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, minStock: Number(e.target.value) }))
                  }
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Input
                  value={form.unit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, unit: e.target.value }))
                  }
                  placeholder="Pcs / Mtr / Kg"
                />
              </div>
              <div>
                <Label>Supplier</Label>
                <Input
                  value={form.supplier}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, supplier: e.target.value }))
                  }
                  placeholder="Supplier name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="inventory.cancel_button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button data-ocid="inventory.save_button" onClick={handleSave}>
                {editing ? "Update" : "Add Part"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{parts.length}</p>
            <p className="text-xs text-muted-foreground">Total Parts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
            <p className="text-xs text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Button
              data-ocid="inventory.primary_button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={exportCSV}
            >
              <Download size={14} className="mr-1" /> CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      <Input
        data-ocid="inventory.search_input"
        placeholder="Search parts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {filtered.length === 0 ? (
        <Card data-ocid="inventory.empty_state">
          <CardContent className="py-12 text-center">
            <Package
              size={32}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-muted-foreground">Koi part nahi mila.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table data-ocid="inventory.table">
            <TableHeader>
              <TableRow>
                <TableHead>Part Name</TableHead>
                <TableHead>Part No.</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p, idx) => (
                <TableRow
                  key={p.id}
                  data-ocid={`inventory.row.${idx + 1}`}
                  className={
                    p.quantity <= p.minStock
                      ? "bg-red-50 dark:bg-red-950/20"
                      : ""
                  }
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {p.quantity <= p.minStock && (
                        <AlertTriangle
                          size={14}
                          className="text-red-500 flex-shrink-0"
                        />
                      )}
                      {p.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.partNumber || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {p.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-bold ${
                        p.quantity <= p.minStock
                          ? "text-red-600"
                          : "text-foreground"
                      }`}
                    >
                      {p.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.minStock}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.unit}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.supplier || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        data-ocid={`inventory.edit_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        data-ocid={`inventory.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
