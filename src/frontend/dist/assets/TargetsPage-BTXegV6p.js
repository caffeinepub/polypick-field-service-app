import { c as createLucideIcon, ad as useIsAdmin, aO as useUserProfile, al as useMyVisits, V as useAllVisits, af as useMyClaims, ae as useAllClaims, r as reactExports, j as jsxRuntimeExports, b3 as Trophy, B as Button, C as Card, l as CardContent, h as Badge, i as CardHeader, k as CardTitle, L as Label, I as Input, y as ue } from "./index-zYE3ieSM.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-D9sYaUqc.js";
import { P as Progress } from "./progress--pHRkfp9.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DlHiHZj6.js";
import "./index-DZCkCVJa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
function useTargets() {
  const [targets, setTargets] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_targets") ?? "[]");
    } catch {
      return [];
    }
  });
  const save = (next) => {
    setTargets(next);
    localStorage.setItem("polypick_targets", JSON.stringify(next));
  };
  const upsert = (t) => {
    const existing = targets.findIndex(
      (x) => x.staffId === t.staffId && x.month === t.month
    );
    if (existing >= 0) {
      const next = [...targets];
      next[existing] = t;
      save(next);
    } else {
      save([...targets, t]);
    }
  };
  return { targets, upsert };
}
function nsToDate(ns) {
  return new Date(Number(ns / 1000000n));
}
function progressColor(pct) {
  if (pct >= 80) return "[&>div]:bg-green-500";
  if (pct >= 50) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}
function progressBadge(pct) {
  if (pct >= 80) return "bg-green-100 text-green-700";
  if (pct >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}
function TargetsPage() {
  const { data: isAdmin } = useIsAdmin();
  const { data: profile } = useUserProfile();
  const { data: myVisits = [] } = useMyVisits();
  const { data: allVisits = [] } = useAllVisits(!!isAdmin);
  const { data: myClaims = [] } = useMyClaims();
  const { data: allClaims = [] } = useAllClaims(!!isAdmin);
  const { targets, upsert } = useTargets();
  const now = /* @__PURE__ */ new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = now.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [editForm, setEditForm] = reactExports.useState({
    visitsTarget: 20,
    claimsTarget: 10,
    reportsTarget: 25,
    month: monthKey
  });
  const myTarget = targets.find(
    (t) => t.staffId === ((profile == null ? void 0 : profile.name) ?? "") && t.month === monthKey
  ) ?? {
    staffId: (profile == null ? void 0 : profile.name) ?? "me",
    staffName: (profile == null ? void 0 : profile.name) ?? "My Account",
    visitsTarget: 20,
    claimsTarget: 10,
    reportsTarget: 25
  };
  const currentVisits = (isAdmin ? allVisits : myVisits).filter((v) => {
    const d = nsToDate(v.plannedDate);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const currentClaims = (isAdmin ? allClaims : myClaims).filter((c) => {
    const d = nsToDate(c.submittedAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const visitsPct = Math.round(
    Math.min(currentVisits / Math.max(myTarget.visitsTarget, 1) * 100, 100)
  );
  const claimsPct = Math.round(
    Math.min(currentClaims / Math.max(myTarget.claimsTarget, 1) * 100, 100)
  );
  const openEdit = () => {
    setEditForm({
      staffId: (profile == null ? void 0 : profile.name) ?? "me",
      staffName: (profile == null ? void 0 : profile.name) ?? "My Account",
      visitsTarget: myTarget.visitsTarget,
      claimsTarget: myTarget.claimsTarget,
      reportsTarget: myTarget.reportsTarget,
      month: monthKey
    });
    setEditOpen(true);
  };
  const handleSave = () => {
    if (!editForm.staffId) return;
    upsert(editForm);
    ue.success("Target saved!");
    setEditOpen(false);
  };
  const monthTargets = targets.filter((t) => t.month === monthKey);
  const metrics = [
    {
      label: "Visits",
      current: currentVisits,
      target: myTarget.visitsTarget,
      pct: visitsPct,
      icon: "📍"
    },
    {
      label: "TA DA Claims",
      current: currentClaims,
      target: myTarget.claimsTarget,
      pct: claimsPct,
      icon: "🧾"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 md:p-6 space-y-6 animate-fade-in",
      "data-ocid": "targets.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { size: 24, className: "text-primary" }),
              "Targets & Achievement"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
              monthLabel,
              " — Monthly Progress"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: openEdit,
              className: "gap-2 self-start sm:self-auto",
              "data-ocid": "targets.set.primary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 }),
                "Set Targets"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground", children: [
            "Mera Progress — ",
            (profile == null ? void 0 : profile.name) ?? ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: metrics.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: m.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: m.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `${progressBadge(m.pct)} border-0 text-xs`, children: [
                m.pct,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Progress,
              {
                value: m.pct,
                className: `h-3 ${progressColor(m.pct)}`,
                "data-ocid": `targets.${m.label.toLowerCase().replace(" ", "_")}.progress`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                m.current,
                " done"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Target: ",
                m.target
              ] })
            ] }),
            m.pct >= 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 font-semibold mt-1", children: "🎉 Target pura ho gaya!" }),
            m.pct < 50 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 mt-1", children: [
              "⚠️ ",
              m.target - m.current,
              " aur baaki hain"
            ] })
          ] }) }, m.label)) })
        ] }),
        isAdmin && monthTargets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-sm uppercase tracking-wide text-muted-foreground", children: [
            "All Staff Targets — ",
            monthLabel
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Team Overview" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "targets.staff.table", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Staff" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: "Visits Target" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: "Claims Target" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: "Reports Target" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: monthTargets.map((t, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  "data-ocid": `targets.staff.row.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: t.staffName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: t.visitsTarget }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: t.claimsTarget }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: t.reportsTarget })
                  ]
                },
                `${t.staffId}-${t.month}`
              )) })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "targets.set.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 18, className: "text-primary" }),
            "Monthly Target Set Karein"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Staff Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editForm.staffName ?? "",
                  onChange: (e) => setEditForm((p) => ({
                    ...p,
                    staffName: e.target.value,
                    staffId: e.target.value
                  })),
                  placeholder: "Staff ka naam",
                  "data-ocid": "targets.staff_name.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Visits Target" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  value: editForm.visitsTarget ?? "",
                  onChange: (e) => setEditForm((p) => ({
                    ...p,
                    visitsTarget: Number(e.target.value)
                  })),
                  "data-ocid": "targets.visits_target.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "TA DA Claims Target" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  value: editForm.claimsTarget ?? "",
                  onChange: (e) => setEditForm((p) => ({
                    ...p,
                    claimsTarget: Number(e.target.value)
                  })),
                  "data-ocid": "targets.claims_target.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Daily Reports Target" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  value: editForm.reportsTarget ?? "",
                  onChange: (e) => setEditForm((p) => ({
                    ...p,
                    reportsTarget: Number(e.target.value)
                  })),
                  "data-ocid": "targets.reports_target.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setEditOpen(false),
                "data-ocid": "targets.set.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, "data-ocid": "targets.set.save_button", children: "Save" })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  TargetsPage as default
};
