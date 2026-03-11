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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Target, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAllClaims,
  useAllVisits,
  useIsAdmin,
  useMyClaims,
  useMyVisits,
  useUserProfile,
} from "../hooks/useQueries";

interface StaffTarget {
  staffId: string;
  staffName: string;
  visitsTarget: number;
  claimsTarget: number;
  reportsTarget: number;
  month: string; // YYYY-MM
}

function useTargets() {
  const [targets, setTargets] = useState<StaffTarget[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_targets") ?? "[]");
    } catch {
      return [];
    }
  });

  const save = (next: StaffTarget[]) => {
    setTargets(next);
    localStorage.setItem("polypick_targets", JSON.stringify(next));
  };

  const upsert = (t: StaffTarget) => {
    const existing = targets.findIndex(
      (x) => x.staffId === t.staffId && x.month === t.month,
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

function nsToDate(ns: bigint): Date {
  return new Date(Number(ns / 1_000_000n));
}

function progressColor(pct: number) {
  if (pct >= 80) return "[&>div]:bg-green-500";
  if (pct >= 50) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}

function progressBadge(pct: number) {
  if (pct >= 80) return "bg-green-100 text-green-700";
  if (pct >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function TargetsPage() {
  const { data: isAdmin } = useIsAdmin();
  const { data: profile } = useUserProfile();
  const { data: myVisits = [] } = useMyVisits();
  const { data: allVisits = [] } = useAllVisits(!!isAdmin);
  const { data: myClaims = [] } = useMyClaims();
  const { data: allClaims = [] } = useAllClaims(!!isAdmin);
  const { targets, upsert } = useTargets();

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = now.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<StaffTarget>>({
    visitsTarget: 20,
    claimsTarget: 10,
    reportsTarget: 25,
    month: monthKey,
  });

  const myTarget = targets.find(
    (t) => t.staffId === (profile?.name ?? "") && t.month === monthKey,
  ) ?? {
    staffId: profile?.name ?? "me",
    staffName: profile?.name ?? "My Account",
    visitsTarget: 20,
    claimsTarget: 10,
    reportsTarget: 25,
    month: monthKey,
  };

  const currentVisits = (isAdmin ? allVisits : myVisits).filter((v) => {
    const d = nsToDate(v.plannedDate);
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }).length;

  const currentClaims = (isAdmin ? allClaims : myClaims).filter((c) => {
    const d = nsToDate(c.submittedAt);
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }).length;

  const visitsPct = Math.round(
    Math.min((currentVisits / Math.max(myTarget.visitsTarget, 1)) * 100, 100),
  );
  const claimsPct = Math.round(
    Math.min((currentClaims / Math.max(myTarget.claimsTarget, 1)) * 100, 100),
  );

  const openEdit = () => {
    setEditForm({
      staffId: profile?.name ?? "me",
      staffName: profile?.name ?? "My Account",
      visitsTarget: myTarget.visitsTarget,
      claimsTarget: myTarget.claimsTarget,
      reportsTarget: myTarget.reportsTarget,
      month: monthKey,
    });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!editForm.staffId) return;
    upsert(editForm as StaffTarget);
    toast.success("Target saved!");
    setEditOpen(false);
  };

  const monthTargets = targets.filter((t) => t.month === monthKey);

  const metrics = [
    {
      label: "Visits",
      current: currentVisits,
      target: myTarget.visitsTarget,
      pct: visitsPct,
      icon: "📍",
    },
    {
      label: "TA DA Claims",
      current: currentClaims,
      target: myTarget.claimsTarget,
      pct: claimsPct,
      icon: "🧾",
    },
  ];

  return (
    <div
      className="p-4 md:p-6 space-y-6 animate-fade-in"
      data-ocid="targets.section"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy size={24} className="text-primary" />
            Targets & Achievement
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {monthLabel} — Monthly Progress
          </p>
        </div>
        <Button
          size="sm"
          onClick={openEdit}
          className="gap-2 self-start sm:self-auto"
          data-ocid="targets.set.primary_button"
        >
          <Target size={14} />
          Set Targets
        </Button>
      </div>

      {/* My Progress */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">
          Mera Progress — {profile?.name ?? ""}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((m) => (
            <Card key={m.label} className="border border-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.icon}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {m.label}
                    </span>
                  </div>
                  <Badge className={`${progressBadge(m.pct)} border-0 text-xs`}>
                    {m.pct}%
                  </Badge>
                </div>
                <Progress
                  value={m.pct}
                  className={`h-3 ${progressColor(m.pct)}`}
                  data-ocid={`targets.${m.label.toLowerCase().replace(" ", "_")}.progress`}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{m.current} done</span>
                  <span>Target: {m.target}</span>
                </div>
                {m.pct >= 100 && (
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    🎉 Target pura ho gaya!
                  </p>
                )}
                {m.pct < 50 && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ {m.target - m.current} aur baaki hain
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin: All Staff Targets */}
      {isAdmin && monthTargets.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            All Staff Targets — {monthLabel}
          </h2>
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-semibold">
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table data-ocid="targets.staff.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead className="text-center">Visits Target</TableHead>
                    <TableHead className="text-center">Claims Target</TableHead>
                    <TableHead className="text-center">
                      Reports Target
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthTargets.map((t, idx) => (
                    <TableRow
                      key={`${t.staffId}-${t.month}`}
                      data-ocid={`targets.staff.row.${idx + 1}`}
                    >
                      <TableCell className="font-medium">
                        {t.staffName}
                      </TableCell>
                      <TableCell className="text-center">
                        {t.visitsTarget}
                      </TableCell>
                      <TableCell className="text-center">
                        {t.claimsTarget}
                      </TableCell>
                      <TableCell className="text-center">
                        {t.reportsTarget}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Set Target Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm" data-ocid="targets.set.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Target size={18} className="text-primary" />
              Monthly Target Set Karein
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Staff Name</Label>
              <Input
                value={editForm.staffName ?? ""}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    staffName: e.target.value,
                    staffId: e.target.value,
                  }))
                }
                placeholder="Staff ka naam"
                data-ocid="targets.staff_name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Visits Target</Label>
              <Input
                type="number"
                min={0}
                value={editForm.visitsTarget ?? ""}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    visitsTarget: Number(e.target.value),
                  }))
                }
                data-ocid="targets.visits_target.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>TA DA Claims Target</Label>
              <Input
                type="number"
                min={0}
                value={editForm.claimsTarget ?? ""}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    claimsTarget: Number(e.target.value),
                  }))
                }
                data-ocid="targets.claims_target.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Daily Reports Target</Label>
              <Input
                type="number"
                min={0}
                value={editForm.reportsTarget ?? ""}
                onChange={(e) =>
                  setEditForm((p) => ({
                    ...p,
                    reportsTarget: Number(e.target.value),
                  }))
                }
                data-ocid="targets.reports_target.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              data-ocid="targets.set.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} data-ocid="targets.set.save_button">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
