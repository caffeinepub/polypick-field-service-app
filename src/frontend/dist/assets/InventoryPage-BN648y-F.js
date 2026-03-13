import { r as reactExports, j as jsxRuntimeExports, B as Button, n as Plus, L as Label, I as Input, s as Select, v as SelectTrigger, w as SelectValue, x as SelectContent, y as SelectItem, C as Card, l as CardContent, bL as Package, al as TriangleAlert, h as Badge, z as ue } from "./index-DbjPUQDs.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-x_F93RN-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CpdBFqUb.js";
import { D as Download } from "./download-CPqjANUi.js";
import { P as Pencil } from "./pencil-DZyY2q8y.js";
import { T as Trash2 } from "./trash-2-AM3OX5RE.js";
import "./index-CzBemFCv.js";
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
  "Other"
];
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function save(parts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parts));
}
const emptyForm = () => ({
  id: "",
  name: "",
  partNumber: "",
  category: "Other",
  quantity: 0,
  minStock: 5,
  unit: "Pcs",
  supplier: ""
});
function InventoryPage() {
  const [parts, setParts] = reactExports.useState(load);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const [search, setSearch] = reactExports.useState("");
  const persist = reactExports.useCallback((updated) => {
    setParts(updated);
    save(updated);
  }, []);
  const filtered = reactExports.useMemo(
    () => parts.filter(
      (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.partNumber.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    ),
    [parts, search]
  );
  const lowStockCount = reactExports.useMemo(
    () => parts.filter((p) => p.quantity <= p.minStock).length,
    [parts]
  );
  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };
  const openEdit = (part) => {
    setEditing(part);
    setForm({ ...part });
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.name.trim()) {
      ue.error("Part name required");
      return;
    }
    let updated;
    if (editing) {
      updated = parts.map(
        (p) => p.id === editing.id ? { ...form, id: editing.id } : p
      );
    } else {
      updated = [...parts, { ...form, id: Date.now().toString() }];
    }
    persist(updated);
    setOpen(false);
    ue.success(editing ? "Part updated" : "Part added");
  };
  const handleDelete = (id) => {
    persist(parts.filter((p) => p.id !== id));
    ue.success("Part deleted");
  };
  const exportCSV = () => {
    const headers = "Part Name,Part Number,Category,Quantity,Min Stock,Unit,Supplier\n";
    const rows = parts.map(
      (p) => `"${p.name}","${p.partNumber}","${p.category}",${p.quantity},${p.minStock},"${p.unit}","${p.supplier}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
    ue.success("CSV exported");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-24 max-w-4xl mx-auto space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: "Spare Parts Inventory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Parts aur stock track karein" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "inventory.open_modal_button",
            size: "sm",
            onClick: openAdd,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-1" }),
              " Add Part"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "inventory.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Part" : "Add New Part" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Part Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "inventory.input",
                  value: form.name,
                  onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
                  placeholder: "e.g. UHMWPE Liner 500mm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Part Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.partNumber,
                  onChange: (e) => setForm((f) => ({ ...f, partNumber: e.target.value })),
                  placeholder: "PP-001"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.category,
                  onValueChange: (v) => setForm((f) => ({ ...f, category: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "inventory.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: form.quantity,
                  onChange: (e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Min Stock Level" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: form.minStock,
                  onChange: (e) => setForm((f) => ({ ...f, minStock: Number(e.target.value) }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.unit,
                  onChange: (e) => setForm((f) => ({ ...f, unit: e.target.value })),
                  placeholder: "Pcs / Mtr / Kg"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Supplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.supplier,
                  onChange: (e) => setForm((f) => ({ ...f, supplier: e.target.value })),
                  placeholder: "Supplier name"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "inventory.cancel_button",
                variant: "outline",
                onClick: () => setOpen(false),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { "data-ocid": "inventory.save_button", onClick: handleSave, children: editing ? "Update" : "Add Part" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: parts.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Parts" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-red-600", children: lowStockCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Low Stock" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "inventory.primary_button",
          variant: "outline",
          size: "sm",
          className: "w-full",
          onClick: exportCSV,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14, className: "mr-1" }),
            " CSV"
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        "data-ocid": "inventory.search_input",
        placeholder: "Search parts...",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        className: "max-w-sm"
      }
    ),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "inventory.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Package,
        {
          size: 32,
          className: "mx-auto mb-3 text-muted-foreground/40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Koi part nahi mila." })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "inventory.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Part Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Part No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Qty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Min" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Unit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Supplier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          "data-ocid": `inventory.row.${idx + 1}`,
          className: p.quantity <= p.minStock ? "bg-red-50 dark:bg-red-950/20" : "",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              p.quantity <= p.minStock && /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  size: 14,
                  className: "text-red-500 flex-shrink-0"
                }
              ),
              p.name
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: p.partNumber || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: p.category }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-bold ${p.quantity <= p.minStock ? "text-red-600" : "text-foreground"}`,
                children: p.quantity
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: p.minStock }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: p.unit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: p.supplier || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `inventory.edit_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8",
                  onClick: () => openEdit(p),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `inventory.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 text-destructive hover:text-destructive",
                  onClick: () => handleDelete(p.id),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                }
              )
            ] }) })
          ]
        },
        p.id
      )) })
    ] }) })
  ] });
}
export {
  InventoryPage as default
};
