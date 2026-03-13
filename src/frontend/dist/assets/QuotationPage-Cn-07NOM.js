import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, C as Card, l as CardContent, L as Label, I as Input, i as CardHeader, k as CardTitle, n as Plus, bN as Separator, F as FileText, z as ue } from "./index-DbjPUQDs.js";
import { P as Printer } from "./printer-BujzTYqY.js";
import { T as Trash2 } from "./trash-2-AM3OX5RE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
const STORAGE_KEY = "polypick_quotations";
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function save(qs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qs));
}
function newItem() {
  return {
    id: Date.now().toString() + Math.random(),
    description: "",
    qty: 1,
    unit: "Pcs",
    unitPrice: 0
  };
}
function QuotationPage() {
  const [quotations, setQuotations] = reactExports.useState(load);
  const [view, setView] = reactExports.useState("list");
  const [_selectedQ, setSelectedQ] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    clientName: "",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    validUntil: "",
    taxPercent: 18,
    items: [newItem()]
  });
  const persist = reactExports.useCallback((updated) => {
    setQuotations(updated);
    save(updated);
  }, []);
  const subtotal = reactExports.useMemo(
    () => form.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
    [form.items]
  );
  const taxAmount = reactExports.useMemo(
    () => subtotal * form.taxPercent / 100,
    [subtotal, form.taxPercent]
  );
  const total = reactExports.useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);
  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, newItem()] }));
  const removeItem = (id) => setForm((f) => ({ ...f, items: f.items.filter((i) => i.id !== id) }));
  const updateItem = (id, field, value) => setForm((f) => ({
    ...f,
    items: f.items.map((i) => i.id === id ? { ...i, [field]: value } : i)
  }));
  const handleSave = () => {
    if (!form.clientName.trim()) {
      ue.error("Client name required");
      return;
    }
    const q = {
      id: Date.now().toString(),
      clientName: form.clientName,
      date: form.date,
      validUntil: form.validUntil,
      items: form.items,
      taxPercent: form.taxPercent,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    persist([q, ...quotations]);
    setView("list");
    ue.success("Quotation saved");
  };
  const handleDelete = (id) => {
    persist(quotations.filter((q) => q.id !== id));
    ue.success("Quotation deleted");
  };
  const handlePrint = (q) => {
    setSelectedQ(q);
    setView("preview");
    setTimeout(() => window.print(), 300);
  };
  if (view === "create") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-24 max-w-3xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold", children: "New Quotation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "quotation.cancel_button",
            variant: "outline",
            size: "sm",
            onClick: () => setView("list"),
            children: "Back"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Client Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "quotation.input",
              value: form.clientName,
              onChange: (e) => setForm((f) => ({ ...f, clientName: e.target.value })),
              placeholder: "Company / Client name"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: form.date,
              onChange: (e) => setForm((f) => ({ ...f, date: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Valid Until" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: form.validUntil,
              onChange: (e) => setForm((f) => ({ ...f, validUntil: e.target.value }))
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Line Items" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-2", children: [
          form.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-5", children: [
              idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: item.description,
                  onChange: (e) => updateItem(item.id, "description", e.target.value),
                  placeholder: "Item description"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Qty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: item.qty,
                  onChange: (e) => updateItem(item.id, "qty", Number(e.target.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: item.unit,
                  onChange: (e) => updateItem(item.id, "unit", e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Unit Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: item.unitPrice,
                  onChange: (e) => updateItem(item.id, "unitPrice", Number(e.target.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1", children: [
              idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-9 w-full text-destructive hover:text-destructive",
                  onClick: () => removeItem(item.id),
                  disabled: form.items.length === 1,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14 })
                }
              )
            ] })
          ] }, item.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "quotation.secondary_button",
              variant: "outline",
              size: "sm",
              onClick: addItem,
              className: "mt-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1" }),
                " Add Line Item"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "₹",
            subtotal.toLocaleString("en-IN")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tax" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: form.taxPercent,
                onChange: (e) => setForm((f) => ({
                  ...f,
                  taxPercent: Number(e.target.value)
                })),
                className: "w-16 h-7 text-xs"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "%" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "₹",
              taxAmount.toLocaleString("en-IN")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg", children: [
            "₹",
            total.toLocaleString("en-IN")
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "quotation.submit_button",
          className: "w-full",
          onClick: handleSave,
          children: "Save Quotation"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-24 max-w-3xl mx-auto space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: "Quotations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Client quotations banayein aur manage karein" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "quotation.open_modal_button",
          size: "sm",
          onClick: () => setView("create"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-1" }),
            " New Quotation"
          ]
        }
      )
    ] }),
    quotations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "quotation.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FileText,
        {
          size: 32,
          className: "mx-auto mb-3 text-muted-foreground/40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: 'Koi quotation nahi hai. "New Quotation" se shuru karein.' })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: quotations.map((q, idx) => {
      const sub = q.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
      const tot = sub + sub * q.taxPercent / 100;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": `quotation.item.${idx + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: q.clientName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Date: ",
            q.date,
            q.validUntil ? ` · Valid till: ${q.validUntil}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            q.items.length,
            " items · Total: ₹",
            tot.toLocaleString("en-IN")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": `quotation.primary_button.${idx + 1}`,
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8",
              onClick: () => handlePrint(q),
              title: "Print / PDF",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": `quotation.delete_button.${idx + 1}`,
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 text-destructive hover:text-destructive",
              onClick: () => handleDelete(q.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
            }
          )
        ] })
      ] }) }) }, q.id);
    }) })
  ] });
}
export {
  QuotationPage as default
};
