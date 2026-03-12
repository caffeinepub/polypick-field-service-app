import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  HardHat,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepStatus = "Pending" | "In Progress" | "Done";
type MemberRole = "Supervisor" | "Fitter" | "Helper" | "Rigger" | "Other";
type LeaveType = "Medical" | "Rest" | "Family Emergency" | "Personal" | "Other";
type AttendanceStatus = "Present" | "On Leave";

interface WorkStep {
  no: number;
  name: string;
  status: StepStatus;
  startDate: string;
  endDate: string;
  remarks: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: MemberRole;
  phone: string;
}

interface DailyAttendance {
  memberId: string;
  status: AttendanceStatus;
  leaveType: LeaveType | "";
  leaveReason: string;
}

interface DailyReport {
  id: string;
  date: string;
  sqrMtrDone: number;
  stepNo: number;
  attendance: DailyAttendance[];
  workDetails: string;
  remarks: string;
}

interface LinerProject {
  id: string;
  projectName: string;
  clientName: string;
  location: string;
  startDate: string;
  endDate: string;
  totalSqrMtr: number;
  hopperCount: number;
  steps: WorkStep[];
  team: TeamMember[];
  dailyReports: DailyReport[];
  status: "Active" | "Completed" | "On Hold";
}

// ─── Default Steps ─────────────────────────────────────────────────────────

const DEFAULT_STEPS: Omit<WorkStep, "startDate" | "endDate" | "remarks">[] = [
  { no: 1, name: "Traveling (Site par pahunchna)", status: "Pending" },
  { no: 2, name: "Accommodation (Rehne ka intezaam)", status: "Pending" },
  {
    no: 3,
    name: "Gate Pass + Tools Entry + Scaffolding Make",
    status: "Pending",
  },
  { no: 4, name: "LINER Installation (SQR MTR)", status: "Pending" },
  { no: 5, name: "Scaffolding Removal", status: "Pending" },
  { no: 6, name: "MOM (Minutes of Meeting) Banana", status: "Pending" },
  { no: 7, name: "Tools Out", status: "Pending" },
  { no: 8, name: "Traveling to Next Site", status: "Pending" },
];

const blankSteps = (): WorkStep[] =>
  DEFAULT_STEPS.map((s) => ({ ...s, startDate: "", endDate: "", remarks: "" }));

// ─── Helpers ───────────────────────────────────────────────────────────────

const STEP_STATUS_COLOR: Record<StepStatus, string> = {
  Pending: "bg-gray-100 text-gray-600",
  "In Progress": "bg-amber-100 text-amber-700",
  Done: "bg-green-100 text-green-700",
};

const ROLE_COLOR: Record<MemberRole, string> = {
  Supervisor: "bg-purple-100 text-purple-700",
  Fitter: "bg-blue-100 text-blue-700",
  Helper: "bg-cyan-100 text-cyan-700",
  Rigger: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-600",
};

const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  Medical: "Medical Problem",
  Rest: "Rest",
  "Family Emergency": "Ghar par Emergency",
  Personal: "Personal Kaam",
  Other: "Other",
};

function uid() {
  return String(Date.now()) + Math.random().toString(36).slice(2, 7);
}

// ─── Storage ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "polypick_liner_projects";

