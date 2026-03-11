import { c as createLucideIcon, b as useInternetIdentity, aI as useUserProfile, A as useClients, a5 as useIsAdmin, r as reactExports, j as jsxRuntimeExports, F as FileText, C as Card, i as CardHeader, k as CardTitle, l as CardContent, L as Label, I as Input, S as Skeleton, n as User, aR as ChevronUp, aS as ChevronDown, h as Badge, B as Button, p as LoaderCircle, y as ue } from "./index-DmVPSM7c.js";
import { C as Checkbox, a as ClipboardList } from "./checkbox-Dkg0Iqoc.js";
import { T as Textarea } from "./textarea-DOYIpxQo.js";
import { F as FileDown } from "./file-down-DfTYvJqp.js";
import "./index-DKpqtmrc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const STORAGE_KEY = "daily_reports";
function loadReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function formatDisplayDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function printDailyReportsPDF(reports, clientMap) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const sections = reports.map((r) => {
    var _a;
    const linkedNames = r.linkedClientIds.map((id) => clientMap.get(id)).filter(Boolean).join(", ");
    const reportDate = new Date(r.date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    return `
      <div class="report">
        <div class="report-header">
          <strong>${reportDate}</strong> &nbsp;–&nbsp; ${r.staffName}
          ${linkedNames ? `<span class="clients"> | Clients: ${linkedNames}</span>` : ""}
        </div>
        <div class="report-body">${r.reportText.replace(/\n/g, "<br>")}</div>
        ${((_a = r.pendingActions) == null ? void 0 : _a.trim()) ? `<div class="pending"><strong>Pending Actions:</strong><br>${r.pendingActions.replace(/\n/g, "<br>")}</div>` : ""}
      </div>`;
  }).join("");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Daily Field Reports – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 780px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        .report { margin-bottom: 18px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
        .report-header { background: #f5f5f5; padding: 8px 12px; font-size: 12px; border-bottom: 1px solid #ddd; }
        .clients { color: #555; }
        .report-body { padding: 10px 12px; font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
        .pending { padding: 8px 12px; background: #fffbeb; border-top: 1px solid #fde68a; font-size: 11px; color: #92400e; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>Daily Field Reports</p>
        <p>Generated: ${date} &nbsp;|&nbsp; Total Reports: ${reports.length}</p>
      </div>
      ${sections}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
function ReportCard({
  report,
  clientMap,
  index
}) {
  var _a;
  const [expanded, setExpanded] = reactExports.useState(false);
  const linkedNames = report.linkedClientIds.map((id) => clientMap.get(id)).filter(Boolean);
  const truncated = report.reportText.length > 200 && !expanded;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      "data-ocid": `daily_report.item.${index + 1}`,
      className: "border-border/60 hover:border-border transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: formatDisplayDate(report.date) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 12, className: "text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: report.staffName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground/50 ml-1", children: [
                "·",
                " ",
                new Date(report.submittedAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ] })
            ] })
          ] }),
          linkedNames.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 max-w-xs", children: [
            linkedNames.slice(0, 3).map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-[10px] px-1.5 py-0",
                children: name
              },
              name
            )),
            linkedNames.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px] px-1.5 py-0", children: [
              "+",
              linkedNames.length - 3,
              " more"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap ${truncated ? "line-clamp-3" : ""}`,
                children: report.reportText
              }
            ),
            report.reportText.length > 200 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `daily_report.toggle.${index + 1}`,
                onClick: () => setExpanded(!expanded),
                className: "mt-1 text-xs text-primary flex items-center gap-0.5 hover:underline",
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 12 }),
                  " Show less"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 12 }),
                  " Read more"
                ] })
              }
            )
          ] }),
          ((_a = report.pendingActions) == null ? void 0 : _a.trim()) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-amber-50 border border-amber-200 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1", children: "Pending Actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-800 whitespace-pre-wrap leading-relaxed", children: report.pendingActions })
          ] })
        ] })
      ]
    }
  );
}
function DailyReportPage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: isAdmin } = useIsAdmin();
  const principalId = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? "";
  const [date, setDate] = reactExports.useState(todayStr());
  const [reportText, setReportText] = reactExports.useState("");
  const [pendingActions, setPendingActions] = reactExports.useState("");
  const [linkedClientIds, setLinkedClientIds] = reactExports.useState([]);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [showClientSelect, setShowClientSelect] = reactExports.useState(false);
  const [reports, setReports] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setReports(loadReports());
  }, []);
  const staffName = (profile == null ? void 0 : profile.name) ?? "Staff";
  const clientMap = new Map(
    (clients ?? []).map((c) => [c.id.toString(), `${c.name} (${c.company})`])
  );
  const visibleReports = isAdmin ? reports : reports.filter((r) => r.principalId === principalId);
  const grouped = visibleReports.reduce(
    (acc, r) => {
      if (!acc[r.date]) acc[r.date] = [];
      acc[r.date].push(r);
      return acc;
    },
    {}
  );
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const toggleClient = (clientId) => {
    setLinkedClientIds(
      (prev) => prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) {
      ue.error("Report text is required");
      return;
    }
    if (!principalId) {
      ue.error("Please log in first");
      return;
    }
    setIsSubmitting(true);
    try {
      const newReport = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date,
        staffName,
        principalId,
        reportText: reportText.trim(),
        linkedClientIds,
        pendingActions: pendingActions.trim(),
        submittedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const updated = [newReport, ...loadReports()];
      saveReports(updated);
      setReports(updated);
      setReportText("");
      setPendingActions("");
      setLinkedClientIds([]);
      setDate(todayStr());
      setShowClientSelect(false);
      ue.success("Daily report submitted!");
    } catch {
      ue.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 24, className: "text-primary" }),
        "Daily Report"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Submit your daily field report and track pending actions" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/60 sticky top-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16, className: "text-primary" }),
          "New Report"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            className: "space-y-4",
            "data-ocid": "daily_report.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "report-date", children: "Report Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "report-date",
                    type: "date",
                    "data-ocid": "daily_report.date.input",
                    value: date,
                    onChange: (e) => setDate(e.target.value),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Staff Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/40 text-sm text-muted-foreground", children: profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14, className: "flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: staffName })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "report-text", children: [
                  "Daily Report",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive text-xs", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "report-text",
                    "data-ocid": "daily_report.textarea",
                    value: reportText,
                    onChange: (e) => setReportText(e.target.value),
                    placeholder: "Write your daily field report here... List client visits, discussions, follow-ups, pending actions, etc.",
                    rows: 7,
                    className: "resize-none text-sm",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "daily_report.clients.toggle",
                    onClick: () => setShowClientSelect((v) => !v),
                    className: "flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors",
                    children: [
                      showClientSelect ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }),
                      "Linked Clients",
                      linkedClientIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 text-[10px] h-4 px-1.5", children: linkedClientIds.length })
                    ]
                  }
                ),
                showClientSelect && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border max-h-44 overflow-y-auto p-2 space-y-1 bg-background", children: clientsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-1", children: Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }, i)
                )) }) : (clients ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground px-2 py-1", children: "No clients found" }) : (clients ?? []).map((client) => {
                  const cid = client.id.toString();
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      htmlFor: `client-cb-${cid}`,
                      className: "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/50 transition-colors",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Checkbox,
                          {
                            id: `client-cb-${cid}`,
                            "data-ocid": "daily_report.client.checkbox",
                            checked: linkedClientIds.includes(cid),
                            onCheckedChange: () => toggleClient(cid),
                            className: "h-3.5 w-3.5"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs leading-tight", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: client.name }),
                          client.company && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                            " ",
                            "· ",
                            client.company
                          ] })
                        ] })
                      ]
                    },
                    cid
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pending-actions", children: "Pending Actions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "pending-actions",
                    "data-ocid": "daily_report.pending_actions.textarea",
                    value: pendingActions,
                    onChange: (e) => setPendingActions(e.target.value),
                    placeholder: "List pending actions, follow-ups needed...",
                    rows: 3,
                    className: "resize-none text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  "data-ocid": "daily_report.submit_button",
                  disabled: isSubmitting || !reportText.trim(),
                  className: "w-full gap-2",
                  children: [
                    isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 15 }),
                    isSubmitting ? "Submitting..." : "Submit Report"
                  ]
                }
              )
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-semibold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 18, className: "text-primary" }),
            isAdmin ? "All Reports" : "My Reports"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            visibleReports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                "data-ocid": "daily_report.pdf.button",
                onClick: () => printDailyReportsPDF(visibleReports, clientMap),
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { size: 14 }),
                  "Export PDF"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
              visibleReports.length,
              " total"
            ] })
          ] })
        ] }),
        visibleReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": "daily_report.empty_state",
            className: "border-dashed border-border/60",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-14 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 36, className: "text-muted-foreground/30 mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No reports yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: "Submit your first daily report using the form" })
            ] })
          }
        ) : sortedDates.map((dateKey) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2", children: formatDisplayDate(dateKey) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border/40" })
          ] }),
          grouped[dateKey].map((report, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReportCard,
            {
              report,
              clientMap,
              index: i
            },
            report.id
          ))
        ] }, dateKey))
      ] })
    ] })
  ] });
}
export {
  DailyReportPage as default
};
