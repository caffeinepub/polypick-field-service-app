import { r as reactExports, t as todayInputStr, e as useInteractions, Q as useClients, X as usePipelineStats, g as useCreateInteraction, Y as useUpdateInteraction, Z as useDeleteInteraction, b as useInternetIdentity, j as jsxRuntimeExports, _ as GitBranch, B as Button, W as Search, I as Input, C as Card, l as CardContent, $ as TrendingUp, S as Skeleton, h as Badge, o as StatusBadge, m as formatDate, p as LoaderCircle, z as dateInputToNs, y as ue, a0 as nsToDateInput, L as Label, a1 as Check, q as Select, s as SelectTrigger, v as SelectValue, w as SelectContent, x as SelectItem } from "./index-zYE3ieSM.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-DowIH1nC.js";
import { P as Popover, a as PopoverTrigger, C as ChevronsUpDown, b as PopoverContent, c as Command, d as CommandInput, e as CommandEmpty, f as CommandGroup, g as CommandItem } from "./popover-CAxVcJWl.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-D9sYaUqc.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DlHiHZj6.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CqcGXpGX.js";
import { T as Textarea } from "./textarea-CAkbLSug.js";
import { F as FileDown } from "./file-down-qeGQj_mI.js";
import { P as Plus } from "./plus-B0va8LMJ.js";
import { P as Pencil } from "./pencil-EOsYyocv.js";
import { T as Trash2 } from "./trash-2-8T3S_jQy.js";
import "./index-DZCkCVJa.js";
const TYPES = ["all", "inquiry", "offer", "order", "service", "payment"];
const TYPE_LABELS = {
  inquiry: "Enquiry",
  offer: "Offer",
  order: "Order",
  service: "Service",
  payment: "Payment"
};
const TYPE_COLORS = {
  inquiry: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  offer: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
  order: "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200",
  service: "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
  payment: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
};
const TYPE_ACTIVE = {
  inquiry: "bg-blue-600 text-white border-blue-600",
  offer: "bg-amber-500 text-white border-amber-500",
  order: "bg-emerald-600 text-white border-emerald-600",
  service: "bg-purple-600 text-white border-purple-600",
  payment: "bg-red-600 text-white border-red-600"
};
function printInteractionsPDF(interactions, getClientName) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const rows = interactions.map((int) => {
    const { displayTitle, priority } = decodePriority(int.title);
    const intDate = new Date(
      Number(int.date / 1000000n)
    ).toLocaleDateString("en-IN");
    const amount = int.amount !== void 0 ? `₹${Number(int.amount).toLocaleString("en-IN")}` : "—";
    return `
      <tr>
        <td>${displayTitle}</td>
        <td>${getClientName(int.clientId)}</td>
        <td style="text-transform:capitalize">${TYPE_LABELS[int.type] ?? int.type}</td>
        <td style="text-transform:capitalize">${int.status}</td>
        <td style="text-transform:capitalize">${priority !== "none" ? priority : "—"}</td>
        <td>${amount}</td>
        <td>${intDate}</td>
      </tr>`;
  }).join("");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PPI Pipeline Report – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f0f0f0; padding: 8px 6px; text-align: left; font-size: 11px; border: 1px solid #ccc; }
        td { padding: 7px 6px; border: 1px solid #ddd; }
        tr:nth-child(even) td { background: #fafafa; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>PPI Pipeline Report</p>
        <p>Generated: ${date} &nbsp;|&nbsp; Total Entries: ${interactions.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Client</th>
            <th>Type</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
const PRIORITY_PREFIX_REGEX = /^\[P:(HIGH|MEDIUM|LOW)\]\s*/;
function encodePriority(title, priority) {
  const stripped = title.replace(PRIORITY_PREFIX_REGEX, "");
  if (!priority || priority === "none") return stripped;
  return `[P:${priority.toUpperCase()}] ${stripped}`;
}
function decodePriority(title) {
  const m = title.match(PRIORITY_PREFIX_REGEX);
  if (m) {
    return {
      displayTitle: title.replace(PRIORITY_PREFIX_REGEX, ""),
      priority: m[1].toLowerCase()
    };
  }
  return { displayTitle: title, priority: "none" };
}
const TYPE_BADGE_CLASSES = {
  inquiry: "bg-blue-50 text-blue-700 border-blue-200",
  offer: "bg-amber-50 text-amber-700 border-amber-200",
  order: "bg-emerald-50 text-emerald-700 border-emerald-200",
  service: "bg-purple-50 text-purple-700 border-purple-200",
  payment: "bg-red-50 text-red-700 border-red-200"
};
const PRIORITY_BADGE_CLASSES = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200"
};
const emptyForm = {
  clientId: "",
  type: "inquiry",
  title: "",
  priority: "none",
  description: "",
  status: "open",
  amount: "",
  date: todayInputStr()
};
function InteractionForm({
  form,
  setForm,
  clients,
  onSubmit,
  onCancel,
  submitting
}) {
  const [clientDropOpen, setClientDropOpen] = reactExports.useState(false);
  const [clientSearch, setClientSearch] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4 mt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Task Type *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["inquiry", "offer", "order", "service", "payment"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setForm((p) => ({ ...p, type: t })),
          className: `px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${form.type === t ? TYPE_ACTIVE[t] ?? "bg-primary text-white" : TYPE_COLORS[t] ?? "bg-muted text-muted-foreground border-border"}`,
          "data-ocid": `interaction.type.${t}.toggle`,
          children: TYPE_LABELS[t] ?? t
        },
        t
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Client *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: clientDropOpen, onOpenChange: setClientDropOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            "data-ocid": "interaction.client.select",
            className: "w-full justify-between font-normal",
            children: [
              form.clientId ? (() => {
                const c = (clients ?? []).find(
                  (c2) => c2.id.toString() === form.clientId
                );
                return c ? `${c.name} – ${c.company}` : "Select client";
              })() : "Select client",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-[320px] p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { shouldFilter: false, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CommandInput,
            {
              placeholder: "Client ka naam type karein...",
              value: clientSearch,
              onValueChange: setClientSearch,
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No client found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { className: "max-h-60 overflow-y-auto", children: (clients ?? []).filter(
            (c) => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.company.toLowerCase().includes(clientSearch.toLowerCase())
          ).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            CommandItem,
            {
              value: c.id.toString(),
              onSelect: (v) => {
                setForm((p) => ({ ...p, clientId: v }));
                setClientSearch("");
                setClientDropOpen(false);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Check,
                  {
                    className: `mr-2 h-4 w-4 ${form.clientId === c.id.toString() ? "opacity-100" : "opacity-0"}`
                  }
                ),
                c.name,
                " – ",
                c.company
              ]
            },
            c.id.toString()
          )) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "interaction.title.input",
            value: form.title,
            onChange: (e) => setForm((p) => ({ ...p, title: e.target.value })),
            required: true,
            placeholder: "e.g. Pump supply inquiry"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.priority,
            onValueChange: (v) => setForm((p) => ({ ...p, priority: v })),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "interaction.priority.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "— None —" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "high", children: "🔴 High" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "medium", children: "🟡 Medium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "low", children: "🔵 Low" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          "data-ocid": "interaction.description.textarea",
          value: form.description,
          onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
          rows: 3,
          autoComplete: "off",
          placeholder: "Details..."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.status,
            onValueChange: (v) => setForm((p) => ({ ...p, status: v })),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "interaction.status.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "open", children: "Open" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inProgress", children: "In Progress" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "closed", children: "Closed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "won", children: "Won" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "lost", children: "Lost" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "interaction.amount.input",
            type: "number",
            min: "0",
            value: form.amount,
            onChange: (e) => setForm((p) => ({ ...p, amount: e.target.value })),
            placeholder: "0"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "interaction.date.input",
            type: "date",
            value: form.date,
            onChange: (e) => setForm((p) => ({ ...p, date: e.target.value })),
            required: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          "data-ocid": "interactions.cancel_button",
          onClick: onCancel,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          "data-ocid": "interactions.save_button",
          disabled: submitting || !form.clientId,
          children: [
            submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
            "Save"
          ]
        }
      )
    ] })
  ] });
}
function InteractionsPage() {
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const { data: interactions, isLoading } = useInteractions();
  const { data: clients } = useClients();
  const { data: pipelineStats } = usePipelineStats();
  const createInteraction = useCreateInteraction();
  const updateInteraction = useUpdateInteraction();
  const deleteInteraction = useDeleteInteraction();
  const { identity } = useInternetIdentity();
  const getClientName = (id) => {
    var _a;
    return ((_a = clients == null ? void 0 : clients.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? `Client #${id}`;
  };
  const allInteractions = interactions ?? [];
  const countByType = TYPES.reduce(
    (acc, t) => {
      acc[t] = t === "all" ? allInteractions.length : allInteractions.filter((i) => i.type === t).length;
      return acc;
    },
    {}
  );
  const filtered = allInteractions.filter((i) => activeTab === "all" || i.type === activeTab).filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const clientObj = clients == null ? void 0 : clients.find((c) => c.id === i.clientId);
    const clientName = ((clientObj == null ? void 0 : clientObj.name) ?? `Client #${i.clientId}`).toLowerCase();
    const clientCompany = ((clientObj == null ? void 0 : clientObj.company) ?? "").toLowerCase();
    const { displayTitle } = decodePriority(i.title);
    return displayTitle.toLowerCase().includes(q) || clientName.includes(q) || clientCompany.includes(q) || i.description.toLowerCase().includes(q);
  });
  const INACTIVE_DAYS = 15;
  const inactiveIds = new Set(
    allInteractions.filter((i) => {
      if (!i.updatedAt) return false;
      const updated = new Date(Number(i.updatedAt / 1000000n));
      const diffDays = (Date.now() - updated.getTime()) / (1e3 * 60 * 60 * 24);
      return diffDays >= INACTIVE_DAYS;
    }).map((i) => i.id.toString())
  );
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!identity || !form.clientId) return;
    try {
      const encodedTitle = encodePriority(form.title.trim(), form.priority);
      await createInteraction.mutateAsync({
        id: 0n,
        clientId: BigInt(form.clientId),
        type: form.type,
        title: encodedTitle,
        description: form.description.trim(),
        status: form.status,
        amount: form.amount ? BigInt(form.amount) : void 0,
        date: dateInputToNs(form.date),
        createdBy: identity.getPrincipal(),
        updatedAt: BigInt(Date.now()) * 1000000n
      });
      ue.success("PPI entry added");
      setForm(emptyForm);
      setAddOpen(false);
    } catch {
      ue.error("Failed to add PPI entry");
    }
  };
  const handleEditOpen = (int) => {
    setEditingId(int.id);
    const { displayTitle, priority } = decodePriority(int.title);
    setForm({
      clientId: int.clientId.toString(),
      type: int.type,
      title: displayTitle,
      priority,
      description: int.description,
      status: int.status,
      amount: int.amount !== void 0 ? int.amount.toString() : "",
      date: nsToDateInput(int.date)
    });
    setEditOpen(true);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingId || !identity) return;
    const orig = interactions == null ? void 0 : interactions.find((i) => i.id === editingId);
    if (!orig) return;
    try {
      const encodedTitle = encodePriority(form.title.trim(), form.priority);
      await updateInteraction.mutateAsync({
        id: editingId,
        interaction: {
          ...orig,
          clientId: BigInt(form.clientId),
          type: form.type,
          title: encodedTitle,
          description: form.description.trim(),
          status: form.status,
          amount: form.amount ? BigInt(form.amount) : void 0,
          date: dateInputToNs(form.date),
          updatedAt: BigInt(Date.now()) * 1000000n
        }
      });
      ue.success("PPI entry updated");
      setEditOpen(false);
      setEditingId(null);
    } catch {
      ue.error("Failed to update PPI entry");
    }
  };
  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteInteraction.mutateAsync(deleteId);
      ue.success("Entry deleted");
      setDeleteId(null);
    } catch {
      ue.error("Failed to delete");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { size: 24, className: "text-primary" }),
          "PPI – Sales Pipeline"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Track enquiries, offers, orders, services & payments" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            "data-ocid": "interactions.pdf.button",
            onClick: () => printInteractionsPDF(filtered, getClientName),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { size: 15 }),
              "Export PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "interactions.add_button",
            onClick: () => {
              setForm(emptyForm);
              setAddOpen(true);
            },
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
              "Add PPI Entry"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          size: 16,
          className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "interactions.search_input",
          type: "text",
          placeholder: "Client naam ya title search karein...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "pl-9 w-full"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      ["inquiry", "offer", "order", "service", "payment"].map((t) => {
        const count = countByType[t] ?? 0;
        const isActive = activeTab === t;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(isActive ? "all" : t),
            className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${isActive ? TYPE_ACTIVE[t] ?? "bg-primary text-white" : TYPE_COLORS[t] ?? "bg-muted text-muted-foreground border-border"}`,
            "data-ocid": `interactions.type_filter.${t}.toggle`,
            children: [
              TYPE_LABELS[t] ?? t,
              count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full text-[10px] font-bold ${isActive ? "bg-white/30 text-white" : "bg-white/80"}`,
                  children: count
                }
              )
            ]
          },
          t
        );
      }),
      activeTab !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("all"),
          className: "px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:bg-muted transition-all",
          children: "Clear"
        }
      )
    ] }),
    pipelineStats && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      {
        label: "Enquiries",
        value: pipelineStats.inquiry,
        color: "text-blue-600 bg-blue-50"
      },
      {
        label: "Offers",
        value: pipelineStats.offer,
        color: "text-amber-600 bg-amber-50"
      },
      {
        label: "Orders",
        value: pipelineStats.order,
        color: "text-emerald-600 bg-emerald-50"
      },
      {
        label: "Follow-ups",
        value: pipelineStats.followup,
        color: "text-purple-600 bg-purple-50"
      }
    ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold mt-0.5", children: Number(s.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 })
        }
      )
    ] }) }) }, s.label)) }),
    inactiveIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "interactions.inactivity.card",
        className: "flex items-center gap-2 px-4 py-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-sm font-medium",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0" }),
          inactiveIds.size,
          " PPI entr",
          inactiveIds.size !== 1 ? "ies" : "y",
          " ",
          "inactive for 15+ days — follow-up needed"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsList,
        {
          "data-ocid": "interactions.tab",
          className: "flex-wrap h-auto gap-1",
          children: TYPES.map((t) => {
            const count = countByType[t] ?? 0;
            const label = t === "all" ? "All" : TYPE_LABELS[t] ?? t;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: t,
                className: "capitalize text-xs sm:text-sm",
                children: [
                  label,
                  count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold", children: count })
                ]
              },
              t
            );
          })
        }
      ),
      TYPES.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: tab, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden shadow-xs mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "interactions.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden md:table-cell", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden sm:table-cell", children: "Priority" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden lg:table-cell", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold hidden lg:table-cell", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24 text-right font-semibold", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: Array.from({ length: 8 }).map((__, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, `cell-${j}`)
          )) }, `skeleton-${i}`)
        )) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableCell,
          {
            colSpan: 8,
            "data-ocid": "interactions.empty_state",
            className: "text-center py-12 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GitBranch,
                {
                  size: 36,
                  className: "mx-auto mb-2 opacity-30"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No PPI entries found" })
            ]
          }
        ) }) : filtered.map((int, idx) => {
          const { displayTitle, priority } = decodePriority(
            int.title
          );
          const typeBadgeClass = TYPE_BADGE_CLASSES[int.type] ?? "bg-muted text-muted-foreground border-border";
          const priorityBadgeClass = priority !== "none" ? PRIORITY_BADGE_CLASSES[priority] ?? "" : "";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              "data-ocid": `interactions.item.${idx + 1}`,
              className: "hover:bg-muted/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium max-w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: displayTitle }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: getClientName(int.clientId) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `capitalize text-xs ${typeBadgeClass}`,
                    children: TYPE_LABELS[int.type] ?? int.type
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: int.status }),
                  inactiveIds.has(int.id.toString()) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700 border border-orange-200", children: "Inactive 15+ days" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell", children: priority !== "none" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs capitalize ${priorityBadgeClass}`,
                    children: priority
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-muted-foreground", children: int.amount !== void 0 ? `₹${Number(int.amount).toLocaleString("en-IN")}` : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-muted-foreground text-sm", children: formatDate(int.date) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      "data-ocid": `interactions.edit_button.${idx + 1}`,
                      onClick: () => handleEditOpen(int),
                      className: "h-7 w-7",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      "data-ocid": `interactions.delete_button.${idx + 1}`,
                      onClick: () => setDeleteId(int.id),
                      className: "h-7 w-7 text-destructive hover:text-destructive",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                    }
                  )
                ] }) })
              ]
            },
            int.id.toString()
          );
        }) })
      ] }) }) }, tab))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "interactions.add.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add PPI Entry" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        InteractionForm,
        {
          form,
          setForm,
          clients,
          onSubmit: handleAdd,
          onCancel: () => setAddOpen(false),
          submitting: createInteraction.isPending
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-lg",
        "data-ocid": "interactions.edit.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit PPI Entry" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            InteractionForm,
            {
              form,
              setForm,
              clients,
              onSubmit: handleEdit,
              onCancel: () => {
                setEditOpen(false);
                setEditingId(null);
              },
              submitting: updateInteraction.isPending
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteId !== null,
        onOpenChange: (o) => !o && setDeleteId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "interactions.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete PPI Entry" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "interactions.delete.cancel_button", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialogAction,
              {
                "data-ocid": "interactions.delete.confirm_button",
                onClick: handleDelete,
                className: "bg-destructive hover:bg-destructive/90",
                children: [
                  deleteInteraction.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                  "Delete"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  InteractionsPage as default
};