function useProjects() {
  const [projects, setProjects] = useState<LinerProject[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  const save = (next: LinerProject[]) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addProject = (
    p: Omit<LinerProject, "id" | "steps" | "team" | "dailyReports">,
  ) => {
    const np: LinerProject = {
      ...p,
      id: uid(),
      steps: blankSteps(),
      team: [],
      dailyReports: [],
    };
    save([np, ...projects]);
    return np.id;
  };

  const updateProject = (id: string, patch: Partial<LinerProject>) =>
    save(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const deleteProject = (id: string) =>
    save(projects.filter((p) => p.id !== id));

  const updateStep = (
    projectId: string,
    stepNo: number,
    patch: Partial<WorkStep>,
  ) =>
    save(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              steps: p.steps.map((s) =>
                s.no === stepNo ? { ...s, ...patch } : s,
              ),
            }
          : p,
      ),
    );

  const addMember = (projectId: string, member: Omit<TeamMember, "id">) =>
    save(
      projects.map((p) =>
        p.id === projectId
          ? { ...p, team: [...p.team, { ...member, id: uid() }] }
          : p,
      ),
    );

  const removeMember = (projectId: string, memberId: string) =>
    save(
      projects.map((p) =>
        p.id === projectId
          ? { ...p, team: p.team.filter((m) => m.id !== memberId) }
          : p,
      ),
    );

  const addDailyReport = (projectId: string, report: Omit<DailyReport, "id">) =>
    save(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              dailyReports: [{ ...report, id: uid() }, ...p.dailyReports],
            }
          : p,
      ),
    );

  const deleteDailyReport = (projectId: string, reportId: string) =>
    save(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              dailyReports: p.dailyReports.filter((r) => r.id !== reportId),
            }
          : p,
      ),
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
    deleteDailyReport,
  };
}

// ─── Project Form ──────────────────────────────────────────────────────────

interface ProjectFormProps {
  initial?: Partial<LinerProject>;
  onSave: (
    data: Omit<LinerProject, "id" | "steps" | "team" | "dailyReports">,
  ) => void;
  onCancel: () => void;
}

function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState({
    projectName: initial?.projectName ?? "",
    clientName: initial?.clientName ?? "",
    location: initial?.location ?? "",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
    totalSqrMtr: initial?.totalSqrMtr ?? 0,
    hopperCount: initial?.hopperCount ?? 0,
    status: initial?.status ?? ("Active" as LinerProject["status"]),
  });

  const handleSave = () => {
    if (!form.projectName.trim() || !form.clientName.trim()) {
      toast.error("Project name aur client name zaroori hai");
      return;
    }
    onSave(form);
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 col-span-2">
          <Label>Project Name *</Label>
          <Input
            placeholder="e.g. RSP Rourkela Hopper Lining"
            value={form.projectName}
            onChange={(e) =>
              setForm((p) => ({ ...p, projectName: e.target.value }))
            }
            data-ocid="liner.project_name.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Client Name *</Label>
          <Input
            placeholder="e.g. Rourkela Steel Plant"
            value={form.clientName}
            onChange={(e) =>
              setForm((p) => ({ ...p, clientName: e.target.value }))
            }
            data-ocid="liner.client_name.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Location</Label>
          <Input
            placeholder="e.g. RSP Rourkela, Odisha"
            value={form.location}
            onChange={(e) =>
              setForm((p) => ({ ...p, location: e.target.value }))
            }
            data-ocid="liner.location.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, startDate: e.target.value }))
            }
            data-ocid="liner.start_date.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Expected End Date</Label>
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, endDate: e.target.value }))
            }
            data-ocid="liner.end_date.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Total SQR MTR Target</Label>
          <Input
            type="number"
            placeholder="e.g. 500"
            value={form.totalSqrMtr || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, totalSqrMtr: Number(e.target.value) }))
            }
            data-ocid="liner.total_sqrmtr.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Hopper / Unit Count</Label>
          <Input
            type="number"
            placeholder="e.g. 10"
            value={form.hopperCount || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, hopperCount: Number(e.target.value) }))
            }
            data-ocid="liner.hopper_count.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, status: v as LinerProject["status"] }))
            }
          >
            <SelectTrigger data-ocid="liner.status.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="liner.form.cancel_button"
        >
          Cancel
        </Button>
        <Button onClick={handleSave} data-ocid="liner.form.submit_button">
          Save Project
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── Daily Report Form ─────────────────────────────────────────────────────

