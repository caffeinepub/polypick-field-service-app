import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  BarChart3,
  CalendarCheck,
  FileText,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useAllClaims,
  useAllVisits,
  useClaimsSummaryPerStaff,
  useInteractionsSummary,
  usePipelineStats,
  useTotalClientsCount,
  useVisitLogsCountPerStaff,
} from "../hooks/useQueries";

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
  "December",
];

const CHART_COLORS = [
  "oklch(0.55 0.18 265)",
  "oklch(0.72 0.15 155)",
  "oklch(0.75 0.17 85)",
  "oklch(0.62 0.20 30)",
  "oklch(0.48 0.16 310)",
];

export default function ReportsPage() {
  const now = new Date();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryMonth, setSummaryMonth] = useState(now.getMonth());
  const [summaryYear, setSummaryYear] = useState(now.getFullYear());

  const { data: totalClients, isLoading: clientsLoading } =
    useTotalClientsCount();
  const { data: pipelineStats, isLoading: pipelineLoading } =
    usePipelineStats();
  const { data: interactionsSummary, isLoading: summaryLoading } =
    useInteractionsSummary();
  const { data: claimsSummary, isLoading: claimsLoading } =
    useClaimsSummaryPerStaff();
  const { data: visitCounts, isLoading: visitsLoading } =
    useVisitLogsCountPerStaff();
  const { data: allClaims } = useAllClaims();
  const { data: allVisits } = useAllVisits();

  const pipelineData = pipelineStats
    ? [
        { name: "Inquiries", value: Number(pipelineStats.inquiry) },
        { name: "Offers", value: Number(pipelineStats.offer) },
        { name: "Orders", value: Number(pipelineStats.order) },
        { name: "Follow-ups", value: Number(pipelineStats.followup) },
      ]
    : [];

  const statusData = interactionsSummary
    ? [
        { name: "Open", value: Number(interactionsSummary.open) },
        { name: "In Progress", value: Number(interactionsSummary.inProgress) },
        { name: "Won", value: Number(interactionsSummary.won) },
        { name: "Lost", value: Number(interactionsSummary.lost) },
        { name: "Closed", value: Number(interactionsSummary.closed) },
      ].filter((d) => d.value > 0)
    : [];

  const staffVisitData = (visitCounts ?? []).map(([principal, count], i) => ({
    name: `Staff ${i + 1}`,
    visits: Number(count),
    principal: principal.toString(),
  }));

  const staffClaimsData = (claimsSummary ?? []).map(
    ([principal, summary], i) => ({
      name: `Staff ${i + 1}`,
      submitted: Number(summary.totalSubmitted),
      approved: Number(summary.totalApprovedAmount),
      principal: principal.toString(),
    }),
  );

  const pendingClaimsCount = (allClaims ?? []).filter(
    (c) => c.status === "pending",
  ).length;
  const approvedClaimsTotal = (allClaims ?? [])
    .filter((c) => c.status === "approved")
    .reduce(
      (acc, c) => acc + Number(c.travelAllowance) + Number(c.dailyAllowance),
      0,
    );

  // Expense Summary by category
  const expenseSummary = (allClaims ?? []).reduce(
    (acc, c) => {
      const cat = ((c as any).expenseCategory as string) || "Other";
      const amount = Number(c.travelAllowance) + Number(c.dailyAllowance);
      if (!acc[cat]) acc[cat] = { count: 0, total: 0 };
      acc[cat].count += 1;
      acc[cat].total += amount;
      return acc;
    },
    {} as Record<string, { count: number; total: number }>,
  );
  const expenseRows = Object.entries(expenseSummary).sort(
    (a, b) => b[1].total - a[1].total,
  );
  const expenseTotal = expenseRows.reduce((s, [, v]) => s + v.total, 0);

  // ── Monthly Summary PDF ──────────────────────────────────────────────────

  const handleGenerateMonthlySummaryPDF = () => {
    const monthVisits = (allVisits ?? []).filter((v) => {
      const d = new Date(Number(v.plannedDate / 1_000_000n));
      return d.getFullYear() === summaryYear && d.getMonth() === summaryMonth;
    });
    const monthClaims = (allClaims ?? []).filter((c) => {
      const d = new Date(Number(c.date / 1_000_000n));
      return d.getFullYear() === summaryYear && d.getMonth() === summaryMonth;
    });

    const totalPlanned = monthVisits.filter(
      (v) => v.status === "planned",
    ).length;
    const totalCompleted = monthVisits.filter(
      (v) => v.status === "completed",
    ).length;
    const totalCancelled = monthVisits.filter(
      (v) => v.status === "cancelled",
    ).length;

    const uniqueClientIds = new Set(monthVisits.map((v) => v.clientId));
    const clientsVisited = uniqueClientIds.size;

    const totalClaimsCount = monthClaims.length;
    const pendingClaimsAmt = monthClaims.filter(
      (c) => c.status === "pending",
    ).length;
    const approvedClaimsAmt = monthClaims
      .filter((c) => c.status === "approved")
      .reduce(
        (acc, c) => acc + Number(c.travelAllowance) + Number(c.dailyAllowance),
        0,
      );

    const pipelineInq = Number(pipelineStats?.inquiry ?? 0);
    const pipelineOff = Number(pipelineStats?.offer ?? 0);
    const pipelineOrd = Number(pipelineStats?.order ?? 0);
    const pipelineFu = Number(pipelineStats?.followup ?? 0);

    const genDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const monthLabel = `${MONTH_NAMES[summaryMonth]} ${summaryYear}`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Monthly Summary – Polypick Engineers Pvt Ltd</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 30px auto; color: #111; font-size: 13px; }
          .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 14px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-size: 22px; font-weight: bold; }
          .header p { margin: 4px 0; color: #555; font-size: 12px; }
          .section { margin-bottom: 24px; }
          .section h2 { font-size: 15px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-bottom: 12px; color: #222; }
          .kpi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
          .kpi-box { border: 1px solid #ddd; border-radius: 6px; padding: 10px 14px; background: #fafafa; }
          .kpi-box .label { font-size: 11px; color: #777; margin-bottom: 3px; }
          .kpi-box .value { font-size: 20px; font-weight: bold; color: #111; }
          .footer { text-align: center; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 12px; margin-top: 24px; }
          @media print { body { margin: 10px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Polypick Engineers Pvt Ltd</h1>
          <p>Monthly Summary Report – ${monthLabel}</p>
          <p>Generated: ${genDate}</p>
        </div>

        <div class="section">
          <h2>Section 1: Visit Summary</h2>
          <div class="kpi-grid">
            <div class="kpi-box"><div class="label">Total Visits</div><div class="value">${monthVisits.length}</div></div>
            <div class="kpi-box"><div class="label">Planned</div><div class="value" style="color:#d97706">${totalPlanned}</div></div>
            <div class="kpi-box"><div class="label">Completed</div><div class="value" style="color:#16a34a">${totalCompleted}</div></div>
            <div class="kpi-box"><div class="label">Cancelled</div><div class="value" style="color:#dc2626">${totalCancelled}</div></div>
            <div class="kpi-box"><div class="label">Unique Clients Visited</div><div class="value">${clientsVisited}</div></div>
          </div>
        </div>

        <div class="section">
          <h2>Section 2: TA DA Claims Summary</h2>
          <div class="kpi-grid">
            <div class="kpi-box"><div class="label">Total Claims (this month)</div><div class="value">${totalClaimsCount}</div></div>
            <div class="kpi-box"><div class="label">Pending Approval</div><div class="value" style="color:#d97706">${pendingClaimsAmt}</div></div>
            <div class="kpi-box"><div class="label">Approved Amount</div><div class="value" style="color:#16a34a">₹${approvedClaimsAmt.toLocaleString("en-IN")}</div></div>
          </div>
        </div>

        <div class="section">
          <h2>Section 3: PPI Pipeline Summary</h2>
          <div class="kpi-grid">
            <div class="kpi-box"><div class="label">Inquiries</div><div class="value">${pipelineInq}</div></div>
            <div class="kpi-box"><div class="label">Offers</div><div class="value">${pipelineOff}</div></div>
            <div class="kpi-box"><div class="label">Orders</div><div class="value">${pipelineOrd}</div></div>
            <div class="kpi-box"><div class="label">Follow-ups</div><div class="value">${pipelineFu}</div></div>
          </div>
        </div>

        <div class="footer">
          Polypick Engineers Pvt Ltd &nbsp;|&nbsp; Monthly Summary – ${monthLabel} &nbsp;|&nbsp; Generated: ${genDate}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setSummaryOpen(false);
  };

  // Year options: current year and 2 years back
  const yearOptions = [summaryYear - 2, summaryYear - 1, summaryYear].filter(
    (y) => y > 2020,
  );

  return (
    <div
      className="p-6 md:p-8 space-y-8 animate-fade-in"
      data-ocid="reports.section"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 size={24} className="text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Business performance overview
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          data-ocid="reports.monthly_summary.open_modal_button"
          onClick={() => setSummaryOpen(true)}
          className="gap-2 self-start sm:self-auto"
        >
          <FileText size={15} />
          Monthly Summary PDF
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Clients
                </p>
                {clientsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="font-display text-3xl font-bold mt-1">
                    {Number(totalClients ?? 0)}
                  </p>
                )}
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users size={18} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Pipeline Items
                </p>
                {pipelineLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="font-display text-3xl font-bold mt-1">
                    {pipelineData.reduce((a, b) => a + b.value, 0)}
                  </p>
                )}
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp size={18} className="text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Pending Claims
                </p>
                <p className="font-display text-3xl font-bold text-amber-600 mt-1">
                  {pendingClaimsCount}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Receipt size={18} className="text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Approved ₹
                </p>
                <p className="font-display text-2xl font-bold text-emerald-600 mt-1">
                  ₹{approvedClaimsTotal.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CalendarCheck size={18} className="text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">
              Pipeline by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineLoading ? (
              <Skeleton className="h-56 w-full" />
            ) : pipelineData.every((d) => d.value === 0) ? (
              <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
                No pipeline data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={pipelineData}
                  margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0.01 255)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid oklch(0.88 0.01 255)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {pipelineData.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Interaction Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">
              Interaction Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-56 w-full" />
            ) : statusData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
                No interaction data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusData.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid oklch(0.88 0.01 255)",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary PDF Dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent
          className="max-w-sm"
          data-ocid="reports.monthly_summary.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Monthly Summary PDF
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Select a month and year to generate a printable summary report.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Month</Label>
                <Select
                  value={String(summaryMonth)}
                  onValueChange={(v) => setSummaryMonth(Number(v))}
                >
                  <SelectTrigger data-ocid="reports.month.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_NAMES.map((name, idx) => (
                      <SelectItem key={name} value={String(idx)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Year</Label>
                <Select
                  value={String(summaryYear)}
                  onValueChange={(v) => setSummaryYear(Number(v))}
                >
                  <SelectTrigger data-ocid="reports.year.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="reports.monthly_summary.cancel_button"
              onClick={() => setSummaryOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="reports.monthly_summary.confirm_button"
              onClick={handleGenerateMonthlySummaryPDF}
              className="gap-2"
            >
              <FileText size={14} />
              Generate PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visits per Staff */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">
              Visits per Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visitsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : staffVisitData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No visit data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={staffVisitData}
                  margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0.01 255)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid oklch(0.88 0.01 255)",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="visits"
                    fill={CHART_COLORS[0]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Claims per Staff */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">
              Claims per Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            {claimsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : staffClaimsData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                No claims data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={staffClaimsData}
                  margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.88 0.01 255)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid oklch(0.88 0.01 255)",
                      fontSize: 12,
                    }}
                    formatter={(value, name) => [
                      name === "approved"
                        ? `₹${Number(value).toLocaleString("en-IN")}`
                        : value,
                      name === "approved"
                        ? "Approved Amount"
                        : "Total Submitted",
                    ]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Bar
                    dataKey="submitted"
                    fill={CHART_COLORS[0]}
                    radius={[4, 4, 0, 0]}
                    name="Submitted"
                  />
                  <Bar
                    dataKey="approved"
                    fill={CHART_COLORS[1]}
                    radius={[4, 4, 0, 0]}
                    name="Approved (₹)"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Summary by Category */}
      {expenseRows.length > 0 && (
        <div data-ocid="reports.expense.section">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Receipt size={16} className="text-primary" />
                Expense Summary by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Claims</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseRows.map(([cat, data], idx) => (
                    <TableRow
                      key={cat}
                      data-ocid={`reports.expense.row.${idx + 1}`}
                    >
                      <TableCell className="font-medium capitalize">
                        {cat}
                      </TableCell>
                      <TableCell className="text-center">
                        {data.count}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{data.total.toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-center">
                      {expenseRows.reduce((s, [, v]) => s + v.count, 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{expenseTotal.toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
