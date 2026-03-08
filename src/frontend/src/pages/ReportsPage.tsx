import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  CalendarCheck,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
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
  useClaimsSummaryPerStaff,
  useInteractionsSummary,
  usePipelineStats,
  useTotalClientsCount,
  useVisitLogsCountPerStaff,
} from "../hooks/useQueries";

const CHART_COLORS = [
  "oklch(0.55 0.18 265)",
  "oklch(0.72 0.15 155)",
  "oklch(0.75 0.17 85)",
  "oklch(0.62 0.20 30)",
  "oklch(0.48 0.16 310)",
];

export default function ReportsPage() {
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

  return (
    <div
      className="p-6 md:p-8 space-y-8 animate-fade-in"
      data-ocid="reports.section"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 size={24} className="text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Business performance overview
        </p>
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
    </div>
  );
}
