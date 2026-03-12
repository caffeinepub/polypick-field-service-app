import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, b4 as Activity, B as Button, C as Card, l as CardContent, W as Search, I as Input, as as CircleCheck, L as Label, q as Select, s as SelectTrigger, v as SelectValue, w as SelectContent, x as SelectItem, y as ue, U as Users, $ as TrendingUp } from "./index-zYE3ieSM.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-D9sYaUqc.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-CqcGXpGX.js";
import { T as Textarea } from "./textarea-CAkbLSug.js";
import { e as exportCSV } from "./exportUtils-DtpCHa8s.js";
import { D as Download } from "./download-BTjaIlUc.js";
import { F as FileSpreadsheet } from "./file-spreadsheet-B5mara69.js";
import { P as Plus } from "./plus-B0va8LMJ.js";
import { T as Trash2 } from "./trash-2-8T3S_jQy.js";
import { S as Send } from "./send-CNmszIZ6.js";
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
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode);
const STAGE_CONFIG = {
  visit: {
    label: "Client Visit",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 })
  },
  inquiry: {
    label: "Inquiry Received",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 })
  },
  offer: {
    label: "Offer Sent",
    color: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 })
  },
  order: {
    label: "Order Received",
    color: "text-green-700 dark:text-green-300",
    bg: "bg-green-100 dark:bg-green-900/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 14 })
  },
  dispatched: {
    label: "Dispatched",
    color: "text-teal-700 dark:text-teal-300",
    bg: "bg-teal-100 dark:bg-teal-900/30",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14 })
  }
};
const STAGE_ORDER = [
  "visit",
  "inquiry",
  "offer",
  "order",
  "dispatched"
];
const EMPTY = {
  client: "",
  date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
  stage: "visit",
  details: "",
  output: "",
  amount: ""
};
function StageBadge({ stage }) {
  const cfg = STAGE_CONFIG[stage];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`,
      children: [
        cfg.icon,
        cfg.label
      ]
    }
  );
}
function ActivityTrackerPage() {
  const [entries, setEntries] = reactExports.useState([]);
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editEntry, setEditEntry] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY);
  const clientRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const saved = localStorage.getItem("polypick_activity_entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);
  function persist(updated) {
    setEntries(updated);
    localStorage.setItem("polypick_activity_entries", JSON.stringify(updated));
  }
  function openAdd() {
    setEditEntry(null);
    setForm(EMPTY);
    setDialogOpen(true);
  }
  function openEdit(entry) {
    setEditEntry(entry);
    setForm({
      client: entry.client,
      date: entry.date,
      stage: entry.stage,
      details: entry.details,
      output: entry.output,
      amount: entry.amount
    });
    setDialogOpen(true);
  }
  function saveEntry() {
    var _a;
    if (!form.client.trim()) {
      ue.error("Client name is required");
      (_a = clientRef.current) == null ? void 0 : _a.focus();
      return;
    }
    if (editEntry) {
      const updated = entries.map(
        (e) => e.id === editEntry.id ? { ...form, id: editEntry.id } : e
      );
      persist(updated);
      ue.success("Entry updated");
    } else {
      const newEntry = { ...form, id: Date.now().toString() };
      persist([newEntry, ...entries]);
      ue.success("Activity entry added");
    }
    setDialogOpen(false);
  }
  function deleteEntry(id) {
    persist(entries.filter((e) => e.id !== id));
    ue.success("Entry deleted");
  }
  const thisMonth = (/* @__PURE__ */ new Date()).getMonth();
  const thisYear = (/* @__PURE__ */ new Date()).getFullYear();
  const monthEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const counts = STAGE_ORDER.reduce(
    (acc, s) => {
      acc[s] = monthEntries.filter((e) => e.stage === s).length;
      return acc;
    },
    {}
  );
  const filtered = entries.filter((e) => {
    const matchStage = filter === "all" || e.stage === filter;
    const matchSearch = e.client.toLowerCase().includes(search.toLowerCase()) || e.details.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });
  function exportPDF() {
    const rows = filtered.map(
      (e) => `<tr><td>${e.client}</td><td>${STAGE_CONFIG[e.stage].label}</td><td>${e.date}</td><td>${e.details}</td><td>${e.output}</td><td>${e.amount ? `₹${e.amount}` : ""}</td></tr>`
    ).join("");
    const html = `<html><head><title>Activity Report</title><style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f4f4f4}</style></head><body><h2>Polypick Activity Report</h2><p>Generated: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}</p><table><thead><tr><th>Client</th><th>Stage</th><th>Date</th><th>Details</th><th>Output</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.print();
    }
  }
  function exportExcelCSV() {
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    exportCSV(
      filtered.map((e) => ({
        Client: e.client,
        Stage: STAGE_CONFIG[e.stage].label,
        Date: e.date,
        Details: e.details,
        Output: e.output,
        Amount: e.amount ? `₹${e.amount}` : ""
      })),
      `Activity_Report_${date}.csv`
    );
    ue.success("CSV exported!");
  }
  const summaryCards = [
    {
      stage: "visit",
      label: "Visits",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16 }),
      color: "text-blue-600"
    },
    {
      stage: "inquiry",
      label: "Inquiries",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16 }),
      color: "text-amber-600"
    },
    {
      stage: "offer",
      label: "Offers",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16 }),
      color: "text-orange-600"
    },
    {
      stage: "order",
      label: "Orders",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 16 }),
      color: "text-green-600"
    },
    {
      stage: "dispatched",
      label: "Dispatched",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16 }),
      color: "text-teal-600"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 pb-24 pt-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 20, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground", children: "Activity Tracker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Visit → Inquiry → Offer → Order → Dispatch" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "activity.export_pdf.button",
            variant: "outline",
            size: "sm",
            onClick: exportPDF,
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
              "PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "activity.export_excel.button",
            variant: "outline",
            size: "sm",
            onClick: exportExcelCSV,
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { size: 14 }),
              "CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "activity.add.primary_button",
            size: "sm",
            onClick: openAdd,
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
              "Add Entry"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3", children: summaryCards.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "cursor-pointer hover:border-primary/40 transition-colors",
        onClick: () => setFilter(s.stage),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1.5 ${s.color}`, children: [
            s.icon,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: s.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: counts[s.stage] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "This month" })
        ] })
      },
      s.stage
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-muted/40 rounded-xl p-3 overflow-x-auto", children: STAGE_ORDER.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 min-w-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === s ? `${STAGE_CONFIG[s].bg} ${STAGE_CONFIG[s].color} ring-2 ring-current` : "bg-background text-muted-foreground hover:bg-muted"}`,
          onClick: () => setFilter(filter === s ? "all" : s),
          children: [
            STAGE_CONFIG[s].icon,
            STAGE_CONFIG[s].label,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 rounded-full bg-current/20 px-1.5 py-0.5 text-[10px]", children: entries.filter((e) => e.stage === s).length })
          ]
        }
      ),
      i < STAGE_ORDER.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-base", children: "→" })
    ] }, s)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            size: 14,
            className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "activity.search_input",
            placeholder: "Search by client or details...",
            className: "pl-8",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Tabs,
        {
          value: filter,
          onValueChange: (v) => setFilter(v),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-9", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                "data-ocid": "activity.all.tab",
                value: "all",
                className: "text-xs",
                children: "All"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                "data-ocid": "activity.visit.tab",
                value: "visit",
                className: "text-xs",
                children: "Visit"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                "data-ocid": "activity.inquiry.tab",
                value: "inquiry",
                className: "text-xs",
                children: "Inquiry"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                "data-ocid": "activity.offer.tab",
                value: "offer",
                className: "text-xs",
                children: "Offer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                "data-ocid": "activity.order.tab",
                value: "order",
                className: "text-xs",
                children: "Order"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                "data-ocid": "activity.dispatched.tab",
                value: "dispatched",
                className: "text-xs",
                children: "Dispatched"
              }
            )
          ] })
        }
      )
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "activity.empty_state",
        className: "flex flex-col items-center justify-center py-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 40, className: "text-muted-foreground/30 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No activity entries found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground/60 mt-1", children: "Add your first client visit or inquiry" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "activity.empty.primary_button",
              className: "mt-4 gap-1.5",
              onClick: openAdd,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                " Add Entry"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-[1fr_140px_100px_1fr_1fr_80px_80px] gap-3 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Output" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Actions" })
      ] }),
      filtered.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          "data-ocid": `activity.item.${idx + 1}`,
          className: "hover:border-primary/30 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: entry.client }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: entry.date })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StageBadge, { stage: entry.stage })
              ] }),
              entry.details && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: entry.details }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                  entry.output && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Output:" }),
                    " ",
                    entry.output
                  ] }),
                  entry.amount && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-green-600", children: [
                    "₹",
                    entry.amount
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": `activity.edit_button.${idx + 1}`,
                      variant: "ghost",
                      size: "sm",
                      onClick: () => openEdit(entry),
                      className: "h-7 px-2 text-xs",
                      children: "Edit"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": `activity.delete_button.${idx + 1}`,
                      variant: "ghost",
                      size: "sm",
                      onClick: () => deleteEntry(entry.id),
                      className: "h-7 px-2 text-destructive hover:text-destructive",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-[1fr_140px_100px_1fr_1fr_80px_80px] gap-3 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: entry.client }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StageBadge, { stage: entry.stage }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: entry.date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground truncate", children: entry.details || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm truncate", children: entry.output || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-green-600", children: entry.amount ? `₹${entry.amount}` : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `activity.edit_button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => openEdit(entry),
                    className: "h-7 px-2 text-xs",
                    children: "Edit"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `activity.delete_button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => deleteEntry(entry.id),
                    className: "h-7 px-1 text-destructive hover:text-destructive",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                  }
                )
              ] })
            ] })
          ] })
        },
        entry.id
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-lg max-h-[90vh] overflow-y-auto",
        "data-ocid": "activity.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 18, className: "text-primary" }),
            editEntry ? "Edit Activity" : "Add Activity Entry"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-2 overflow-x-auto pb-1", children: STAGE_ORDER.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 min-w-fit", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setForm((f) => ({ ...f, stage: s })),
                className: `flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-all ${form.stage === s ? `${STAGE_CONFIG[s].bg} ${STAGE_CONFIG[s].color} ring-1 ring-current` : "text-muted-foreground hover:text-foreground"}`,
                children: [
                  STAGE_ORDER.indexOf(form.stage) > i ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11, className: "text-green-500" }) : STAGE_CONFIG[s].icon,
                  STAGE_CONFIG[s].label
                ]
              }
            ),
            i < STAGE_ORDER.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "›" })
          ] }, s)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "act-client", children: "Client Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "act-client",
                  ref: clientRef,
                  "data-ocid": "activity.client.input",
                  placeholder: "e.g. JSL Jajpur, Rashmi Metallic",
                  value: form.client,
                  onChange: (e) => setForm((f) => ({ ...f, client: e.target.value }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "act-date", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "act-date",
                    "data-ocid": "activity.date.input",
                    type: "date",
                    value: form.date,
                    onChange: (e) => setForm((f) => ({ ...f, date: e.target.value }))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "act-stage", children: "Stage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: form.stage,
                    onValueChange: (v) => setForm((f) => ({ ...f, stage: v })),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          id: "act-stage",
                          "data-ocid": "activity.stage.select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STAGE_ORDER.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: `flex items-center gap-1.5 ${STAGE_CONFIG[s].color}`,
                          children: [
                            STAGE_CONFIG[s].icon,
                            STAGE_CONFIG[s].label
                          ]
                        }
                      ) }, s)) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "act-details", children: "Details / Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "act-details",
                  "data-ocid": "activity.details.textarea",
                  placeholder: "What was discussed? Any key points...",
                  value: form.details,
                  onChange: (e) => setForm((f) => ({ ...f, details: e.target.value })),
                  rows: 3
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "act-output", children: "Output / Result" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "act-output",
                  "data-ocid": "activity.output.input",
                  placeholder: "e.g. Offer accepted, Follow-up scheduled",
                  value: form.output,
                  onChange: (e) => setForm((f) => ({ ...f, output: e.target.value }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "act-amount", children: "Amount (₹, optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "act-amount",
                  "data-ocid": "activity.amount.input",
                  type: "number",
                  placeholder: "0",
                  value: form.amount,
                  onChange: (e) => setForm((f) => ({ ...f, amount: e.target.value }))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "activity.dialog.cancel_button",
                  variant: "outline",
                  className: "flex-1",
                  onClick: () => setDialogOpen(false),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "activity.dialog.save_button",
                  className: "flex-1",
                  onClick: saveEntry,
                  children: editEntry ? "Update Entry" : "Add Entry"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
export {
  ActivityTrackerPage as default
};
