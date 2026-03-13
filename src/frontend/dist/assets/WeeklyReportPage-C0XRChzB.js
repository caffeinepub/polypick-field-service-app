import { r as reactExports, j as jsxRuntimeExports, bP as FileChartColumn, B as Button, C as Card, l as CardContent, i as CardHeader, k as CardTitle, h as Badge } from "./index-DbjPUQDs.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CpdBFqUb.js";
import { D as Download } from "./download-CPqjANUi.js";
import { C as ChevronLeft } from "./chevron-left-BAqx3c2h.js";
import { C as ChevronRight } from "./chevron-right-DkkFnIsx.js";
function getWeekStart(offset = 0) {
  const d = /* @__PURE__ */ new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + 1 + offset * 7;
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}
function getDaysOfWeek(weekStart) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatWeekLabel(start) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const opts = { day: "numeric", month: "short" };
  return `${start.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString("en-IN", { ...opts, year: "numeric" })}`;
}
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function WeeklyReportPage() {
  const [weekOffset, setWeekOffset] = reactExports.useState(0);
  const weekStart = getWeekStart(weekOffset);
  const days = getDaysOfWeek(weekStart);
  const visits = (() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_visits") ?? "[]");
    } catch {
      return [];
    }
  })();
  const interactions = (() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_interactions") ?? "[]");
    } catch {
      return [];
    }
  })();
  const tadaClaims = (() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_tada_claims") ?? "[]");
    } catch {
      return [];
    }
  })();
  const clients = (() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_clients") ?? "[]");
    } catch {
      return [];
    }
  })();
  const activityEntries = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("polypick_activity_entries") ?? "[]"
      );
    } catch {
      return [];
    }
  })();
  function countInWeek(items, day) {
    return items.filter((item) => {
      const raw = item.date ?? item.createdAt ?? "";
      if (!raw) return false;
      const d = new Date(raw);
      if (day) return isSameDay(d, day);
      return d >= weekStart && d < new Date(weekStart.getTime() + 7 * 864e5);
    }).length;
  }
  const totalVisits = countInWeek(visits);
  const totalInteractions = countInWeek(interactions);
  const totalTada = countInWeek(tadaClaims);
  const totalClients = clients.length;
  const totalActivity = countInWeek(activityEntries);
  const summaryCards = [
    { label: "Visits This Week", value: totalVisits, color: "text-blue-600" },
    {
      label: "PPI Entries",
      value: totalInteractions,
      color: "text-indigo-600"
    },
    { label: "TA DA Claims", value: totalTada, color: "text-amber-600" },
    { label: "Total Clients", value: totalClients, color: "text-green-600" },
    {
      label: "Activity Entries",
      value: totalActivity,
      color: "text-purple-600"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumn, { size: 20, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Weekly Report" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: formatWeekLabel(weekStart) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => window.print(),
          "data-ocid": "weekly_report.download.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14, className: "mr-1.5" }),
            "PDF"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          className: "h-8 w-8",
          onClick: () => setWeekOffset((o) => o - 1),
          "data-ocid": "weekly_report.pagination_prev",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium flex-1 text-center", children: weekOffset === 0 ? "This Week" : weekOffset === -1 ? "Last Week" : formatWeekLabel(weekStart) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          className: "h-8 w-8",
          onClick: () => setWeekOffset((o) => Math.min(o + 1, 0)),
          disabled: weekOffset === 0,
          "data-ocid": "weekly_report.pagination_next",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: summaryCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-4 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: card.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `text-2xl font-bold font-display mt-1 ${card.color}`,
          children: card.value
        }
      )
    ] }) }, card.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Daily Breakdown" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Day" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Visits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "PPI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Activity" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: days.map((day, i) => {
          const dayVisits = countInWeek(visits, day);
          const dayPpi = countInWeek(interactions, day);
          const dayActivity = countInWeek(activityEntries, day);
          const isToday = isSameDay(day, /* @__PURE__ */ new Date());
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: isToday ? "bg-primary/5" : "",
              "data-ocid": `weekly_report.row.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: DAY_LABELS[i] }),
                  isToday && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "ml-2 text-[10px] h-4",
                      children: "Today"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs text-muted-foreground", children: day.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short"
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: dayVisits > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: dayVisits }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: dayPpi > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: dayPpi }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: dayActivity > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: dayActivity }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "—" }) })
              ]
            },
            DAY_LABELS[i]
          );
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-muted-foreground", children: [
      "Report generated: ",
      (/* @__PURE__ */ new Date()).toLocaleString("en-IN")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media print {
          body * { visibility: hidden; }
          .weekly-report-print, .weekly-report-print * { visibility: visible; }
          .weekly-report-print { position: absolute; top: 0; left: 0; width: 100%; }
        }
      ` })
  ] });
}
export {
  WeeklyReportPage as default
};
