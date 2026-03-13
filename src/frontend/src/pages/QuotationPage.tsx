import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, Minus, Plus, Printer, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

interface Quotation {
  id: string;
  clientName: string;
  date: string;
  validUntil: string;
  items: LineItem[];
  taxPercent: number;
  createdAt: string;
}

const STORAGE_KEY = "polypick_quotations";

function load(): Quotation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(qs: Quotation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
}

function newItem(): LineItem {
  return {
    id: Date.now().toString() + Math.random(),
    description: "",
    qty: 1,
    unit: "Pcs",
    unitPrice: 0,
  };
}

export default function QuotationPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(load);
  const [view, setView] = useState<"list" | "create" | "preview">("list");
  const [_selectedQ, setSelectedQ] = useState<Quotation | null>(null);

  const [form, setForm] = useState({
    clientName: "",
    date: new Date().toISOString().split("T")[0],
    validUntil: "",
    taxPercent: 18,
    items: [newItem()] as LineItem[],
  });

  const persist = useCallback((updated: Quotation[]) => {
    setQuotations(updated);
    save(updated);
  }, []);

  const subtotal = useMemo(
    () => form.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
    [form.items],
  );
  const taxAmount = useMemo(
    () => (subtotal * form.taxPercent) / 100,
    [subtotal, form.taxPercent],
  );
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, newItem()] }));

  const removeItem = (id: string) =>
    setForm((f) => ({ ...f, items: f.items.filter((i) => i.id !== id) }));

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number,
  ) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    }));

  const handleSave = () => {
    if (!form.clientName.trim()) {
      toast.error("Client name required");
      return;
    }
    const q: Quotation = {
      id: Date.now().toString(),
      clientName: form.clientName,
      date: form.date,
      validUntil: form.validUntil,
      items: form.items,
      taxPercent: form.taxPercent,
      createdAt: new Date().toISOString(),
    };
    persist([q, ...quotations]);
    setView("list");
    toast.success("Quotation saved");
  };

  const handleDelete = (id: string) => {
    persist(quotations.filter((q) => q.id !== id));
    toast.success("Quotation deleted");
  };

  const handlePrint = (q: Quotation) => {
    setSelectedQ(q);
    setView("preview");
    setTimeout(() => window.print(), 300);
  };

  if (view === "create") {
    return (
      <div className="p-4 pb-24 max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">New Quotation</h2>
          <Button
            data-ocid="quotation.cancel_button"
            variant="outline"
            size="sm"
            onClick={() => setView("list")}
          >
            Back
          </Button>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <Label>Client Name *</Label>
                <Input
                  data-ocid="quotation.input"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, clientName: e.target.value }))
                  }
                  placeholder="Company / Client name"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, validUntil: e.target.value }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Line Items</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {form.items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  {idx === 0 && <Label className="text-xs">Description</Label>}
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-2">
                  {idx === 0 && <Label className="text-xs">Qty</Label>}
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.id, "qty", Number(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-2">
                  {idx === 0 && <Label className="text-xs">Unit</Label>}
                  <Input
                    value={item.unit}
                    onChange={(e) =>
                      updateItem(item.id, "unit", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  {idx === 0 && <Label className="text-xs">Unit Price</Label>}
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, "unitPrice", Number(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-1">
                  {idx === 0 && <div className="h-4" />}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-full text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    disabled={form.items.length === 1}
                  >
                    <Minus size={14} />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              data-ocid="quotation.secondary_button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="mt-2"
            >
              <Plus size={14} className="mr-1" /> Add Line Item
            </Button>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Tax</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={form.taxPercent}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      taxPercent: Number(e.target.value),
                    }))
                  }
                  className="w-16 h-7 text-xs"
                />
                <span>%</span>
                <span>₹{taxAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-lg">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </CardContent>
        </Card>

        <Button
          data-ocid="quotation.submit_button"
          className="w-full"
          onClick={handleSave}
        >
          Save Quotation
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Quotations</h1>
          <p className="text-sm text-muted-foreground">
            Client quotations banayein aur manage karein
          </p>
        </div>
        <Button
          data-ocid="quotation.open_modal_button"
          size="sm"
          onClick={() => setView("create")}
        >
          <Plus size={16} className="mr-1" /> New Quotation
        </Button>
      </div>

      {quotations.length === 0 ? (
        <Card data-ocid="quotation.empty_state">
          <CardContent className="py-12 text-center">
            <FileText
              size={32}
              className="mx-auto mb-3 text-muted-foreground/40"
            />
            <p className="text-muted-foreground">
              Koi quotation nahi hai. "New Quotation" se shuru karein.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {quotations.map((q, idx) => {
            const sub = q.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
            const tot = sub + (sub * q.taxPercent) / 100;
            return (
              <Card key={q.id} data-ocid={`quotation.item.${idx + 1}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {q.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {q.date}
                        {q.validUntil ? ` · Valid till: ${q.validUntil}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {q.items.length} items · Total: ₹
                        {tot.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        data-ocid={`quotation.primary_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePrint(q)}
                        title="Print / PDF"
                      >
                        <Printer size={14} />
                      </Button>
                      <Button
                        data-ocid={`quotation.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(q.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
