import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Loader2,
  Shield,
  User,
  UserCog,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import {
  useAssignRole,
  useClaimsSummaryPerStaff,
  useIsAdmin,
  useVisitLogsCountPerStaff,
} from "../hooks/useQueries";

interface StaffEntry {
  principal: string;
  visitCount: number;
  claimCount: number;
  approvedAmount: number;
}

export default function StaffPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: visitCounts, isLoading: visitsLoading } =
    useVisitLogsCountPerStaff();
  const { data: claimsSummary, isLoading: claimsLoading } =
    useClaimsSummaryPerStaff();
  const assignRole = useAssignRole();

  const [assignOpen, setAssignOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [principalInput, setPrincipalInput] = useState("");
  const [roleInput, setRoleInput] = useState<UserRole>(UserRole.user);

  // Redirect non-admins
  if (!adminLoading && !isAdmin) {
    navigate({ to: "/" });
    return null;
  }

  // Merge visit + claims data by principal
  const staffMap: Record<string, StaffEntry> = {};

  for (const [principal, count] of visitCounts ?? []) {
    const key = principal.toString();
    if (!staffMap[key]) {
      staffMap[key] = {
        principal: key,
        visitCount: 0,
        claimCount: 0,
        approvedAmount: 0,
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
        approvedAmount: 0,
      };
    }
    staffMap[key].claimCount = Number(summary.totalSubmitted);
    staffMap[key].approvedAmount = Number(summary.totalApprovedAmount);
  }

  const staffList = Object.values(staffMap);
  const isLoading = visitsLoading || claimsLoading;

  // Performance: reports submitted this month per principal
  const reportsCountMap = (() => {
    try {
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const raw = localStorage.getItem("daily_reports");
      const reports: Array<{ principalId: string; submittedAt: string }> = raw
        ? JSON.parse(raw)
        : [];
      const map: Record<string, number> = {};
      for (const r of reports) {
        const d = new Date(r.submittedAt);
        if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
          map[r.principalId] = (map[r.principalId] ?? 0) + 1;
        }
      }
      return map;
    } catch {
      return {} as Record<string, number>;
    }
  })();

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!principalInput.trim()) return;
    try {
      const principal = Principal.fromText(principalInput.trim());
      await assignRole.mutateAsync({ user: principal, role: roleInput });
      toast.success(`Role "${roleInput}" assigned successfully`);
      setPrincipalInput("");
      setRoleInput(UserRole.user);
      setAssignOpen(false);
    } catch {
      toast.error("Failed to assign role. Check the principal ID.");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <UserCog size={24} className="text-primary" />
            Staff Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            View staff activity and manage roles
          </p>
        </div>
        <Button
          data-ocid="staff.open_modal_button"
          onClick={() => setAssignOpen(true)}
          className="gap-2"
        >
          <UserPlus size={16} />
          Assign Role
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance" data-ocid="staff.performance_tab">
            <BarChart3 size={14} className="mr-1.5" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Staff Table */}
          <div className="rounded-lg border border-border overflow-hidden shadow-xs mt-4">
            <Table data-ocid="staff.table">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Principal ID</TableHead>
                  <TableHead className="font-semibold text-center">
                    Visits
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Claims
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Approved (₹)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                    <TableRow key={`skeleton-${i}`}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                        <TableCell key={`cell-${j}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : staffList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      data-ocid="staff.empty_state"
                      className="text-center py-12 text-muted-foreground"
                    >
                      <UserCog size={36} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No staff activity recorded yet</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  staffList.map((staff, idx) => (
                    <TableRow
                      key={staff.principal}
                      data-ocid={`staff.item.${idx + 1}`}
                      className="hover:bg-muted/20"
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <User size={14} className="text-primary" />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">
                            {staff.principal.slice(0, 20)}…
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {staff.visitCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {staff.claimCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-700">
                        ₹{staff.approvedAmount.toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="rounded-lg border border-border overflow-hidden shadow-xs mt-4">
            <Table data-ocid="staff.performance.table">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Principal ID</TableHead>
                  <TableHead className="font-semibold text-center">
                    Visits (All)
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Claims (All)
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Reports (This Month)
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Approved (₹)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                    <TableRow key={`perf-skeleton-${i}`}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                        <TableCell key={`perf-cell-${j}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : staffList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      <BarChart3
                        size={36}
                        className="mx-auto mb-2 opacity-30"
                      />
                      <p className="text-sm">No performance data yet</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  staffList.map((staff, idx) => (
                    <TableRow
                      key={`perf-${staff.principal}`}
                      data-ocid={`staff.performance.item.${idx + 1}`}
                      className="hover:bg-muted/20"
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <User size={14} className="text-primary" />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">
                            {staff.principal.slice(0, 20)}…
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {staff.visitCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {staff.claimCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            reportsCountMap[staff.principal] > 0
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {reportsCountMap[staff.principal] ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-700">
                        ₹{staff.approvedAmount.toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-md" data-ocid="staff.assign.dialog">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Assign User Role
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssign} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>User Principal ID *</Label>
              <Input
                data-ocid="staff.principal.input"
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
                placeholder="e.g. aaaaa-bbbbb-ccccc-..."
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                The user must log in first to get their principal ID
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={roleInput}
                onValueChange={(v) => setRoleInput(v as UserRole)}
              >
                <SelectTrigger data-ocid="staff.role.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.admin}>
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-primary" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value={UserRole.user}>
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      Staff (User)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="staff.assign.cancel_button"
                onClick={() => setAssignOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="staff.assign.save_button"
                disabled={assignRole.isPending || !principalInput.trim()}
              >
                {assignRole.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Assign Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
