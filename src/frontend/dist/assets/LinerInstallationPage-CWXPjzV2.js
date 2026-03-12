import { r as reactExports, j as jsxRuntimeExports, b7 as HardHat, B as Button, C as Card, l as CardContent, h as Badge, y as ue, U as Users, $ as TrendingUp, as as CircleCheck, i as CardHeader, k as CardTitle, I as Input, q as Select, s as SelectTrigger, v as SelectValue, w as SelectContent, x as SelectItem, L as Label } from "./index-zYE3ieSM.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-D9sYaUqc.js";
import { P as Progress } from "./progress--pHRkfp9.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CqcGXpGX.js";
import { T as Textarea } from "./textarea-CAkbLSug.js";
import { P as Plus } from "./plus-B0va8LMJ.js";
import { T as Trash2 } from "./trash-2-8T3S_jQy.js";
import { C as ChevronRight } from "./chevron-right-BVnxYnsN.js";
import { C as ClipboardList } from "./clipboard-list-c_VDzku9.js";
import { P as Pencil } from "./pencil-EOsYyocv.js";
import { D as Download } from "./download-BTjaIlUc.js";
import { U as UserCheck } from "./user-check-BSdpDI_w.js";
import { C as CircleX } from "./circle-x-BZv0IHio.js";
import "./index-DZCkCVJa.js";
const DEFAULT_STEPS = [
  { no: 1, name: "Traveling (Site par pahunchna)", status: "Pending" },
  { no: 2, name: "Accommodation (Rehne ka intezaam)", status: "Pending" },
  {
    no: 3,
    name: "Gate Pass + Tools Entry + Scaffolding Make",
    status: "Pending"
  },
  { no: 4, name: "LINER Installation (SQR MTR)", status: "Pending" },
  { no: 5, name: "Scaffolding Removal", status: "Pending" },
  { no: 6, name: "MOM (Minutes of Meeting) Banana", status: "Pending" },
  { no: 7, name: "Tools Out", status: "Pending" },
  { no: 8, name: "Traveling to Next Site", status: "Pending" }
];
const blankSteps = () => DEFAULT_STEPS.map((s) => ({ ...s, startDate: "", endDate: "", remarks: "" }));
const STEP_STATUS_COLOR = {
  Pending: "bg-gray-100 text-gray-600",
  "In Progress": "bg-amber-100 text-amber-700",
  Done: "bg-green-100 text-green-700"
};
const ROLE_COLOR = {
  Supervisor: "bg-purple-100 text-purple-700",
  Fitter: "bg-blue-100 text-blue-700",
  Helper: "bg-cyan-100 text-cyan-700",
  Rigger: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-600"
};
const LEAVE_TYPE_LABELS = {
  Medical: "Medical Problem",
  Rest: "Rest",
  "Family Emergency": "Ghar par Emergency",
  Personal: "Personal Kaam",
  Other: "Other"
};
function uid() {
  return String(Date.now()) + Math.random().toString(36).slice(2, 7);
}
const STORAGE_KEY = "polypick_liner_projects";
function useProjects() {
  const [projects, setProjects] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });
  const save = (next) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const addProject = (p) => {
    const np = {
      ...p,
      id: uid(),
      steps: blankSteps(),
      team: [],
      dailyReports: []
    };
    save([np, ...projects]);
    return np.id;
  };
  const updateProject = (id, patch) => save(projects.map((p) => p.id === id ? { ...p, ...patch } : p));
  const deleteProject = (id) => save(projects.filter((p) => p.id !== id));
  const updateStep = (projectId, stepNo, patch) => save(
    projects.map(
      (p) => p.id === projectId ? {
        ...p,
        steps: p.steps.map(
          (s) => s.no === stepNo ? { ...s, ...patch } : s
        )
      } : p
    )
  );
  const addMember = (projectId, member) => save(
    projects.map(
      (p) => p.id === projectId ? { ...p, team: [...p.team, { ...member, id: uid() }] } : p
    )
  );
  const removeMember = (projectId, memberId) => save(
    projects.map(
      (p) => p.id === projectId ? { ...p, team: p.team.filter((m) => m.id !== memberId) } : p
    )
  );
  const addDailyReport = (projectId, report) => save(
    projects.map(
      (p) => p.id === projectId ? {
        ...p,
        dailyReports: [{ ...report, id: uid() }, ...p.dailyReports]
      } : p
    )
  );
  const deleteDailyReport = (projectId, reportId) => save(
    projects.map(
      (p) => p.id === projectId ? {
        ...p,
        dailyReports: p.dailyReports.filter((r) => r.id !== reportId)
      } : p
    )
  );
  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    updateStep,
    addMember,
    removeMember,
    addDailyReport,
    deleteDailyReport
  };
}
function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = reactExports.useState({
    projectName: (initial == null ? void 0 : initial.projectName) ?? "",
    clientName: (initial == null ? void 0 : initial.clientName) ?? "",
    location: (initial == null ? void 0 : initial.location) ?? "",
    startDate: (initial == null ? void 0 : initial.startDate) ?? "",
    endDate: (initial == null ? void 0 : initial.endDate) ?? "",
    totalSqrMtr: (initial == null ? void 0 : initial.totalSqrMtr) ?? 0,
    hopperCount: (initial == null ? void 0 : initial.hopperCount) ?? 0,
    status: (initial == null ? void 0 : initial.status) ?? "Active"
  });
  const handleSave = () => {
    if (!form.projectName.trim() || !form.clientName.trim()) {
      ue.error("Project name aur client name zaroori hai");
      return;
    }
    onSave(form);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-h-[70vh] overflow-y-auto pr-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Project Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. RSP Rourkela Hopper Lining",
            value: form.projectName,
            onChange: (e) => setForm((p) => ({ ...p, projectName: e.target.value })),
            "data-ocid": "liner.project_name.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Client Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. Rourkela Steel Plant",
            value: form.clientName,
            onChange: (e) => setForm((p) => ({ ...p, clientName: e.target.value })),
            "data-ocid": "liner.client_name.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. RSP Rourkela, Odisha",
            value: form.location,
            onChange: (e) => setForm((p) => ({ ...p, location: e.target.value })),
            "data-ocid": "liner.location.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Start Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            value: form.startDate,
            onChange: (e) => setForm((p) => ({ ...p, startDate: e.target.value })),
            "data-ocid": "liner.start_date.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Expected End Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            value: form.endDate,
            onChange: (e) => setForm((p) => ({ ...p, endDate: e.target.value })),
            "data-ocid": "liner.end_date.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Total SQR MTR Target" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            placeholder: "e.g. 500",
            value: form.totalSqrMtr || "",
            onChange: (e) => setForm((p) => ({ ...p, totalSqrMtr: Number(e.target.value) })),
            "data-ocid": "liner.total_sqrmtr.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Hopper / Unit Count" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            placeholder: "e.g. 10",
            value: form.hopperCount || "",
            onChange: (e) => setForm((p) => ({ ...p, hopperCount: Number(e.target.value) })),
            "data-ocid": "liner.hopper_count.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.status,
            onValueChange: (v) => setForm((p) => ({ ...p, status: v })),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "liner.status.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Active", children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Completed", children: "Completed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "On Hold", children: "On Hold" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onCancel,
          "data-ocid": "liner.form.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, "data-ocid": "liner.form.submit_button", children: "Save Project" })
    ] })
  ] });
}
function DailyReportForm({
  team,
  onSave,
  onCancel
}) {
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [sqrMtrDone, setSqrMtrDone] = reactExports.useState("");
  const [stepNo, setStepNo] = reactExports.useState(4);
  const [workDetails, setWorkDetails] = reactExports.useState("");
  const [remarks, setRemarks] = reactExports.useState("");
  const [attendance, setAttendance] = reactExports.useState(
    team.map((m) => ({
      memberId: m.id,
      status: "Present",
      leaveType: "",
      leaveReason: ""
    }))
  );
  const updateAtt = (memberId, patch) => setAttendance(
    (prev) => prev.map((a) => a.memberId === memberId ? { ...a, ...patch } : a)
  );
  const handleSave = () => {
    if (!date) {
      ue.error("Date select karein");
      return;
    }
    onSave({
      date,
      sqrMtrDone: Number(sqrMtrDone) || 0,
      stepNo,
      attendance,
      workDetails,
      remarks
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 max-h-[75vh] overflow-y-auto pr-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            value: date,
            onChange: (e) => setDate(e.target.value),
            "data-ocid": "liner.daily_date.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "SQR MTR Done Today" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            placeholder: "e.g. 45",
            value: sqrMtrDone,
            onChange: (e) => setSqrMtrDone(e.target.value),
            "data-ocid": "liner.daily_sqrmtr.input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Aaj kaunsa step chal raha tha?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: String(stepNo),
          onValueChange: (v) => setStepNo(Number(v)),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "liner.daily_step.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DEFAULT_STEPS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(s.no), children: [
              "Step ",
              s.no,
              ": ",
              s.name
            ] }, s.no)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Work Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          placeholder: "Aaj kya kaam hua -- detail mein likhein...",
          rows: 2,
          value: workDetails,
          onChange: (e) => setWorkDetails(e.target.value),
          "data-ocid": "liner.daily_work.textarea"
        }
      )
    ] }),
    team.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Team Attendance" }),
      team.map((member) => {
        const att = attendance.find((a) => a.memberId === member.id);
        if (!att) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-background p-3 space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: member.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `ml-2 text-xs border-0 ${ROLE_COLOR[member.role]}`,
                      children: member.role
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => updateAtt(member.id, {
                        status: "Present",
                        leaveType: "",
                        leaveReason: ""
                      }),
                      className: `px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${att.status === "Present" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`,
                      children: "Present"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => updateAtt(member.id, { status: "On Leave" }),
                      className: `px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${att.status === "On Leave" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"}`,
                      children: "On Leave"
                    }
                  )
                ] })
              ] }),
              att.status === "On Leave" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Leave Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: att.leaveType,
                      onValueChange: (v) => updateAtt(member.id, { leaveType: v }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select reason" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.keys(LEAVE_TYPE_LABELS).map(
                          (k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: LEAVE_TYPE_LABELS[k] }, k)
                        ) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Remarks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      className: "h-8 text-xs",
                      placeholder: "Optional detail",
                      value: att.leaveReason,
                      onChange: (e) => updateAtt(member.id, { leaveReason: e.target.value })
                    }
                  )
                ] })
              ] })
            ]
          },
          member.id
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Remarks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          placeholder: "Koi special observation ya note...",
          rows: 2,
          value: remarks,
          onChange: (e) => setRemarks(e.target.value),
          "data-ocid": "liner.daily_remarks.textarea"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onCancel,
          "data-ocid": "liner.daily.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, "data-ocid": "liner.daily.submit_button", children: "Save Report" })
    ] })
  ] });
}
function ProjectDetail({
  project,
  onBack,
  onUpdateStep,
  onAddMember,
  onRemoveMember,
  onAddDailyReport,
  onDeleteDailyReport
}) {
  const [memberForm, setMemberForm] = reactExports.useState({
    name: "",
    role: "Fitter",
    phone: ""
  });
  const [addDailyOpen, setAddDailyOpen] = reactExports.useState(false);
  const [editStep, setEditStep] = reactExports.useState(null);
  const [stepForm, setStepForm] = reactExports.useState({});
  const totalDone = project.dailyReports.reduce((s, r) => s + r.sqrMtrDone, 0);
  const pct = project.totalSqrMtr > 0 ? Math.min(100, Math.round(totalDone / project.totalSqrMtr * 100)) : 0;
  const doneSteps = project.steps.filter((s) => s.status === "Done").length;
  const handleAddMember = () => {
    if (!memberForm.name.trim()) {
      ue.error("Member ka naam daalen");
      return;
    }
    onAddMember(memberForm);
    setMemberForm({ name: "", role: "Fitter", phone: "" });
    ue.success("Member add ho gaya");
  };
  const handleStepSave = () => {
    if (!editStep) return;
    onUpdateStep(editStep.no, stepForm);
    setEditStep(null);
    setStepForm({});
    ue.success("Step updated!");
  };
  const exportDailyReports = () => {
    const headers = [
      "Date",
      "Step",
      "SQR MTR Done",
      "Work Details",
      ...project.team.map((m) => `${m.name} (${m.role})`),
      "Leave Reasons",
      "Remarks"
    ];
    const rows = project.dailyReports.map((r) => {
      var _a;
      const stepName = ((_a = DEFAULT_STEPS.find((s) => s.no === r.stepNo)) == null ? void 0 : _a.name) ?? "";
      const attendanceCols = project.team.map((m) => {
        const att = r.attendance.find((a2) => a2.memberId === m.id);
        return att ? att.status : "N/A";
      });
      const leaveReasons = r.attendance.filter((a2) => a2.status === "On Leave").map((a2) => {
        const member = project.team.find((m) => m.id === a2.memberId);
        return `${(member == null ? void 0 : member.name) ?? "?"}: ${a2.leaveType}${a2.leaveReason ? ` - ${a2.leaveReason}` : ""}`;
      }).join("; ");
      return [
        r.date,
        stepName,
        r.sqrMtrDone,
        r.workDetails,
        ...attendanceCols,
        leaveReasons,
        r.remarks
      ];
    });
    const csv = [headers, ...rows].map(
      (r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Daily_Report_${project.projectName.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("CSV exported!");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "liner.project_detail.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onBack,
          className: "gap-1",
          "data-ocid": "liner.back.button",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg leading-tight truncate", children: project.projectName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          project.clientName,
          " • ",
          project.location
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          className: `ml-auto flex-shrink-0 border-0 text-xs ${project.status === "Active" ? "bg-green-100 text-green-700" : project.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`,
          children: project.status
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: totalDone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "SQR MTR Done" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: project.totalSqrMtr }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Total Target" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold", children: [
          pct,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Completed" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold", children: [
          doneSteps,
          "/8"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Steps Done" })
      ] }) })
    ] }),
    project.totalSqrMtr > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "SQR MTR Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          totalDone,
          " / ",
          project.totalSqrMtr,
          " (",
          pct,
          "%)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-2.5" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "steps", "data-ocid": "liner.detail.tab", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full grid grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "steps", "data-ocid": "liner.steps.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 14, className: "mr-1.5" }),
          "Steps"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "team", "data-ocid": "liner.team.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14, className: "mr-1.5" }),
          "Team"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "daily", "data-ocid": "liner.daily.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14, className: "mr-1.5" }),
          "Daily Report"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "steps", className: "space-y-2 mt-3", children: project.steps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border border-border",
          "data-ocid": `liner.step.item.${step.no}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step.status === "Done" ? "bg-green-500 text-white" : step.status === "In Progress" ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-600"}`,
                  children: step.status === "Done" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14 }) : step.no
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: step.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `text-xs border-0 ${STEP_STATUS_COLOR[step.status]}`,
                      children: step.status
                    }
                  ),
                  step.startDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "From: ",
                    step.startDate
                  ] }),
                  step.endDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "To: ",
                    step.endDate
                  ] })
                ] }),
                step.remarks && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 italic", children: step.remarks })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 flex-shrink-0",
                onClick: () => {
                  setEditStep(step);
                  setStepForm({
                    status: step.status,
                    startDate: step.startDate,
                    endDate: step.endDate,
                    remarks: step.remarks
                  });
                },
                "data-ocid": `liner.step.edit_button.${step.no}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
              }
            )
          ] }) })
        },
        step.no
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "team", className: "space-y-3 mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-dashed border-primary/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-muted-foreground", children: "Team Member Add Karein" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pb-3 px-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Name *",
                  value: memberForm.name,
                  onChange: (e) => setMemberForm((p) => ({ ...p, name: e.target.value })),
                  "data-ocid": "liner.member_name.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: memberForm.role,
                  onValueChange: (v) => setMemberForm((p) => ({ ...p, role: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "liner.member_role.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Supervisor", children: "Supervisor" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Fitter", children: "Fitter" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Helper", children: "Helper" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Rigger", children: "Rigger" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Phone (optional)",
                  value: memberForm.phone,
                  onChange: (e) => setMemberForm((p) => ({ ...p, phone: e.target.value })),
                  className: "flex-1",
                  "data-ocid": "liner.member_phone.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: handleAddMember,
                  className: "gap-1",
                  "data-ocid": "liner.member.primary_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                    " Add"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        project.team.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CardContent,
          {
            className: "py-10 text-center text-muted-foreground text-sm",
            "data-ocid": "liner.team.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 32, className: "mx-auto mb-2 opacity-20" }),
              "Koi team member nahi hai. Add karein."
            ]
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: project.team.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "border border-border",
            "data-ocid": `liner.team.item.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-3 px-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ROLE_COLOR[m.role]}`,
                  children: m.name.charAt(0).toUpperCase()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: m.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `text-xs border-0 ${ROLE_COLOR[m.role]}`,
                      children: m.role
                    }
                  ),
                  m.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "📞 ",
                    m.phone
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-destructive",
                  onClick: () => onRemoveMember(m.id),
                  "data-ocid": `liner.team.delete_button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                }
              )
            ] })
          },
          m.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "daily", className: "space-y-3 mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            project.dailyReports.length,
            " reports"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            project.dailyReports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: exportDailyReports,
                className: "gap-1",
                "data-ocid": "liner.daily.export.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
                  " Export CSV"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => setAddDailyOpen(true),
                className: "gap-1",
                "data-ocid": "liner.daily.add.primary_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 }),
                  " Add Report"
                ]
              }
            )
          ] })
        ] }),
        project.dailyReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CardContent,
          {
            className: "py-10 text-center text-muted-foreground text-sm",
            "data-ocid": "liner.daily.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 32, className: "mx-auto mb-2 opacity-20" }),
              "Koi daily report nahi. Add karein."
            ]
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: project.dailyReports.map((r, idx) => {
          var _a;
          const stepName = ((_a = DEFAULT_STEPS.find((s) => s.no === r.stepNo)) == null ? void 0 : _a.name) ?? "";
          const presentCount = r.attendance.filter(
            (a) => a.status === "Present"
          ).length;
          const absentCount = r.attendance.filter(
            (a) => a.status === "On Leave"
          ).length;
          const absences = r.attendance.filter(
            (a) => a.status === "On Leave"
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border border-border",
              "data-ocid": `liner.daily.item.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-sm", children: [
                      "📅 ",
                      r.date
                    ] }),
                    r.sqrMtrDone > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-100 text-blue-700 border-0 text-xs", children: [
                      r.sqrMtrDone,
                      " SQR MTR"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-purple-100 text-purple-700 border-0 text-xs", children: [
                      "Step ",
                      r.stepNo
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: stepName }),
                  r.workDetails && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: r.workDetails }),
                  r.attendance.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-green-600", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { size: 11 }),
                        " ",
                        presentCount,
                        " Present"
                      ] }),
                      absentCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-red-600", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
                        " ",
                        absentCount,
                        " On Leave"
                      ] })
                    ] }),
                    absences.map((a) => {
                      const member = project.team.find(
                        (m) => m.id === a.memberId
                      );
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "text-xs text-red-600 bg-red-50 rounded px-2 py-1",
                          children: [
                            (member == null ? void 0 : member.name) ?? "?",
                            ":",
                            a.leaveType ? ` ${LEAVE_TYPE_LABELS[a.leaveType]}` : " On Leave",
                            a.leaveReason && ` — ${a.leaveReason}`
                          ]
                        },
                        a.memberId
                      );
                    })
                  ] }),
                  r.remarks && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 italic", children: [
                    "📝 ",
                    r.remarks
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-destructive flex-shrink-0",
                    onClick: () => onDeleteDailyReport(r.id),
                    "data-ocid": `liner.daily.delete_button.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                )
              ] }) })
            },
            r.id
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addDailyOpen, onOpenChange: setAddDailyOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "liner.daily.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 18, className: "text-primary" }),
        "Daily Report Add Karein"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DailyReportForm,
        {
          team: project.team,
          onSave: (r) => {
            onAddDailyReport(r);
            ue.success("Daily report saved!");
            setAddDailyOpen(false);
          },
          onCancel: () => setAddDailyOpen(false)
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editStep, onOpenChange: (o) => !o && setEditStep(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "liner.step.edit.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
        "Step ",
        editStep == null ? void 0 : editStep.no,
        ": ",
        editStep == null ? void 0 : editStep.name
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: stepForm.status,
              onValueChange: (v) => setStepForm((p) => ({ ...p, status: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "liner.step_status.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending", children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "In Progress", children: "In Progress" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Done", children: "Done" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Start Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: stepForm.startDate ?? "",
                onChange: (e) => setStepForm((p) => ({ ...p, startDate: e.target.value }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "End Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: stepForm.endDate ?? "",
                onChange: (e) => setStepForm((p) => ({ ...p, endDate: e.target.value }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Remarks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              rows: 2,
              value: stepForm.remarks ?? "",
              onChange: (e) => setStepForm((p) => ({ ...p, remarks: e.target.value }))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setEditStep(null),
            "data-ocid": "liner.step.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleStepSave, "data-ocid": "liner.step.save_button", children: "Save" })
      ] })
    ] }) })
  ] });
}
function LinerInstallationPage() {
  const {
    projects,
    addProject,
    deleteProject,
    updateStep,
    addMember,
    removeMember,
    addDailyReport,
    deleteDailyReport
  } = useProjects();
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const selectedProject = projects.find((p) => p.id === selectedId) ?? null;
  if (selectedProject) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 md:p-6 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProjectDetail,
      {
        project: selectedProject,
        onBack: () => setSelectedId(null),
        onUpdateStep: (stepNo, patch) => updateStep(selectedProject.id, stepNo, patch),
        onAddMember: (m) => addMember(selectedProject.id, m),
        onRemoveMember: (id) => removeMember(selectedProject.id, id),
        onAddDailyReport: (r) => addDailyReport(selectedProject.id, r),
        onDeleteDailyReport: (id) => deleteDailyReport(selectedProject.id, id)
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 md:p-6 space-y-5 animate-fade-in",
      "data-ocid": "liner.page.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { size: 24, className: "text-primary" }),
              "Liner Installation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "UHMWPE Liner installation projects -- 8-step workflow, team, daily reports" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => setAddOpen(true),
              className: "gap-2",
              "data-ocid": "liner.add_project.primary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                " New Project"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
          {
            label: "Active",
            count: projects.filter((p) => p.status === "Active").length,
            color: "text-green-600"
          },
          {
            label: "Completed",
            count: projects.filter((p) => p.status === "Completed").length,
            color: "text-blue-600"
          },
          {
            label: "On Hold",
            count: projects.filter((p) => p.status === "On Hold").length,
            color: "text-amber-600"
          }
        ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-3 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${s.color}`, children: s.count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s.label })
        ] }) }, s.label)) }),
        projects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CardContent,
          {
            className: "py-16 text-center text-muted-foreground",
            "data-ocid": "liner.projects.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { size: 40, className: "mx-auto mb-3 opacity-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Koi project nahi hai" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: '"New Project" se naya liner installation project create karein' })
            ]
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: projects.map((p, idx) => {
          const totalDone = p.dailyReports.reduce(
            (s, r) => s + r.sqrMtrDone,
            0
          );
          const pct = p.totalSqrMtr > 0 ? Math.min(100, Math.round(totalDone / p.totalSqrMtr * 100)) : 0;
          const doneSteps = p.steps.filter((s) => s.status === "Done").length;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Card,
            {
              className: "border border-border cursor-pointer hover:shadow-md transition-shadow",
              onClick: () => setSelectedId(p.id),
              "data-ocid": `liner.project.item.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: p.projectName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: `border-0 text-xs ${p.status === "Active" ? "bg-green-100 text-green-700" : p.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`,
                        children: p.status
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    p.clientName,
                    " • ",
                    p.location
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground", children: [
                    p.startDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "📅 ",
                      p.startDate
                    ] }),
                    p.hopperCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "🏗️ ",
                      p.hopperCount,
                      " hoppers"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "👥 ",
                      p.team.length,
                      " members"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "✅ ",
                      doneSteps,
                      "/8 steps"
                    ] })
                  ] }),
                  p.totalSqrMtr > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                        totalDone,
                        " / ",
                        p.totalSqrMtr,
                        " SQR MTR"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                        pct,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-1.5" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col gap-1 flex-shrink-0",
                    onClick: (e) => e.stopPropagation(),
                    onKeyDown: (e) => e.stopPropagation(),
                    role: "presentation",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "h-7 w-7 text-destructive",
                        onClick: () => setDeleteId(p.id),
                        "data-ocid": `liner.project.delete_button.${idx + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                      }
                    )
                  }
                )
              ] }) })
            },
            p.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "liner.add.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { size: 18, className: "text-primary" }),
            "New Liner Installation Project"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProjectForm,
            {
              onSave: (data) => {
                addProject(data);
                ue.success("Project create ho gaya!");
                setAddOpen(false);
              },
              onCancel: () => setAddOpen(false)
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "liner.delete.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Project Delete Karein?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Saara data (team, steps, daily reports) permanently delete ho jayega." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDeleteId(null),
                "data-ocid": "liner.delete.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: () => {
                  if (deleteId) {
                    deleteProject(deleteId);
                    ue.success("Project deleted");
                    setDeleteId(null);
                  }
                },
                "data-ocid": "liner.delete.confirm_button",
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
  LinerInstallationPage as default
};
