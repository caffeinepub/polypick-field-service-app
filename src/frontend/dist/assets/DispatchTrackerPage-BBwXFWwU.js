import { r as reactExports, j as jsxRuntimeExports, B as Button, n as Plus, L as Label, I as Input, s as Select, v as SelectTrigger, w as SelectValue, x as SelectContent, y as SelectItem, C as Card, l as CardContent, bQ as Truck, h as Badge, z as ue } from "./index-DbjPUQDs.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-x_F93RN-.js";
import { T as Textarea } from "./textarea-k-DTS19z.js";
import { P as Pencil } from "./pencil-DZyY2q8y.js";
import { T as Trash2 } from "./trash-2-AM3OX5RE.js";
import "./index-CzBemFCv.js";
const STAGES = [
  "Order Received",
  "In Production",
  "Quality Check",
  "Ready to Dispatch",
  "Dispatched",
  "Delivered"
];
const STAGE_COLORS = {
  "Order Received": "bg-blue-100 text-blue-700 border-blue-200",
  "In Production": "bg-orange-100 text-orange-700 border-orange-200",
  "Quality Check": "bg-purple-100 text-purple-700 border-purple-200",
  "Ready to Dispatch": "bg-amber-100 text-amber-700 border-amber-200",
  Dispatched: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Delivered: "bg-green-100 text-green-700 border-green-200"
};
const STORAGE_KEY = "polypick_dispatch_tracker";
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function save(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}
const emptyForm = () => ({
  orderNo: "",
  client: "",
  product: "",
  qty: "",
  stage: "Order Received",
  expectedDate: "",
  remarks: ""
});
function DispatchTrackerPage() {
  const [orders, setOrders] = reactExports.useState(load);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const [filterStage, setFilterStage] = reactExports.useState("All");
  const [search, setSearch] = reactExports.useState("");
  const persist = reactExports.useCallback((updated) => {
    setOrders(updated);
    save(updated);
  }, []);
  const filtered = reactExports.useMemo(
    () => orders.filter((o) => {
      const stageMatch = filterStage === "All" || o.stage === filterStage;
      const searchMatch = o.client.toLowerCase().includes(search.toLowerCase()) || o.orderNo.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
      return stageMatch && searchMatch;
    }),
    [orders, filterStage, search]
  );
  const stageCounts = reactExports.useMemo(
    () => Object.fromEntries(
      STAGES.map((s) => [s, orders.filter((o) => o.stage === s).length])
    ),
    [orders]
  );
  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };
  const openEdit = (order) => {
    setEditing(order);
    setForm({ ...order });
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.client.trim() || !form.orderNo.trim()) {
      ue.error("Order No and Client are required");
      return;
    }
    let updated;
    if (editing) {
      updated = orders.map(
        (o) => o.id === editing.id ? { ...form, id: editing.id } : o
      );
    } else {
      updated = [{ ...form, id: Date.now().toString() }, ...orders];
    }
    persist(updated);
    setOpen(false);
    ue.success(editing ? "Order updated" : "Order added");
  };
  const handleDelete = (id) => {
    persist(orders.filter((o) => o.id !== id));
    ue.success("Order deleted");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-24 max-w-4xl mx-auto space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: "Dispatch Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Orders ka stage-wise status track karein" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "dispatch.open_modal_button",
            size: "sm",
            onClick: openAdd,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-1" }),
              " Add Order"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "dispatch.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Order" : "Add Order" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Order No *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "dispatch.input",
                  value: form.orderNo,
                  onChange: (e) => setForm((f) => ({ ...f, orderNo: e.target.value })),
                  placeholder: "ORD-2024-001"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Client *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.client,
                  onChange: (e) => setForm((f) => ({ ...f, client: e.target.value })),
                  placeholder: "Company name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Product" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.product,
                  onChange: (e) => setForm((f) => ({ ...f, product: e.target.value })),
                  placeholder: "UHMWPE Liners..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Qty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.qty,
                  onChange: (e) => setForm((f) => ({ ...f, qty: e.target.value })),
                  placeholder: "100 Pcs / 500 Mtr"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Stage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.stage,
                  onValueChange: (v) => setForm((f) => ({ ...f, stage: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "dispatch.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Expected Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: form.expectedDate,
                  onChange: (e) => setForm((f) => ({ ...f, expectedDate: e.target.value }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Remarks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  "data-ocid": "dispatch.textarea",
                  value: form.remarks,
                  onChange: (e) => setForm((f) => ({ ...f, remarks: e.target.value })),
                  rows: 2,
                  placeholder: "Additional notes..."
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "dispatch.cancel_button",
                variant: "outline",
                onClick: () => setOpen(false),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { "data-ocid": "dispatch.save_button", onClick: handleSave, children: editing ? "Update" : "Add" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 overflow-x-auto pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "dispatch.tab",
          variant: filterStage === "All" ? "default" : "outline",
          size: "sm",
          className: "flex-shrink-0",
          onClick: () => setFilterStage("All"),
          children: [
            "All (",
            orders.length,
            ")"
          ]
        }
      ),
      STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: filterStage === s ? "default" : "outline",
          size: "sm",
          className: "flex-shrink-0",
          onClick: () => setFilterStage(s),
          children: [
            s,
            " (",
            stageCounts[s],
            ")"
          ]
        },
        s
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        "data-ocid": "dispatch.search_input",
        placeholder: "Search by client, order no, product...",
        value: search,
        onChange: (e) => setSearch(e.target.value)
      }
    ),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "dispatch.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Truck,
        {
          size: 32,
          className: "mx-auto mb-3 text-muted-foreground/40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Koi order nahi mila." })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((order, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": `dispatch.item.${idx + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: order.client }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `text-xs ${STAGE_COLORS[order.stage]}`,
              children: order.stage
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          "#",
          order.orderNo,
          " · ",
          order.product,
          " · ",
          order.qty
        ] }),
        order.expectedDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Expected: ",
          order.expectedDate
        ] }),
        order.remarks && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: order.remarks })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": `dispatch.edit_button.${idx + 1}`,
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8",
            onClick: () => openEdit(order),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": `dispatch.delete_button.${idx + 1}`,
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 text-destructive hover:text-destructive",
            onClick: () => handleDelete(order.id),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
          }
        )
      ] })
    ] }) }) }, order.id)) })
  ] });
}
export {
  DispatchTrackerPage as default
};
