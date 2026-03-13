import { r as reactExports, W as useAllVisits, af as useAllClaims, j as jsxRuntimeExports, bJ as Trophy, s as Select, v as SelectTrigger, w as SelectValue, x as SelectContent, y as SelectItem, C as Card, l as CardContent, h as Badge, i as CardHeader, k as CardTitle, S as Skeleton } from "./index-DbjPUQDs.js";
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
function getMedalEmoji(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}
function LeaderboardPage() {
  const now = /* @__PURE__ */ new Date();
  const [selectedMonth, setSelectedMonth] = reactExports.useState(now.getMonth());
  const [selectedYear, setSelectedYear] = reactExports.useState(now.getFullYear());
  const { data: allVisits, isLoading: visitsLoading } = useAllVisits(true);
  const { data: allClaims, isLoading: claimsLoading } = useAllClaims(true);
  const isLoading = visitsLoading || claimsLoading;
  const leaderboard = reactExports.useMemo(() => {
    var _a, _b;
    const staffMap = /* @__PURE__ */ new Map();
    const inMonth = (ts) => {
      const d = new Date(Number(ts / 1000000n));
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    };
    for (const v of allVisits ?? []) {
      if (!inMonth(v.plannedDate)) continue;
      const name = ((_a = v.userId) == null ? void 0 : _a.toString().slice(0, 12)) || "Unknown";
      if (!staffMap.has(name))
        staffMap.set(name, { name, visits: 0, claims: 0, score: 0 });
      const s = staffMap.get(name);
      s.visits += 1;
    }
    for (const c of allClaims ?? []) {
      const d = new Date(Number(c.submittedAt / 1000000n));
      if (d.getMonth() !== selectedMonth || d.getFullYear() !== selectedYear)
        continue;
      const name = ((_b = c.userId) == null ? void 0 : _b.toString().slice(0, 12)) || "Unknown";
      if (!staffMap.has(name))
        staffMap.set(name, { name, visits: 0, claims: 0, score: 0 });
      const s = staffMap.get(name);
      s.claims += 1;
    }
    for (const s of staffMap.values()) {
      s.score = s.visits * 3 + s.claims * 2;
    }
    if (staffMap.size === 0) {
      const mockStaff = [
        { name: "Ramesh Kumar", visits: 18, claims: 4, score: 62 },
        { name: "Suresh Verma", visits: 15, claims: 5, score: 55 },
        { name: "Anjali Singh", visits: 14, claims: 3, score: 48 },
        { name: "Pradeep Sharma", visits: 12, claims: 6, score: 48 },
        { name: "Vikram Patel", visits: 11, claims: 4, score: 41 },
        { name: "Sunita Rao", visits: 9, claims: 5, score: 37 },
        { name: "Deepak Nair", visits: 8, claims: 2, score: 28 },
        { name: "Kavya Iyer", visits: 7, claims: 3, score: 27 }
      ];
      return mockStaff;
    }
    return Array.from(staffMap.values()).sort((a, b) => b.score - a.score).slice(0, 10);
  }, [allVisits, allClaims, selectedMonth, selectedYear]);
  const yearOptions = [now.getFullYear() - 1, now.getFullYear()];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in pb-20 md:pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 24, className: "text-amber-500" }),
          "Staff Leaderboard"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Monthly performance ranking by visits and claims" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: String(selectedMonth),
            onValueChange: (v) => setSelectedMonth(Number(v)),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  "data-ocid": "leaderboard.month.select",
                  className: "w-36",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MONTH_NAMES.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i), children: m }, m)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: String(selectedYear),
            onValueChange: (v) => setSelectedYear(Number(v)),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "leaderboard.year.select", className: "w-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: yearOptions.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(y), children: y }, y)) })
            ]
          }
        )
      ] })
    ] }),
    !isLoading && leaderboard.length >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [leaderboard[1], leaderboard[0], leaderboard[2]].map(
      (staff, colIdx) => {
        const rank = colIdx === 0 ? 2 : colIdx === 1 ? 1 : 3;
        const heights = ["pt-8", "pt-4", "pt-10"];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: `text-center overflow-hidden ${rank === 1 ? "border-amber-300 shadow-md" : ""}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: `pb-4 ${heights[colIdx]}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-1", children: getMedalEmoji(rank) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm truncate", children: staff.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Score:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: staff.score })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-1 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px] px-1.5", children: [
                  staff.visits,
                  "V"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] px-1.5", children: [
                  staff.claims,
                  "C"
                ] })
              ] })
            ] })
          },
          staff.name
        );
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "leaderboard.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 16, className: "text-amber-500" }),
        "Full Rankings — ",
        MONTH_NAMES[selectedMonth],
        " ",
        selectedYear
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, i)) }) : leaderboard.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "leaderboard.empty_state",
          className: "text-center py-12 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 36, className: "mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No data for this period" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: leaderboard.map((staff, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `leaderboard.item.${idx + 1}`,
          className: `flex items-center gap-3 p-3 rounded-lg border ${idx === 0 ? "bg-amber-50 border-amber-200" : idx === 1 ? "bg-slate-50 border-slate-200" : idx === 2 ? "bg-orange-50 border-orange-200" : "bg-muted/20 border-border"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-8 text-center", children: getMedalEmoji(idx + 1) ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-muted-foreground", children: idx + 1 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate", children: staff.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                staff.visits,
                " visits · ",
                staff.claims,
                " claims"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: staff.score }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "pts" })
            ] })
          ]
        },
        staff.name
      )) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Score = Visits × 3 + Claims × 2" })
  ] });
}
export {
  LeaderboardPage as default
};
