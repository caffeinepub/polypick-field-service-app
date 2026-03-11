import { c as createLucideIcon, a as useNavigate, a5 as useIsAdmin, au as useVisitLogsCountPerStaff, at as useClaimsSummaryPerStaff, aw as useAssignRole, r as reactExports, j as jsxRuntimeExports, ax as UserCog, B as Button, S as Skeleton, n as User, h as Badge, ay as Shield, L as Label, I as Input, q as Select, s as SelectTrigger, v as SelectValue, w as SelectContent, x as SelectItem, p as LoaderCircle, az as Principal, y as ue } from "./index-DmVPSM7c.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BLjkFx7-.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CAq1fw9T.js";
import { U as UserRole } from "./backend.d-Ws4C8wFG.js";
import "./index-DKpqtmrc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function StaffPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: visitCounts, isLoading: visitsLoading } = useVisitLogsCountPerStaff();
  const { data: claimsSummary, isLoading: claimsLoading } = useClaimsSummaryPerStaff();
  const assignRole = useAssignRole();
  const [assignOpen, setAssignOpen] = reactExports.useState(false);
  const [principalInput, setPrincipalInput] = reactExports.useState("");
  const [roleInput, setRoleInput] = reactExports.useState(UserRole.user);
  if (!adminLoading && !isAdmin) {
    navigate({ to: "/" });
    return null;
  }
  const staffMap = {};
  for (const [principal, count] of visitCounts ?? []) {
    const key = principal.toString();
    if (!staffMap[key]) {
      staffMap[key] = {
        principal: key,
        visitCount: 0,
        claimCount: 0,
        approvedAmount: 0
      };
    }
    staffMap[key].visitCount = Number(count);
  }
  for (const [principal, summary] of claimsSummary ?? []) {
    const key = principal.toString();
    if (!staffMap[key]) {
      staffMap[key] = {
        principal: key,
        visitCount: 0,
        claimCount: 0,
        approvedAmount: 0
      };
    }
    staffMap[key].claimCount = Number(summary.totalSubmitted);
    staffMap[key].approvedAmount = Number(summary.totalApprovedAmount);
  }
  const staffList = Object.values(staffMap);
  const isLoading = visitsLoading || claimsLoading;
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!principalInput.trim()) return;
    try {
      const principal = Principal.fromText(principalInput.trim());
      await assignRole.mutateAsync({ user: principal, role: roleInput });
      ue.success(`Role "${roleInput}" assigned successfully`);
      setPrincipalInput("");
      setRoleInput(UserRole.user);
      setAssignOpen(false);
    } catch {
      ue.error("Failed to assign role. Check the principal ID.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { size: 24, className: "text-primary" }),
          "Staff Management"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "View staff activity and manage roles" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "staff.open_modal_button",
          onClick: () => setAssignOpen(true),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 16 }),
            "Assign Role"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "staff.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold", children: "Principal ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-center", children: "Visits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-center", children: "Claims" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-right", children: "Approved (₹)" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: Array.from({ length: 5 }).map((__, j) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, `cell-${j}`)
        )) }, `skeleton-${i}`)
      )) : staffList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableCell,
        {
          colSpan: 5,
          "data-ocid": "staff.empty_state",
          className: "text-center py-12 text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { size: 36, className: "mx-auto mb-2 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No staff activity recorded yet" })
          ]
        }
      ) }) : staffList.map((staff, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          "data-ocid": `staff.item.${idx + 1}`,
          className: "hover:bg-muted/20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: idx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                staff.principal.slice(0, 20),
                "…"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: staff.visitCount }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: staff.claimCount }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-medium text-emerald-700", children: [
              "₹",
              staff.approvedAmount.toLocaleString("en-IN")
            ] })
          ]
        },
        staff.principal
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: assignOpen, onOpenChange: setAssignOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "staff.assign.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 18, className: "text-primary" }),
        "Assign User Role"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAssign, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "User Principal ID *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "staff.principal.input",
              value: principalInput,
              onChange: (e) => setPrincipalInput(e.target.value),
              placeholder: "e.g. aaaaa-bbbbb-ccccc-...",
              required: true,
              className: "font-mono text-sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The user must log in first to get their principal ID" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: roleInput,
              onValueChange: (v) => setRoleInput(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "staff.role.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UserRole.admin, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 14, className: "text-primary" }),
                    "Admin"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UserRole.user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14 }),
                    "Staff (User)"
                  ] }) })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              "data-ocid": "staff.assign.cancel_button",
              onClick: () => setAssignOpen(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              "data-ocid": "staff.assign.save_button",
              disabled: assignRole.isPending || !principalInput.trim(),
              children: [
                assignRole.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                "Assign Role"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  StaffPage as default
};
