import { r as reactExports, j as jsxRuntimeExports, B as Button, C as Card, i as CardHeader, k as CardTitle, bU as ChartNoAxesColumn, l as CardContent, U as Users, au as CircleCheck, bz as Briefcase, at as Clock, bN as Separator } from "./index-DbjPUQDs.js";
import { P as Printer } from "./printer-BujzTYqY.js";
function ManagementReportPage() {
  const today = /* @__PURE__ */ new Date();
  const [month, setMonth] = reactExports.useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );
  const reportData = reactExports.useMemo(() => {
    const visits = (() => {
      try {
        return JSON.parse(localStorage.getItem("polypick_visits") ?? "[]");
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
    const ppiEntries = (() => {
      try {
        return JSON.parse(localStorage.getItem("polypick_ppi") ?? "[]");
      } catch {
        return [];
      }
    })();
    const claims = (() => {
      try {
        return JSON.parse(localStorage.getItem("polypick_claims") ?? "[]");
      } catch {
        return [];
      }
    })();
    const activityEntries = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("polypick_activity_tracker") ?? "[]"
        );
      } catch {
        return [];
      }
    })();
    const tickets = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("polypick_service_tickets") ?? "[]"
        );
      } catch {
        return [];
      }
    })();
    const inMonth = (dateStr) => {
      if (!dateStr) return false;
      return dateStr.startsWith(month);
    };
    const totalVisits = visits.filter((v) => inMonth(v.date)).length;
    const completedVisits = visits.filter(
      (v) => inMonth(v.date) && v.status === "Completed"
    ).length;
    const newClients = clients.filter((c) => inMonth(c.createdAt)).length;
    const ppiCount = ppiEntries.filter(
      (p) => inMonth(p.createdAt) || inMonth(p.updatedAt)
    ).length;
    const claimsSubmitted = claims.filter((c) => inMonth(c.createdAt)).length;
    const claimsApproved = claims.filter(
      (c) => inMonth(c.createdAt) && c.status === "approved"
    ).length;
    const activityCount = activityEntries.filter((a) => inMonth(a.date)).length;
    const openTickets = tickets.filter(
      (t) => inMonth(t.createdAt) && t.status !== "Closed"
    ).length;
    return {
      totalVisits,
      completedVisits,
      newClients,
      ppiCount,
      claimsSubmitted,
      claimsApproved,
      activityCount,
      openTickets
    };
  }, [month]);
  const [y, m] = month.split("-");
  const monthLabel = new Date(Number(y), Number(m) - 1, 1).toLocaleString(
    "en-IN",
    {
      month: "long",
      year: "numeric"
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 pb-24 max-w-2xl mx-auto space-y-4",
      id: "mgmt-report-print",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: "Management Report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Monthly summary for management" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "mgmt.primary_button",
              size: "sm",
              variant: "outline",
              onClick: () => window.print(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 14, className: "mr-1" }),
                " Print / PDF"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-ocid": "mgmt.input",
              type: "month",
              value: month,
              onChange: (e) => setMonth(e.target.value),
              className: "border border-border rounded-md px-3 py-1.5 text-sm bg-background text-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: monthLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "print:shadow-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 16 }),
            " Monthly Summary — ",
            monthLabel
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18, className: "text-blue-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: reportData.totalVisits }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Visits" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-green-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: reportData.completedVisits }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Completed Visits" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { size: 18, className: "text-purple-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: reportData.newClients }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "New Clients" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 18, className: "text-orange-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: reportData.ppiCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "PPI Entries" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18, className: "text-amber-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: reportData.claimsSubmitted }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Claims Submitted" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-teal-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: reportData.claimsApproved }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Claims Approved" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "print:shadow-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Additional Metrics" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Activity Tracker Entries" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: reportData.activityCount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Open Service Tickets" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: reportData.openTickets })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center print:block hidden", children: [
          "Generated by Polypick Engineers Field Service App —",
          " ",
          (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")
        ] })
      ]
    }
  );
}
export {
  ManagementReportPage as default
};
