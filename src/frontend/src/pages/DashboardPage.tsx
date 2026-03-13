import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock,
  GitBranch,
  LayoutDashboard,
  Receipt,
  Search,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatusBadge } from "../components/StatusBadge";
import {
  useAllClaims,
  useAllVisits,
  useClients,
  useInteractions,
  useIsAdmin,
  useMyClaims,
  useMyVisits,
  usePipelineStats,
  useTotalClientsCount,
  useUserProfile,
} from "../hooks/useQueries";
import { formatDate } from "../utils/dateUtils";

function StatCard({
  title,
  value,
  icon,
  loading,
  href,
  color,
  badgeCount,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
  href: string;
  color: string;
  badgeCount?: number;
}) {
  return (
    <Link to={href}>
      <Card className="hover:shadow-elevated transition-shadow cursor-pointer group relative overflow-hidden">
        {badgeCount && badgeCount > 0 ? (
          <span className="absolute top-2 right-2 inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold z-10">
            {badgeCount}
          </span>
        ) : null}
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="font-display text-3xl font-bold text-foreground mt-1">
                  {value}
                </p>
              )}
            </div>
            <div
              className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}
            >
              {icon}
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors">
            <span>View all</span>
            <ArrowRight size={12} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickActionCard({
  label,
  href,
  icon,
  description,
  accent,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  accent: string;
}) {
  return (
    <Link to={href}>
      <Card
        className={`hover:shadow-elevated transition-all cursor-pointer group border-l-4 ${accent}`}
      >
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors text-primary">
              {icon}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">
                {label}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {description}
              </p>
            </div>
            <ArrowRight
              size={14}
              className="flex-shrink-0 ml-auto text-muted-foreground group-hover:text-primary transition-colors"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

type SearchResult = {
  type: "client" | "ppi" | "visit";
  label: string;
  sub: string;
  href: string;
};

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: clients } = useClients();
  const { data: interactions } = useInteractions();
  const { data: allVisits } = useAllVisits();
  const { data: myVisits } = useMyVisits();

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const out: SearchResult[] = [];

    // Clients
    const clientMatches = (clients ?? []).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
    for (const c of clientMatches.slice(0, 5)) {
      out.push({
        type: "client",
        label: c.name,
        sub: c.company || "Client",
        href: `/clients/${c.id.toString()}`,
      });
    }

    // PPI interactions
    const visits = allVisits ?? myVisits ?? [];
    const clientNameMap = new Map(
      (clients ?? []).map((c) => [c.id.toString(), c.name]),
    );
    const intMatches = (interactions ?? []).filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (clientNameMap.get(i.clientId.toString()) ?? "")
          .toLowerCase()
          .includes(q),
    );
    for (const i of intMatches.slice(0, 5)) {
      out.push({
        type: "ppi",
        label: i.title,
        sub: clientNameMap.get(i.clientId.toString())
          ? `${clientNameMap.get(i.clientId.toString())} · ${i.type}`
          : i.type,
        href: "/interactions",
      });
    }

    // Visits
    const visitMatches = visits.filter((v) => {
      const clientName = clientNameMap.get(v.clientId.toString()) ?? "";
      return (
        v.purpose.toLowerCase().includes(q) ||
        clientName.toLowerCase().includes(q)
      );
    });
    for (const v of visitMatches.slice(0, 5)) {
      out.push({
        type: "visit",
        label: clientNameMap.get(v.clientId.toString()) ?? "Visit",
        sub: formatDate(v.plannedDate),
        href: "/visits",
      });
    }

    setResults(out);
    setOpen(out.length > 0);
  }, [query, clients, interactions, allVisits, myVisits]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const typeIcons: Record<string, React.ReactNode> = {
    client: <Users size={13} />,
    ppi: <GitBranch size={13} />,
    visit: <CalendarCheck size={13} />,
  };
  const typeBg: Record<string, string> = {
    client: "bg-blue-50 text-blue-700",
    ppi: "bg-emerald-50 text-emerald-700",
    visit: "bg-purple-50 text-purple-700",
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          data-ocid="dashboard.search_input"
          type="text"
          placeholder="Search clients, PPI entries, visits..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="pl-9 bg-background"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
          {results.map((r, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: search results
              key={i}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-0"
              onClick={() => {
                setOpen(false);
                setQuery("");
                navigate({ to: r.href });
              }}
            >
              <span
                className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 ${typeBg[r.type]}`}
              >
                {typeIcons[r.type]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-foreground">
                  {r.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {r.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: isAdmin, isSuccess: isAdminResolved } = useIsAdmin();
  const { data: profile } = useUserProfile();
  const { data: totalClients, isLoading: clientsLoading } =
    useTotalClientsCount();
  const { data: pipelineStats, isLoading: pipelineLoading } =
    usePipelineStats();

  const { data: allClaims } = useAllClaims(isAdminResolved && isAdmin === true);
  const { data: allVisits } = useAllVisits(isAdminResolved && isAdmin === true);
  const { data: myVisits } = useMyVisits(isAdminResolved && isAdmin === false);
  const { data: myClaims } = useMyClaims(isAdminResolved && isAdmin === false);

  const activeClaims = isAdmin ? allClaims : myClaims;
  const activeVisits = isAdmin ? allVisits : myVisits;

  const pendingClaims =
    activeClaims?.filter((c) => c.status === "pending") ?? [];

  // Overdue PPI: entries older than 15 days with no update
  const now = new Date();
  const { data: allInteractions } = useInteractions();
  const overdueFollowups = (allInteractions ?? []).filter((i) => {
    if (i.status === "won" || i.status === "lost" || i.status === "closed")
      return false;
    const created = new Date(Number(i.date / 1_000_000n));
    const diffDays =
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 15;
  });

  const todayVisits =
    activeVisits?.filter((v) => {
      const visitDate = new Date(Number(v.plannedDate / 1_000_000n));
      const today = new Date();
      return (
        visitDate.getFullYear() === today.getFullYear() &&
        visitDate.getMonth() === today.getMonth() &&
        visitDate.getDate() === today.getDate()
      );
    }) ?? [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {greeting()}, {profile?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? "Administrator Dashboard" : "Field Staff Dashboard"} •{" "}
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Global Search */}
      <GlobalSearch />

      {/* Smart Notifications Banner */}
      {(() => {
        const chips: { label: string; color: string; icon: React.ReactNode }[] =
          [];
        if (todayVisits.length > 0) {
          chips.push({
            label: `Aaj ${todayVisits.length} visit${todayVisits.length !== 1 ? "s" : ""} planned`,
            color: "bg-amber-50 border-amber-200 text-amber-800",
            icon: <CalendarCheck size={13} />,
          });
        }
        if (isAdmin && pendingClaims.length > 0) {
          chips.push({
            label: `${pendingClaims.length} TA DA pending approval`,
            color: "bg-red-50 border-red-200 text-red-800",
            icon: <Receipt size={13} />,
          });
        }
        if (overdueFollowups.length > 0) {
          chips.push({
            label: `${overdueFollowups.length} follow-up${overdueFollowups.length !== 1 ? "s" : ""} overdue`,
            color: "bg-orange-50 border-orange-200 text-orange-800",
            icon: <AlertTriangle size={13} />,
          });
        }
        if (chips.length === 0) return null;
        return (
          <div
            data-ocid="dashboard.notifications.section"
            className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
          >
            {chips.map((chip) => (
              <div
                key={chip.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap flex-shrink-0 ${chip.color}`}
              >
                {chip.icon}
                {chip.label}
              </div>
            ))}
          </div>
        );
      })()}

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <LayoutDashboard size={16} className="text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <QuickActionCard
            label="Plan New Visit"
            href="/visits"
            icon={<CalendarCheck size={20} />}
            description="Schedule a client visit"
            accent="border-l-purple-400"
          />
          <QuickActionCard
            label="Submit TA DA Claim"
            href="/tada"
            icon={<Receipt size={20} />}
            description="Travel & daily allowance"
            accent="border-l-amber-400"
          />
          <QuickActionCard
            label="Add Client"
            href="/clients"
            icon={<Users size={20} />}
            description="Register a new client"
            accent="border-l-blue-400"
          />
          <QuickActionCard
            label="Add PPI Entry"
            href="/interactions"
            icon={<GitBranch size={20} />}
            description="Inquiry, offer, or order"
            accent="border-l-emerald-400"
          />
        </div>
      </div>

      {/* Stats Grid */}
      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Clients"
            value={clientsLoading ? "…" : Number(totalClients ?? 0)}
            icon={<Users size={22} className="text-blue-700" />}
            loading={clientsLoading}
            href="/clients"
            color="bg-blue-50"
          />
          <StatCard
            title="PPI Pipeline"
            value={
              pipelineLoading
                ? "…"
                : Number(
                    (pipelineStats?.inquiry ?? 0n) +
                      (pipelineStats?.offer ?? 0n) +
                      (pipelineStats?.order ?? 0n) +
                      (pipelineStats?.followup ?? 0n),
                  )
            }
            icon={<TrendingUp size={22} className="text-emerald-700" />}
            loading={pipelineLoading}
            href="/interactions"
            color="bg-emerald-50"
          />
          <StatCard
            title="Pending TA DA"
            value={pendingClaims.length}
            icon={<Receipt size={22} className="text-amber-700" />}
            href="/tada"
            color="bg-amber-50"
            badgeCount={pendingClaims.length}
          />
          <StatCard
            title="Today's Visits"
            value={todayVisits.length}
            icon={<CalendarCheck size={22} className="text-purple-700" />}
            href="/visits"
            color="bg-purple-50"
          />
          <StatCard
            title="Open Service Tickets"
            value={
              (allInteractions ?? []).filter(
                (i) =>
                  i.type === "service" &&
                  i.status !== "closed" &&
                  i.status !== "won",
              ).length
            }
            icon={<Ticket size={22} className="text-rose-700" />}
            href="/service-tickets"
            color="bg-rose-50"
          />
          <StatCard
            title="Overdue Follow-ups"
            value={overdueFollowups.length}
            icon={<Bell size={22} className="text-orange-700" />}
            href="/interactions"
            color="bg-orange-50"
            badgeCount={overdueFollowups.length}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="My Today's Visits"
            value={todayVisits.length}
            icon={<CalendarCheck size={22} className="text-purple-700" />}
            href="/visits"
            color="bg-purple-50"
          />
          <StatCard
            title="My Pending Claims"
            value={pendingClaims.length}
            icon={<Receipt size={22} className="text-amber-700" />}
            href="/tada"
            color="bg-amber-50"
          />
        </div>
      )}

      {/* Monthly KPI Chart */}
      <div>
        <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          Monthly Performance
        </h2>
        <Card>
          <CardContent className="pt-4">
            {(() => {
              const months: {
                month: string;
                Visits: number;
                PPI: number;
                Claims: number;
              }[] = [];
              const n = new Date();
              for (let i = 5; i >= 0; i--) {
                const d = new Date(n.getFullYear(), n.getMonth() - i, 1);
                const label = d.toLocaleDateString("en-IN", { month: "short" });
                const m = d.getMonth();
                const y = d.getFullYear();
                const visits = (activeVisits ?? []).filter((v) => {
                  const vd = new Date(Number(v.plannedDate / 1_000_000n));
                  return (
                    vd.getMonth() === m &&
                    vd.getFullYear() === y &&
                    v.status === "completed"
                  );
                }).length;
                const ppis = (allInteractions ?? []).filter((int) => {
                  const id = new Date(Number(int.date / 1_000_000n));
                  return id.getMonth() === m && id.getFullYear() === y;
                }).length;
                const claims = (activeClaims ?? []).filter((c) => {
                  const cd = new Date(Number(c.submittedAt / 1_000_000n));
                  return cd.getMonth() === m && cd.getFullYear() === y;
                }).length;
                months.push({
                  month: label,
                  Visits: visits,
                  PPI: ppis,
                  Claims: claims,
                });
              }
              return (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={months}
                    margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.88 0.01 255)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
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
                      dataKey="Visits"
                      fill="oklch(0.55 0.18 260)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="PPI"
                      fill="oklch(0.6 0.16 150)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Claims"
                      fill="oklch(0.7 0.15 70)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
            <div className="flex gap-4 mt-2 justify-center">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ background: "oklch(0.55 0.18 260)" }}
                />
                Visits
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ background: "oklch(0.6 0.16 150)" }}
                />
                PPI
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ background: "oklch(0.7 0.15 70)" }}
                />
                Claims
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Visits + Pending Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Visits */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <CalendarCheck size={16} className="text-primary" />
                Today's Visits
              </CardTitle>
              <Link to="/visits">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {todayVisits.length === 0 ? (
              <div
                data-ocid="visits.empty_state"
                className="text-center py-8 text-muted-foreground"
              >
                <CalendarCheck size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No visits planned for today</p>
                <Link to="/visits">
                  <Button size="sm" variant="outline" className="mt-3">
                    Plan a visit
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {(() => {
                  const plannedTodayCount = todayVisits.filter(
                    (v) => v.status === "planned",
                  ).length;
                  return plannedTodayCount > 0 ? (
                    <div
                      data-ocid="visits.action_needed.card"
                      className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium"
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                      Action needed: {plannedTodayCount} visit
                      {plannedTodayCount !== 1 ? "s" : ""} planned today
                    </div>
                  ) : null;
                })()}
                <ul className="space-y-2">
                  {todayVisits.slice(0, 5).map((v, i) => (
                    <li
                      key={v.id.toString()}
                      data-ocid={`visits.item.${i + 1}`}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {v.purpose.replace(/\[GPS:[^\]]+\]\s*/, "")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(v.plannedDate)}
                        </p>
                      </div>
                      <StatusBadge status={v.status} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Claims */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                {isAdmin ? "Pending TA DA Claims" : "My Recent Claims"}
                {pendingClaims.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-[10px] h-4 px-1.5 ml-1"
                  >
                    {pendingClaims.length}
                  </Badge>
                )}
              </CardTitle>
              <Link to="/tada">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {pendingClaims.length === 0 ? (
              <div
                data-ocid="tada.empty_state"
                className="text-center py-8 text-muted-foreground"
              >
                <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No pending claims</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {pendingClaims.slice(0, 5).map((c, i) => (
                  <li
                    key={c.id.toString()}
                    data-ocid={`tada.item.${i + 1}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {c.locationsVisited || "Claim"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        TA: ₹{Number(c.travelAllowance)} • DA: ₹
                        {Number(c.dailyAllowance)}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
