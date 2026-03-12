import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, b1 as Ticket, B as Button, C as Card, l as CardContent, h as Badge, I as Input, q as Select, s as SelectTrigger, v as SelectValue, w as SelectContent, x as SelectItem, as as CircleCheck, ar as Clock, b2 as Wrench, M as MapPin, y as ue, L as Label } from "./index-zYE3ieSM.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-D9sYaUqc.js";
import { T as Textarea } from "./textarea-CAkbLSug.js";
import { D as Download } from "./download-BTjaIlUc.js";
import { P as Plus } from "./plus-B0va8LMJ.js";
import { C as CircleX } from "./circle-x-BZv0IHio.js";
import { C as CircleAlert } from "./circle-alert-nZeB5Sqv.js";
import { P as Pencil } from "./pencil-EOsYyocv.js";
import { T as Trash2 } from "./trash-2-8T3S_jQy.js";
import "./index-DZCkCVJa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode);
function useTickets() {
  const [tickets, setTickets] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_tickets") ?? "[]");
    } catch {
      return [];
    }
  });
  const save = (next) => {
    setTickets(next);
    localStorage.setItem("polypick_tickets", JSON.stringify(next));
  };
  const add = (t) => {
    const now = Date.now();
    const ticketNo = `TKT-${String(now).slice(-6)}`;
    save([{ ...t, id: String(now), ticketNo }, ...tickets]);
  };
  const update = (id, updates) => {
    save(tickets.map((t) => t.id === id ? { ...t, ...updates } : t));
  };
  const remove = (id) => save(tickets.filter((t) => t.id !== id));
  return { tickets, add, update, remove };
}
const emptyForm = {
  clientName: "",
  issueDescription: "",
  priority: "Medium",
  status: "Open",
  assignedTo: "",
  dateCreated: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  dateResolved: "",
  notes: "",
  serviceType: "",
  equipmentName: "",
  location: "",
  workDone: "",
  partsUsed: "",
  nextServiceDate: "",
  visitType: ""
};
const STATUS_CONFIG = {
  Open: { label: "Open", color: "bg-blue-100 text-blue-700", icon: Clock },
  "In Progress": {
    label: "In Progress",
    color: "bg-amber-100 text-amber-700",
    icon: CircleAlert
  },
  Resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-700",
    icon: CircleCheck
  },
  Closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-600",
    icon: CircleX
  }
};
const PRIORITY_COLOR = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700"
};
const SERVICE_TYPE_COLOR = {
  Installation: "bg-purple-100 text-purple-700",
  Repair: "bg-red-100 text-red-700",
  Maintenance: "bg-blue-100 text-blue-700",
  Inspection: "bg-cyan-100 text-cyan-700",
  AMC: "bg-green-100 text-green-700",
  Other: "bg-gray-100 text-gray-600"
};
function TicketFormContent({
  initialValues,
  onSave,
  onCancel,
  submitLabel
}) {
  const [form, setForm] = reactExports.useState(initialValues);
  const handleSubmit = () => {
    if (!form.clientName.trim() || !form.issueDescription.trim()) {
      ue.error("Client name aur issue description zaroori hai");
      return;
    }
    onSave(form);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-h-[70vh] overflow-y-auto pr-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Basic Info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Client Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Client ka naam",
              value: form.clientName,
              onChange: (e) => setForm((p) => ({ ...p, clientName: e.target.value })),
              "data-ocid": "ticket.client_name.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Assigned To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Staff member",
              value: form.assignedTo,
              onChange: (e) => setForm((p) => ({ ...p, assignedTo: e.target.value })),
              "data-ocid": "ticket.assigned_to.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Issue Description *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            placeholder: "Problem ki detail likhein...",
            rows: 2,
            value: form.issueDescription,
            onChange: (e) => setForm((p) => ({ ...p, issueDescription: e.target.value })),
            "data-ocid": "ticket.issue.textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Priority" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.priority,
              onValueChange: (v) => setForm((p) => ({
                ...p,
                priority: v
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "ticket.priority.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "High", children: "High" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Medium", children: "Medium" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Low", children: "Low" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.status,
              onValueChange: (v) => setForm((p) => ({
                ...p,
                status: v
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "ticket.status.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Open", children: "Open" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "In Progress", children: "In Progress" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Resolved", children: "Resolved" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Closed", children: "Closed" })
                ] })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Service Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Service Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.serviceType,
              onValueChange: (v) => setForm((p) => ({
                ...p,
                serviceType: v
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "ticket.service_type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Installation", children: "Installation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Repair", children: "Repair" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Maintenance", children: "Maintenance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Inspection", children: "Inspection" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMC", children: "AMC" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Visit Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.visitType,
              onValueChange: (v) => setForm((p) => ({
                ...p,
                visitType: v
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "ticket.visit_type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select visit" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "First Visit", children: "First Visit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Revisit", children: "Revisit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Warranty", children: "Warranty" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paid", children: "Paid" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AMC Visit", children: "AMC Visit" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Equipment / Machine Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. UHMWPE Liner, Conveyor Belt, Pump...",
            value: form.equipmentName,
            onChange: (e) => setForm((p) => ({ ...p, equipmentName: e.target.value })),
            "data-ocid": "ticket.equipment_name.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Site / Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. RSP Rourkela, Plant Area B...",
            value: form.location,
            onChange: (e) => setForm((p) => ({ ...p, location: e.target.value })),
            "data-ocid": "ticket.location.input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Work Report" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Work Done" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            placeholder: "Kya kaam kiya gaya -- detail mein likhein...",
            rows: 3,
            value: form.workDone,
            onChange: (e) => setForm((p) => ({ ...p, workDone: e.target.value })),
            "data-ocid": "ticket.work_done.textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Parts / Materials Used" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. UHMWPE Sheet 10mm, Bolts M16, Sealant... (comma separated)",
            value: form.partsUsed,
            onChange: (e) => setForm((p) => ({ ...p, partsUsed: e.target.value })),
            "data-ocid": "ticket.parts_used.input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Dates" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date Created" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: form.dateCreated,
              onChange: (e) => setForm((p) => ({ ...p, dateCreated: e.target.value })),
              "data-ocid": "ticket.date_created.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date Resolved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: form.dateResolved,
              onChange: (e) => setForm((p) => ({ ...p, dateResolved: e.target.value })),
              "data-ocid": "ticket.date_resolved.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Next Service Due Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            value: form.nextServiceDate,
            onChange: (e) => setForm((p) => ({ ...p, nextServiceDate: e.target.value })),
            "data-ocid": "ticket.next_service_date.input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          placeholder: "Additional notes...",
          rows: 2,
          value: form.notes,
          onChange: (e) => setForm((p) => ({ ...p, notes: e.target.value })),
          "data-ocid": "ticket.notes.textarea"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onCancel,
          "data-ocid": "tickets.form.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSubmit, "data-ocid": "tickets.form.submit_button", children: submitLabel })
    ] })
  ] });
}
function ServiceTicketsPage() {
  const { tickets, add, update, remove } = useTickets();
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterPriority, setFilterPriority] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editTicket, setEditTicket] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const filtered = tickets.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    const q = search.toLowerCase();
    if (q && !t.clientName.toLowerCase().includes(q) && !t.ticketNo.toLowerCase().includes(q) && !t.issueDescription.toLowerCase().includes(q) && !(t.equipmentName ?? "").toLowerCase().includes(q) && !(t.location ?? "").toLowerCase().includes(q))
      return false;
    return true;
  });
  const handleAddSave = (values) => {
    add(values);
    ue.success("Ticket created!");
    setAddOpen(false);
  };
  const handleEditSave = (values) => {
    if (!editTicket) return;
    update(editTicket.id, values);
    ue.success("Ticket updated!");
    setEditTicket(null);
  };
  const handleDelete = () => {
    if (!deleteId) return;
    remove(deleteId);
    ue.success("Ticket deleted");
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
      "Notes"
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
      t.notes
    ]);
    const csv = [headers, ...rows].map(
      (r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Service_Tickets_Polypick.csv";
    a.click();
    URL.revokeObjectURL(url);
    ue.success("CSV exported!");
  };
  const counts = {
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
    closed: tickets.filter((t) => t.status === "Closed").length
  };
  const editInitialValues = editTicket ? {
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
    visitType: editTicket.visitType ?? ""
  } : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 md:p-6 space-y-5 animate-fade-in",
      "data-ocid": "tickets.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { size: 24, className: "text-primary" }),
              "Service Tickets"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Client complaints aur service requests track karein" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: exportCsv,
                className: "gap-2",
                "data-ocid": "tickets.export.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
                  "Export CSV"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => setAddOpen(true),
                className: "gap-2",
                "data-ocid": "tickets.add.primary_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                  "New Ticket"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          {
            label: "Open",
            count: counts.open,
            color: "text-blue-600 bg-blue-50"
          },
          {
            label: "In Progress",
            count: counts.inProgress,
            color: "text-amber-600 bg-amber-50"
          },
          {
            label: "Resolved",
            count: counts.resolved,
            color: "text-green-600 bg-green-50"
          },
          {
            label: "Closed",
            count: counts.closed,
            color: "text-gray-600 bg-gray-50"
          }
        ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: s.count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${s.color} border-0 text-xs mt-1`, children: s.label })
        ] }) }, s.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1 min-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search tickets, equipment, location...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-3 h-8 text-sm",
              "data-ocid": "tickets.search.input"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 14, className: "text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterStatus, onValueChange: setFilterStatus, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 text-xs w-[120px]",
                "data-ocid": "tickets.filter_status.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Open", children: "Open" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "In Progress", children: "In Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Resolved", children: "Resolved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Closed", children: "Closed" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterPriority, onValueChange: setFilterPriority, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 text-xs w-[120px]",
                "data-ocid": "tickets.filter_priority.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Priority" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "High", children: "High" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Medium", children: "Medium" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Low", children: "Low" })
            ] })
          ] })
        ] }),
        filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CardContent,
          {
            className: "py-14 text-center text-muted-foreground",
            "data-ocid": "tickets.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { size: 40, className: "mx-auto mb-3 opacity-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Koi ticket nahi mila" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Naya ticket add karein" })
            ]
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((t, idx) => {
          const statusCfg = STATUS_CONFIG[t.status];
          const StatusIcon = statusCfg.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border border-border",
              "data-ocid": `tickets.item.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground", children: t.ticketNo }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: `${PRIORITY_COLOR[t.priority]} border-0 text-xs`,
                        children: t.priority
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        className: `${statusCfg.color} border-0 text-xs flex items-center gap-1`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { size: 10 }),
                          t.status
                        ]
                      }
                    ),
                    t.serviceType && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        className: `${SERVICE_TYPE_COLOR[t.serviceType] ?? "bg-gray-100 text-gray-600"} border-0 text-xs flex items-center gap-1`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { size: 9 }),
                          t.serviceType
                        ]
                      }
                    ),
                    t.visitType && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-indigo-100 text-indigo-700 border-0 text-xs", children: t.visitType })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: t.clientName }),
                  (t.equipmentName || t.location) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-0.5 text-xs text-muted-foreground", children: [
                    t.equipmentName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { size: 10 }),
                      t.equipmentName
                    ] }),
                    t.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                      t.location
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5 line-clamp-2", children: t.issueDescription }),
                  t.workDone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: [
                    "🔧 ",
                    t.workDone
                  ] }),
                  t.partsUsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: [
                    "🔩 Parts: ",
                    t.partsUsed
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground", children: [
                    t.assignedTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "👤 ",
                      t.assignedTo
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "📅 ",
                      t.dateCreated
                    ] }),
                    t.dateResolved && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "✅ Resolved: ",
                      t.dateResolved
                    ] }),
                    t.nextServiceDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-600 font-medium", children: [
                      "🔁 Next: ",
                      t.nextServiceDate
                    ] })
                  ] }),
                  t.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 italic", children: [
                    "📝 ",
                    t.notes
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7",
                      onClick: () => setEditTicket(t),
                      "data-ocid": `tickets.edit_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-destructive hover:text-destructive",
                      onClick: () => setDeleteId(t.id),
                      "data-ocid": `tickets.delete_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                    }
                  )
                ] })
              ] }) })
            },
            t.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "tickets.add.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { size: 18, className: "text-primary" }),
            "New Service Ticket"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TicketFormContent,
            {
              initialValues: {
                ...emptyForm,
                dateCreated: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
              },
              onSave: handleAddSave,
              onCancel: () => setAddOpen(false),
              submitLabel: "Create Ticket"
            },
            "add-ticket"
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: !!editTicket,
            onOpenChange: (o) => !o && setEditTicket(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "tickets.edit.dialog", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
                "Edit Ticket — ",
                editTicket == null ? void 0 : editTicket.ticketNo
              ] }) }),
              editInitialValues && /* @__PURE__ */ jsxRuntimeExports.jsx(
                TicketFormContent,
                {
                  initialValues: editInitialValues,
                  onSave: handleEditSave,
                  onCancel: () => setEditTicket(null),
                  submitLabel: "Save Changes"
                },
                editTicket == null ? void 0 : editTicket.id
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "tickets.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Ticket Delete Karein?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Yeh action undo nahi ho sakti. Ticket permanently delete ho jayega." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDeleteId(null),
                "data-ocid": "tickets.delete.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: handleDelete,
                "data-ocid": "tickets.delete.confirm_button",
                children: "Delete"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ServiceTicketsPage as default
};