function DailyReportForm({
  team,
  onSave,
  onCancel,
}: {
  team: TeamMember[];
  onSave: (r: Omit<DailyReport, "id">) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sqrMtrDone, setSqrMtrDone] = useState("");
  const [stepNo, setStepNo] = useState(4);
  const [workDetails, setWorkDetails] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attendance, setAttendance] = useState<DailyAttendance[]>(
    team.map((m) => ({
      memberId: m.id,
      status: "Present" as AttendanceStatus,
      leaveType: "" as LeaveType | "",
      leaveReason: "",
    })),
  );

  const updateAtt = (memberId: string, patch: Partial<DailyAttendance>) =>
    setAttendance((prev) =>
      prev.map((a) => (a.memberId === memberId ? { ...a, ...patch } : a)),
    );

  const handleSave = () => {
    if (!date) {
      toast.error("Date select karein");
      return;
    }
    onSave({
      date,
      sqrMtrDone: Number(sqrMtrDone) || 0,
      stepNo,
      attendance,
      workDetails,
      remarks,
    });
  };

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      {/* Basic */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Date *</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-ocid="liner.daily_date.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>SQR MTR Done Today</Label>
          <Input
            type="number"
            placeholder="e.g. 45"
            value={sqrMtrDone}
            onChange={(e) => setSqrMtrDone(e.target.value)}
            data-ocid="liner.daily_sqrmtr.input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Aaj kaunsa step chal raha tha?</Label>
        <Select
          value={String(stepNo)}
          onValueChange={(v) => setStepNo(Number(v))}
        >
          <SelectTrigger data-ocid="liner.daily_step.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEFAULT_STEPS.map((s) => (
              <SelectItem key={s.no} value={String(s.no)}>
                Step {s.no}: {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Work Details</Label>
        <Textarea
          placeholder="Aaj kya kaam hua -- detail mein likhein..."
          rows={2}
          value={workDetails}
          onChange={(e) => setWorkDetails(e.target.value)}
          data-ocid="liner.daily_work.textarea"
        />
      </div>

      {/* Attendance Section */}
      {team.length > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Team Attendance
          </p>
          {team.map((member) => {
            const att = attendance.find((a) => a.memberId === member.id);
            if (!att) return null;
            return (
              <div
                key={member.id}
                className="rounded-lg border border-border bg-background p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{member.name}</span>
                    <Badge
                      className={`ml-2 text-xs border-0 ${ROLE_COLOR[member.role]}`}
                    >
                      {member.role}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateAtt(member.id, {
                          status: "Present",
                          leaveType: "",
                          leaveReason: "",
                        })
                      }
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        att.status === "Present"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateAtt(member.id, { status: "On Leave" })
                      }
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        att.status === "On Leave"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      On Leave
                    </button>
                  </div>
                </div>
                {att.status === "On Leave" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="space-y-1">
                      <Label className="text-xs">Leave Type</Label>
                      <Select
                        value={att.leaveType}
                        onValueChange={(v) =>
                          updateAtt(member.id, { leaveType: v as LeaveType })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(LEAVE_TYPE_LABELS) as LeaveType[]).map(
                            (k) => (
                              <SelectItem key={k} value={k}>
                                {LEAVE_TYPE_LABELS[k]}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Remarks</Label>
                      <Input
                        className="h-8 text-xs"
                        placeholder="Optional detail"
                        value={att.leaveReason}
                        onChange={(e) =>
                          updateAtt(member.id, { leaveReason: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Remarks</Label>
        <Textarea
          placeholder="Koi special observation ya note..."
          rows={2}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          data-ocid="liner.daily_remarks.textarea"
        />
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="liner.daily.cancel_button"
        >
          Cancel
        </Button>
        <Button onClick={handleSave} data-ocid="liner.daily.submit_button">
          Save Report
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── Project Detail View ───────────────────────────────────────────────────

function ProjectDetail({
  project,
  onBack,
  onUpdateStep,
  onAddMember,
  onRemoveMember,
  onAddDailyReport,
  onDeleteDailyReport,
}: {
  project: LinerProject;
  onBack: () => void;
  onUpdateStep: (stepNo: number, patch: Partial<WorkStep>) => void;
  onAddMember: (m: Omit<TeamMember, "id">) => void;
  onRemoveMember: (id: string) => void;
  onAddDailyReport: (r: Omit<DailyReport, "id">) => void;
  onDeleteDailyReport: (id: string) => void;
}) {
  const [memberForm, setMemberForm] = useState({
    name: "",
    role: "Fitter" as MemberRole,
    phone: "",
  });
  const [addDailyOpen, setAddDailyOpen] = useState(false);
  const [editStep, setEditStep] = useState<WorkStep | null>(null);
  const [stepForm, setStepForm] = useState<Partial<WorkStep>>({});

  const totalDone = project.dailyReports.reduce((s, r) => s + r.sqrMtrDone, 0);
  const pct =
    project.totalSqrMtr > 0
      ? Math.min(100, Math.round((totalDone / project.totalSqrMtr) * 100))
      : 0;
  const doneSteps = project.steps.filter((s) => s.status === "Done").length;

  const handleAddMember = () => {
    if (!memberForm.name.trim()) {
      toast.error("Member ka naam daalen");
      return;
    }
    onAddMember(memberForm);
    setMemberForm({ name: "", role: "Fitter", phone: "" });
    toast.success("Member add ho gaya");
  };

  const handleStepSave = () => {
    if (!editStep) return;
    onUpdateStep(editStep.no, stepForm);
    setEditStep(null);
    setStepForm({});
    toast.success("Step updated!");
  };

  const exportDailyReports = () => {
    const headers = [
      "Date",
      "Step",
      "SQR MTR Done",
      "Work Details",
      ...project.team.map((m) => `${m.name} (${m.role})`),
      "Leave Reasons",
      "Remarks",
    ];
    const rows = project.dailyReports.map((r) => {
      const stepName = DEFAULT_STEPS.find((s) => s.no === r.stepNo)?.name ?? "";
      const attendanceCols = project.team.map((m) => {
        const att = r.attendance.find((a) => a.memberId === m.id);
        return att ? att.status : "N/A";
      });
      const leaveReasons = r.attendance
        .filter((a) => a.status === "On Leave")
        .map((a) => {
          const member = project.team.find((m) => m.id === a.memberId);
          return `${member?.name ?? "?"}: ${a.leaveType}${a.leaveReason ? ` - ${a.leaveReason}` : ""}`;
        })
        .join("; ");
      return [
        r.date,
        stepName,
        r.sqrMtrDone,
        r.workDetails,
        ...attendanceCols,
        leaveReasons,
        r.remarks,
      ];
    });
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Daily_Report_${project.projectName.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  return (
    <div className="space-y-4" data-ocid="liner.project_detail.section">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1"
          data-ocid="liner.back.button"
        >
          ← Back
        </Button>
        <ChevronRight size={14} className="text-muted-foreground" />
        <div className="min-w-0">
          <h2 className="font-display font-bold text-lg leading-tight truncate">
            {project.projectName}
          </h2>
          <p className="text-xs text-muted-foreground">
            {project.clientName} &bull; {project.location}
          </p>
        </div>
        <Badge
          className={`ml-auto flex-shrink-0 border-0 text-xs ${
            project.status === "Active"
              ? "bg-green-100 text-green-700"
              : project.status === "Completed"
                ? "bg-blue-100 text-blue-700"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          {project.status}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xl font-bold">{totalDone}</p>
            <p className="text-xs text-muted-foreground mt-0.5">SQR MTR Done</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xl font-bold">{project.totalSqrMtr}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Target</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xl font-bold">{pct}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xl font-bold">{doneSteps}/8</p>
            <p className="text-xs text-muted-foreground mt-0.5">Steps Done</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {project.totalSqrMtr > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">SQR MTR Progress</span>
              <span className="font-semibold">
                {totalDone} / {project.totalSqrMtr} ({pct}%)
              </span>
            </div>
            <Progress value={pct} className="h-2.5" />
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="steps" data-ocid="liner.detail.tab">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="steps" data-ocid="liner.steps.tab">
            <ClipboardList size={14} className="mr-1.5" />
            Steps
          </TabsTrigger>
          <TabsTrigger value="team" data-ocid="liner.team.tab">
            <Users size={14} className="mr-1.5" />
            Team
          </TabsTrigger>
          <TabsTrigger value="daily" data-ocid="liner.daily.tab">
            <TrendingUp size={14} className="mr-1.5" />
            Daily Report
          </TabsTrigger>
        </TabsList>

        {/* Steps Tab */}
        <TabsContent value="steps" className="space-y-2 mt-3">
          {project.steps.map((step) => (
            <Card
              key={step.no}
              className="border border-border"
              data-ocid={`liner.step.item.${step.no}`}
            >
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.status === "Done"
                          ? "bg-green-500 text-white"
                          : step.status === "In Progress"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.status === "Done" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        step.no
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{step.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                        <Badge
                          className={`text-xs border-0 ${STEP_STATUS_COLOR[step.status]}`}
                        >
                          {step.status}
                        </Badge>
                        {step.startDate && <span>From: {step.startDate}</span>}
                        {step.endDate && <span>To: {step.endDate}</span>}
                      </div>
                      {step.remarks && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {step.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0"
                    onClick={() => {
                      setEditStep(step);
                      setStepForm({
                        status: step.status,
                        startDate: step.startDate,
                        endDate: step.endDate,
                        remarks: step.remarks,
                      });
                    }}
                    data-ocid={`liner.step.edit_button.${step.no}`}
                  >
                    <Pencil size={13} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-3 mt-3">
          {/* Add Member Form */}
          <Card className="border border-dashed border-primary/40">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Team Member Add Karein
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 px-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Name *"
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="liner.member_name.input"
                />
                <Select
                  value={memberForm.role}
                  onValueChange={(v) =>
                    setMemberForm((p) => ({ ...p, role: v as MemberRole }))
                  }
                >
                  <SelectTrigger data-ocid="liner.member_role.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Fitter">Fitter</SelectItem>
                    <SelectItem value="Helper">Helper</SelectItem>
                    <SelectItem value="Rigger">Rigger</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Phone (optional)"
                  value={memberForm.phone}
                  onChange={(e) =>
                    setMemberForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="flex-1"
                  data-ocid="liner.member_phone.input"
                />
                <Button
                  size="sm"
                  onClick={handleAddMember}
                  className="gap-1"
                  data-ocid="liner.member.primary_button"
                >
                  <Plus size={14} /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Member List */}
          {project.team.length === 0 ? (
            <Card>
              <CardContent
                className="py-10 text-center text-muted-foreground text-sm"
                data-ocid="liner.team.empty_state"
              >
                <Users size={32} className="mx-auto mb-2 opacity-20" />
                Koi team member nahi hai. Add karein.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {project.team.map((m, idx) => (
                <Card
                  key={m.id}
                  className="border border-border"
                  data-ocid={`liner.team.item.${idx + 1}`}
                >
                  <CardContent className="py-3 px-4 flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ROLE_COLOR[m.role]}`}
                    >
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{m.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          className={`text-xs border-0 ${ROLE_COLOR[m.role]}`}
                        >
                          {m.role}
                        </Badge>
                        {m.phone && (
                          <span className="text-xs text-muted-foreground">
                            📞 {m.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => onRemoveMember(m.id)}
                      data-ocid={`liner.team.delete_button.${idx + 1}`}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Daily Report Tab */}
        <TabsContent value="daily" className="space-y-3 mt-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {project.dailyReports.length} reports
            </p>
            <div className="flex gap-2">
              {project.dailyReports.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportDailyReports}
                  className="gap-1"
                  data-ocid="liner.daily.export.button"
                >
                  <Download size={13} /> Export CSV
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => setAddDailyOpen(true)}
                className="gap-1"
                data-ocid="liner.daily.add.primary_button"
              >
                <Plus size={13} /> Add Report
              </Button>
            </div>
          </div>

          {project.dailyReports.length === 0 ? (
            <Card>
              <CardContent
                className="py-10 text-center text-muted-foreground text-sm"
                data-ocid="liner.daily.empty_state"
              >
                <ClipboardList size={32} className="mx-auto mb-2 opacity-20" />
                Koi daily report nahi. Add karein.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {project.dailyReports.map((r, idx) => {
                const stepName =
                  DEFAULT_STEPS.find((s) => s.no === r.stepNo)?.name ?? "";
                const presentCount = r.attendance.filter(
                  (a) => a.status === "Present",
                ).length;
                const absentCount = r.attendance.filter(
                  (a) => a.status === "On Leave",
                ).length;
                const absences = r.attendance.filter(
                  (a) => a.status === "On Leave",
                );

                return (
                  <Card
                    key={r.id}
                    className="border border-border"
                    data-ocid={`liner.daily.item.${idx + 1}`}
                  >
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">
                              📅 {r.date}
                            </span>
                            {r.sqrMtrDone > 0 && (
                              <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                                {r.sqrMtrDone} SQR MTR
                              </Badge>
                            )}
                            <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                              Step {r.stepNo}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {stepName}
                          </p>
                          {r.workDetails && (
                            <p className="text-sm mt-1">{r.workDetails}</p>
                          )}

                          {/* Attendance Summary */}
                          {r.attendance.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1 text-green-600">
                                  <UserCheck size={11} /> {presentCount} Present
                                </span>
                                {absentCount > 0 && (
                                  <span className="flex items-center gap-1 text-red-600">
                                    <XCircle size={11} /> {absentCount} On Leave
                                  </span>
                                )}
                              </div>
                              {absences.map((a) => {
                                const member = project.team.find(
                                  (m) => m.id === a.memberId,
                                );
                                return (
                                  <div
                                    key={a.memberId}
                                    className="text-xs text-red-600 bg-red-50 rounded px-2 py-1"
                                  >
                                    {member?.name ?? "?"}:
                                    {a.leaveType
                                      ? ` ${LEAVE_TYPE_LABELS[a.leaveType as LeaveType]}`
                                      : " On Leave"}
                                    {a.leaveReason && ` — ${a.leaveReason}`}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {r.remarks && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              📝 {r.remarks}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive flex-shrink-0"
                          onClick={() => onDeleteDailyReport(r.id)}
                          data-ocid={`liner.daily.delete_button.${idx + 1}`}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Daily Report Dialog */}
      <Dialog open={addDailyOpen} onOpenChange={setAddDailyOpen}>
        <DialogContent className="max-w-lg" data-ocid="liner.daily.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <ClipboardList size={18} className="text-primary" />
              Daily Report Add Karein
            </DialogTitle>
          </DialogHeader>
          <DailyReportForm
            team={project.team}
            onSave={(r) => {
              onAddDailyReport(r);
              toast.success("Daily report saved!");
              setAddDailyOpen(false);
            }}
            onCancel={() => setAddDailyOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Step Dialog */}
      <Dialog open={!!editStep} onOpenChange={(o) => !o && setEditStep(null)}>
        <DialogContent className="max-w-sm" data-ocid="liner.step.edit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Step {editStep?.no}: {editStep?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={stepForm.status}
                onValueChange={(v) =>
                  setStepForm((p) => ({ ...p, status: v as StepStatus }))
                }
              >
                <SelectTrigger data-ocid="liner.step_status.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={stepForm.startDate ?? ""}
                  onChange={(e) =>
                    setStepForm((p) => ({ ...p, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={stepForm.endDate ?? ""}
                  onChange={(e) =>
                    setStepForm((p) => ({ ...p, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Remarks</Label>
              <Textarea
                rows={2}
                value={stepForm.remarks ?? ""}
                onChange={(e) =>
                  setStepForm((p) => ({ ...p, remarks: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditStep(null)}
              data-ocid="liner.step.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleStepSave} data-ocid="liner.step.save_button">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function LinerInstallationPage() {
  const {
    projects,
    addProject,
    deleteProject,
    updateStep,
    addMember,
    removeMember,
    addDailyReport,
    deleteDailyReport,
  } = useProjects();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedId) ?? null;

  if (selectedProject) {
    return (
      <div className="p-4 md:p-6 animate-fade-in">
        <ProjectDetail
          project={selectedProject}
          onBack={() => setSelectedId(null)}
          onUpdateStep={(stepNo, patch) =>
            updateStep(selectedProject.id, stepNo, patch)
          }
          onAddMember={(m) => addMember(selectedProject.id, m)}
          onRemoveMember={(id) => removeMember(selectedProject.id, id)}
          onAddDailyReport={(r) => addDailyReport(selectedProject.id, r)}
          onDeleteDailyReport={(id) =>
            deleteDailyReport(selectedProject.id, id)
          }
        />
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-6 space-y-5 animate-fade-in"
      data-ocid="liner.page.section"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <HardHat size={24} className="text-primary" />
            Liner Installation
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            UHMWPE Liner installation projects -- 8-step workflow, team, daily
            reports
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setAddOpen(true)}
          className="gap-2"
          data-ocid="liner.add_project.primary_button"
        >
          <Plus size={14} /> New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Active",
            count: projects.filter((p) => p.status === "Active").length,
            color: "text-green-600",
          },
          {
            label: "Completed",
            count: projects.filter((p) => p.status === "Completed").length,
            color: "text-blue-600",
          },
          {
            label: "On Hold",
            count: projects.filter((p) => p.status === "On Hold").length,
            color: "text-amber-600",
          },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="pt-4 pb-3 px-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <Card>
          <CardContent
            className="py-16 text-center text-muted-foreground"
            data-ocid="liner.projects.empty_state"
          >
            <HardHat size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">Koi project nahi hai</p>
            <p className="text-sm mt-1">
              "New Project" se naya liner installation project create karein
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((p, idx) => {
            const totalDone = p.dailyReports.reduce(
              (s, r) => s + r.sqrMtrDone,
              0,
            );
            const pct =
              p.totalSqrMtr > 0
                ? Math.min(100, Math.round((totalDone / p.totalSqrMtr) * 100))
                : 0;
            const doneSteps = p.steps.filter((s) => s.status === "Done").length;

            return (
              <Card
                key={p.id}
                className="border border-border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedId(p.id)}
                data-ocid={`liner.project.item.${idx + 1}`}
              >
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          {p.projectName}
                        </span>
                        <Badge
                          className={`border-0 text-xs ${
                            p.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : p.status === "Completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.clientName} &bull; {p.location}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        {p.startDate && <span>📅 {p.startDate}</span>}
                        {p.hopperCount > 0 && (
                          <span>🏗️ {p.hopperCount} hoppers</span>
                        )}
                        <span>👥 {p.team.length} members</span>
                        <span>✅ {doneSteps}/8 steps</span>
                      </div>
                      {p.totalSqrMtr > 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              {totalDone} / {p.totalSqrMtr} SQR MTR
                            </span>
                            <span className="font-medium">{pct}%</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      )}
                    </div>
                    <div
                      className="flex flex-col gap-1 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      role="presentation"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setDeleteId(p.id)}
                        data-ocid={`liner.project.delete_button.${idx + 1}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Project Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg" data-ocid="liner.add.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <HardHat size={18} className="text-primary" />
              New Liner Installation Project
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSave={(data) => {
              addProject(data);
              toast.success("Project create ho gaya!");
              setAddOpen(false);
            }}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm" data-ocid="liner.delete.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Project Delete Karein?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Saara data (team, steps, daily reports) permanently delete ho
            jayega.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="liner.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId) {
                  deleteProject(deleteId);
                  toast.success("Project deleted");
                  setDeleteId(null);
                }
              }}
              data-ocid="liner.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
