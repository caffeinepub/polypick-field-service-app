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
import { Pencil, Plus, Trash2, Truck } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

type OrderStage =
  | "Order Received"
  | "In Production"
  | "Quality Check"
  | "Ready to Dispatch"
  | "Dispatched"
  | "Delivered";

interface Order {
  id: string;
  orderNo: string;
  client: string;
  product: string;
  qty: string;
  stage: OrderStage;
  expectedDate: string;
  remarks: string;
}

const STAGES: OrderStage[] = [
  "Order Received",
  "In Production",
  "Quality Check",
  "Ready to Dispatch",
  "Dispatched",
  "Delivered",
];

const STAGE_COLORS: Record<OrderStage, string> = {
  "Order Received": "bg-blue-100 text-blue-700 border-blue-200",
  "In Production": "bg-orange-100 text-orange-700 border-orange-200",
  "Quality Check": "bg-purple-100 text-purple-700 border-purple-200",
  "Ready to Dispatch": "bg-amber-100 text-amber-700 border-amber-200",
  Dispatched: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
};

const STORAGE_KEY = "polypick_dispatch_tracker";

function load(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

const emptyForm = (): Omit<Order, "id"> => ({
  orderNo: "",
  client: "",
  product: "",
  qty: "",
  stage: "Order Received",
  expectedDate: "",
  remarks: "",
});

export default function DispatchTrackerPage() {
  const [orders, setOrders] = useState<Order[]>(load);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState<Omit<Order, "id">>(emptyForm());
  const [filterStage, setFilterStage] = useState<OrderStage | "All">("All");
  const [search, setSearch] = useState("");

  const persist = useCallback((updated: Order[]) => {
    setOrders(updated);
    save(updated);
  }, []);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const stageMatch = filterStage === "All" || o.stage === filterStage;
        const searchMatch =
          o.client.toLowerCase().includes(search.toLowerCase()) ||
          o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
          o.product.toLowerCase().includes(search.toLowerCase());
        return stageMatch && searchMatch;
      }),
    [orders, filterStage, search],
  );

  const stageCounts = useMemo(
    () =>
      Object.fromEntries(
        STAGES.map((s) => [s, orders.filter((o) => o.stage === s).length]),
      ) as Record<OrderStage, number>,
    [orders],
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditing(order);
    setForm({ ...order });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.client.trim() || !form.orderNo.trim()) {
      toast.error("Order No and Client are required");
      return;
    }
    let updated: Order[];
    if (editing) {
      updated = orders.map((o) =>
        o.id === editing.id ? { ...form, id: editing.id } : o,
      );
    } else {
      updated = [{ ...form, id: Date.now().toString() }, ...orders];
    }
    persist(updated);
    setOpen(false);
    toast.success(editing ? "Order updated" : "Order added");
  };

  const handleDelete = (id: string) => {
    persist(orders.filter((o) => o.id !== id));
    toast.success("Order deleted");
  };

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Dispatch Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Orders ka stage-wise status track karein
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="dispatch.open_modal_button"
              size="sm"
              onClick={openAdd}
            >
              <Plus size={16} className="mr-1" /> Add Order
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="dispatch.dialog">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Order" : "Add Order"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Order No *</Label>
                <Input
                  data-ocid="dispatch.input"
                  value={form.orderNo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, orderNo: e.target.value }))
                  }
                  placeholder="ORD-2024-001"
                />
              </div>
              <div>
                <Label>Client *</Label>
                <Input
                  value={form.client}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, client: e.target.value }))
                  }
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label>Product</Label>
                <Input
                  value={form.product}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, product: e.target.value }))
                  }
                  placeholder="UHMWPE Liners..."
                />
              </div>
              <div>
                <Label>Qty</Label>
                <Input
                  value={form.qty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, qty: e.target.value }))
                  }
                  placeholder="100 Pcs / 500 Mtr"
                />
              </div>
              <div>
                <Label>Stage</Label>
                <Select
                  value={form.stage}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, stage: v as OrderStage }))
                  }
                >
                  <SelectTrigger data-ocid="dispatch.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Expected Date</Label>
                <Input
                  type="date"
                  value={form.expectedDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expectedDate: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2">
                <Label>Remarks</Label>
                <Textarea
                  data-ocid="dispatch.textarea"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, remarks: e.target.value }))
                  }
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="dispatch.cancel_button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button data-ocid="dispatch.save_button" onClick={handleSave}>
                {editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stage counts */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Button
          data-ocid="dispatch.tab"
          variant={filterStage === "All" ? "default" : "outline"}
          size="sm"
          className="flex-shrink-0"
          onClick={() => setFilterStage("All")}
        >
          All ({orders.length})
        </Button>
        {STAGES.map((s) => (
          <Button
            key={s}
            variant={filterStage === s ? "default" : "outline"}
            size="sm"
            className="flex-shrink-0"
            onClick={() => setFilterStage(s)}
          >
            {s} ({stageCounts[s]})
          </Button>
        ))}
      </div>

      <Input
        data-ocid="dispatch.search_input"
        placeholder="Search by client, order no, product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <Card data-ocid="dispatch.empty_state">
          <CardContent className="py-12 text-center">
            <Truck
              size={32}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-muted-foreground">Koi order nahi mila.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, idx) => (
            <Card key={order.id} data-ocid={`dispatch.item.${idx + 1}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">
                        {order.client}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STAGE_COLORS[order.stage]}`}
                      >
                        {order.stage}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      #{order.orderNo} · {order.product} · {order.qty}
                    </p>
                    {order.expectedDate && (
                      <p className="text-xs text-muted-foreground">
                        Expected: {order.expectedDate}
                      </p>
                    )}
                    {order.remarks && (
                      <p className="text-xs text-muted-foreground italic">
                        {order.remarks}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      data-ocid={`dispatch.edit_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(order)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      data-ocid={`dispatch.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(order.id)}
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
