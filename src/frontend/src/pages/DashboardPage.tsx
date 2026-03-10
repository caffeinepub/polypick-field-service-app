import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  GitBranch,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import {
  useAllClaims,
  useAllVisits,
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

// Quick action card — large, icon-forward, mobile-friendly
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

export default function DashboardPage() {
  const { data: isAdmin, isSuccess: isAdminResolved } = useIsAdmin();
  const { data: profile } = useUserProfile();
  const { data: totalClients, isLoading: clientsLoading } =
    useTotalClientsCount();
  const { data: pipelineStats, isLoading: pipelineLoading } =
    usePipelineStats();

  // Only fetch the relevant dataset once isAdmin is known — avoids double fetching
  const { data: allClaims } = useAllClaims(isAdminResolved && isAdmin === true);
  const { data: allVisits } = useAllVisits(isAdminResolved && isAdmin === true);
  const { data: myVisits } = useMyVisits(isAdminResolved && isAdmin === false);
  const { data: myClaims } = useMyClaims(isAdminResolved && isAdmin === false);

  const activeClaims = isAdmin ? allClaims : myClaims;
  const activeVisits = isAdmin ? allVisits : myVisits;

  const pendingClaims =
    activeClaims?.filter((c) => c.status === "pending") ?? [];

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
