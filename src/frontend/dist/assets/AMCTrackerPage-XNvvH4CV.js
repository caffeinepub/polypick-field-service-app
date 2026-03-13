import { r as reactExports, j as jsxRuntimeExports, B as Button, n as Plus, L as Label, I as Input, C as Card, l as CardContent, bp as Shield, h as Badge, z as ue } from "./index-DbjPUQDs.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-x_F93RN-.js";
import { T as Textarea } from "./textarea-k-DTS19z.js";
import { P as Pencil } from "./pencil-DZyY2q8y.js";
import { T as Trash2 } from "./trash-2-AM3OX5RE.js";
import "./index-CzBemFCv.js";
const STORAGE_KEY = "polypick_amc_tracker";
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function save(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
function getStatus(endDate) {
  if (!endDate) return "Active";
  const end = new Date(endDate);
  const today = /* @__PURE__ */ new Date();
  const diff = (end.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24);
  if (diff < 0) return "Expired";
  if (diff <= 30) return "Due Soon";
  return "Active";
}
const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700 border-green-200",
  Expired: "bg-red-100 text-red-700 border-red-200",
  "Due Soon": "bg-amber-100 text-amber-700 border-amber-200"
};
const emptyForm = () => ({
  client: "",
  equipment: "",
  startDate: "",
  endDate: "",
  contractValue: 0,
  contactPerson: "",
  notes: ""
});
function AMCTrackerPage() {
  const [records, setRecords] = reactExports.useState(load);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const [filterStatus, setFilterStatus] = reactExports.useState("All");
  const [search, setSearch] = reactExports.useState("");
  const persist = reactExports.useCallback((updated) => {
    setRecords(updated);
    save(updated);
  }, []);
  const recordsWithStatus = reactExports.useMemo(
    () => records.map((r) => ({ ...r, status: getStatus(r.endDate) })),
    [records]
  );
  const filtered = reactExports.useMemo(
    () => recordsWithStatus.filter((r) => {
      const statusMatch = filterStatus === "All" || r.status === filterStatus;
      const searchMatch = r.client.toLowerCase().includes(search.toLowerCase()) || r.equipment.toLowerCase().includes(search.toLowerCase());
      return statusMatch && searchMatch;
    }),
    [recordsWithStatus, filterStatus, search]
  );
  const counts = reactExports.useMemo(
    () => ({
      total: records.length,
      active: recordsWithStatus.filter((r) => r.status === "Active").length,
      dueSoon: recordsWithStatus.filter((r) => r.status === "Due Soon").length,
      expired: recordsWithStatus.filter((r) => r.status === "Expired").length
    }),
    [records, recordsWithStatus]
  );
  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ ...r });
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.client.trim()) {
      ue.error("Client name required");
      return;
    }
    let updated;
    if (editing) {
      updated = records.map(
        (r) => r.id === editing.id ? { ...form, id: editing.id } : r
      );
    } else {
      updated = [{ ...form, id: Date.now().toString() }, ...records];
    }
    persist(updated);
    setOpen(false);
    ue.success(editing ? "AMC updated" : "AMC added");
  };
  const handleDelete = (id) => {
    persist(records.filter((r) => r.id !== id));
    ue.success("AMC record deleted");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-24 max-w-4xl mx-auto space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: "AMC Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Annual Maintenance Contracts track karein" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "amc.open_modal_button",
            size: "sm",
            onClick: openAdd,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "mr-1" }),
              " Add AMC"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "amc.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit AMC" : "Add AMC" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Client *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "amc.input",
                  value: form.client,
                  onChange: (e) => setForm((f) => ({ ...f, client: e.target.value })),
                  placeholder: "Company name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Equipment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.equipment,
                  onChange: (e) => setForm((f) => ({ ...f, equipment: e.target.value })),
                  placeholder: "Conveyor belt, liner..."
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Start Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: form.startDate,
                  onChange: (e) => setForm((f) => ({ ...f, startDate: e.target.value }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "End Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: form.endDate,
                  onChange: (e) => setForm((f) => ({ ...f, endDate: e.target.value }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Contract Value (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: form.contractValue,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    contractValue: Number(e.target.value)
                  }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Contact Person" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.contactPerson,
                  onChange: (e) => setForm((f) => ({ ...f, contactPerson: e.target.value })),
                  placeholder: "Contact name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  "data-ocid": "amc.textarea",
                  value: form.notes,
                  onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
                  rows: 2,
                  placeholder: "Additional info..."
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "amc.cancel_button",
                variant: "outline",
                onClick: () => setOpen(false),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { "data-ocid": "amc.save_button", onClick: handleSave, children: editing ? "Update" : "Add" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: counts.total }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-green-600", children: counts.active }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-amber-600", children: counts.dueSoon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Due Soon" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-red-600", children: counts.expired }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Expired" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
      ["All", "Active", "Due Soon", "Expired"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "amc.tab",
          variant: filterStatus === s ? "default" : "outline",
          size: "sm",
          onClick: () => setFilterStatus(s),
          children: s
        },
        s
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "amc.search_input",
          placeholder: "Search client or equipment...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "max-w-xs"
        }
      )
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "amc.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Shield,
        {
          size: 32,
          className: "mx-auto mb-3 text-muted-foreground/40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Koi AMC record nahi mila." })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        "data-ocid": `amc.item.${idx + 1}`,
        className: r.status === "Expired" ? "border-red-200 bg-red-50/30 dark:bg-red-950/10" : r.status === "Due Soon" ? "border-amber-200 bg-amber-50/30 dark:bg-amber-950/10" : "",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: r.client }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${STATUS_COLORS[r.status]}`,
                  children: r.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: r.equipment }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              r.startDate,
              " → ",
              r.endDate,
              r.contractValue > 0 && ` · ₹${r.contractValue.toLocaleString("en-IN")}`
            ] }),
            r.contactPerson && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Contact: ",
              r.contactPerson
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": `amc.edit_button.${idx + 1}`,
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8",
                onClick: () => openEdit(r),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": `amc.delete_button.${idx + 1}`,
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 text-destructive hover:text-destructive",
                onClick: () => handleDelete(r.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
              }
            )
          ] })
        ] }) })
      },
      r.id
    )) })
  ] });
}
export {
  AMCTrackerPage as default
};
