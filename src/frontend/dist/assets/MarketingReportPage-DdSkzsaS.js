import { c as createLucideIcon, r as reactExports, a5 as useIsAdmin, ad as useAllVisits, ae as useMyVisits, A as useClients, j as jsxRuntimeExports, T as TrendingUp, B as Button, ai as CalendarCheck, U as Users, ak as CircleCheck, aH as Clock, C as Card, i as CardHeader, k as CardTitle, l as CardContent, S as Skeleton, o as StatusBadge, m as formatDate } from "./index-DmVPSM7c.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CAq1fw9T.js";
import { p as parseGPS, g as gpsToMapsURL } from "./locationUtils-C2fIUMVr.js";
import { P as Printer } from "./printer-DCW7iBN1.js";
import { C as ChevronRight } from "./chevron-right-Df79U7qh.js";
import { M as MapPin } from "./map-pin-B8F75Z7T.js";
import { B as Building2 } from "./building-2-DsXurobZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function SummaryCard({
  title,
  value,
  icon,
  color,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: title }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-14 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground mt-0.5", children: value })
    ] })
  ] }) }) });
}
function MarketingReportPage() {
  const now = /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = reactExports.useState(now.getFullYear());
  const [viewMonth, setViewMonth] = reactExports.useState(now.getMonth());
  const { data: isAdmin } = useIsAdmin();
  const { data: allVisits, isLoading: allLoading } = useAllVisits();
  const { data: myVisits, isLoading: myLoading } = useMyVisits();
  const { data: clients } = useClients();
  const visits = isAdmin ? allVisits ?? [] : myVisits ?? [];
  const isLoading = isAdmin ? allLoading : myLoading;
  const getClientName = (id) => {
    var _a;
    return ((_a = clients == null ? void 0 : clients.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? `Client #${id}`;
  };
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };
  const isCurrentMonth = viewMonth === now.getMonth() && viewYear === now.getFullYear();
  const monthVisits = reactExports.useMemo(() => {
    return visits.filter((v) => {
      const d = new Date(Number(v.plannedDate / 1000000n));
      return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
    });
  }, [visits, viewMonth, viewYear]);
  const totalVisits = monthVisits.length;
  const uniqueClients = new Set(monthVisits.map((v) => v.clientId.toString())).size;
  const completedVisits = monthVisits.filter(
    (v) => v.status === "completed"
  ).length;
  const plannedVisits = monthVisits.filter(
    (v) => v.status === "planned"
  ).length;
  const visitsByDate = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const v of monthVisits) {
      const d = new Date(Number(v.plannedDate / 1000000n));
      const key = d.toISOString().slice(0, 10);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, v]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [monthVisits]);
  const clientSummary = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const v of monthVisits) {
      const key = v.clientId.toString();
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          clientId: v.clientId,
          count: 1,
          lastVisit: v.plannedDate,
          completed: v.status === "completed" ? 1 : 0,
          planned: v.status === "planned" ? 1 : 0
        });
      } else {
        existing.count += 1;
        if (v.plannedDate > existing.lastVisit)
          existing.lastVisit = v.plannedDate;
        if (v.status === "completed") existing.completed += 1;
        if (v.status === "planned") existing.planned += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [monthVisits]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24, className: "text-primary" }),
          "Marketing Monthly Report"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: isAdmin ? "All staff field visit activity report" : "Your field visit activity report" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-2 self-start",
          onClick: () => window.print(),
          "data-ocid": "marketing.print.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14 }),
            "Print Report"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/30 border border-border rounded-lg px-4 py-3 self-start w-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "marketing.prev_month.button",
          onClick: prevMonth,
          className: "h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center min-w-[140px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-semibold text-foreground", children: [
          MONTH_NAMES[viewMonth],
          " ",
          viewYear
        ] }),
        isCurrentMonth && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-primary font-medium", children: "Current Month" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "marketing.next_month.button",
          onClick: nextMonth,
          className: "h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Total Visits",
          value: totalVisits,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { size: 18, className: "text-blue-700" }),
          color: "bg-blue-50",
          loading: isLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Unique Clients",
          value: uniqueClients,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18, className: "text-purple-700" }),
          color: "bg-purple-50",
          loading: isLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Completed",
          value: completedVisits,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-emerald-700" }),
          color: "bg-emerald-50",
          loading: isLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Planned",
          value: plannedVisits,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18, className: "text-amber-700" }),
          color: "bg-amber-50",
          loading: isLoading
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { size: 16, className: "text-primary" }),
        "Daily Visit Log"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({ length: 3 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, `sk-${i}`)
      )) }) : visitsByDate.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "marketing.daily_log.empty_state",
          className: "text-center py-10 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { size: 32, className: "mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No visits recorded this month" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: visitsByDate.map(([dateKey, dayVisits]) => {
        const dateDisplay = new Date(dateKey).toLocaleDateString(
          "en-IN",
          {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
          }
        );
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full", children: dateDisplay }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              dayVisits.length,
              " visit",
              dayVisits.length !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-xs h-8", children: "Client" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-xs h-8 hidden md:table-cell", children: "Purpose" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-xs h-8", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-xs h-8 w-16", children: "GPS" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: dayVisits.map((v, idx) => {
              const gps = parseGPS(v.completionNotes || "") || parseGPS(v.purpose || "");
              const purposeClean = (v.purpose || "—").replace(
                /\[GPS:[^\]]+\]\s*/,
                ""
              );
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  "data-ocid": `marketing.visit.item.${idx + 1}`,
                  className: "hover:bg-muted/10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium py-2", children: getClientName(v.clientId) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-xs text-muted-foreground py-2 max-w-[200px] truncate", children: purposeClean }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: v.status }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: gps ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: gpsToMapsURL(gps.lat, gps.lng),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-primary hover:text-primary/70 transition-colors flex items-center gap-0.5 text-xs",
                        title: `${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
                          "Map"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) })
                  ]
                },
                v.id.toString()
              );
            }) })
          ] }) })
        ] }, dateKey);
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16, className: "text-primary" }),
        "Client Visit Summary"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: clientSummary.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "marketing.client_summary.empty_state",
          className: "text-center py-10 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 28, className: "mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No client visits this month" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "marketing.client_summary.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Client Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-center", children: "Total Visits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-center hidden sm:table-cell", children: "Completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-center hidden sm:table-cell", children: "Planned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-right", children: "Last Visit" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: clientSummary.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `marketing.client.item.${idx + 1}`,
            className: "hover:bg-muted/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: getClientName(row.clientId) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold", children: row.count }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-medium text-sm", children: row.completed }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 font-medium text-sm", children: row.planned }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-muted-foreground text-sm", children: formatDate(row.lastVisit) })
            ]
          },
          row.clientId.toString()
        )) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14 }),
        "Use the Print button to export this report as PDF or paper copy."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "gap-1.5 text-xs",
          onClick: () => window.print(),
          "data-ocid": "marketing.print_bottom.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 12 }),
            "Print"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "pt-4 border-t border-border print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with ❤️ using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "underline hover:text-foreground transition-colors",
          children: "caffeine.ai"
        }
      )
    ] }) })
  ] });
}
export {
  MarketingReportPage as default
};
