import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
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
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
  href: string;
  color: string;
}) {
  return (
    <Link to={href}>
      <Card className="hover:shadow-elevated transition-shadow cursor-pointer group">
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

export default function DashboardPage() {
  const { data: isAdmin } = useIsAdmin();
  const { data: profile } = useUserProfile();
  const { data: totalClients, isLoading: clientsLoading } =
    useTotalClientsCount();
  const { data: pipelineStats, isLoading: pipelineLoading } =
    usePipelineStats();
  const { data: allClaims } = useAllClaims();
  const { data: allVisits } = useAllVisits();
  const { data: myVisits } = useMyVisits();
  const { data: myClaims } = useMyClaims();

  const pendingClaims =
    (isAdmin ? allClaims : myClaims)?.filter((c) => c.status === "pending") ??
    [];

  const todayVisits =
    (isAdmin ? allVisits : myVisits)?.filter((v) => {
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
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
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
            title="Pipeline Items"
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

      {/* Quick actions + recent */}
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
              <ul className="space-y-2">
                {todayVisits.slice(0, 5).map((v, i) => (
                  <li
                    key={v.id.toString()}
                    data-ocid={`visits.item.${i + 1}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {v.purpose}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(v.plannedDate)}
                      </p>
                    </div>
                    <StatusBadge status={v.status} />
                  </li>
                ))}
              </ul>
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

      {/* Quick Links */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              label: "Add Client",
              href: "/clients",
              icon: <Users size={20} />,
            },
            {
              label: "Add Interaction",
              href: "/interactions",
              icon: <MessageSquare size={20} />,
            },
            {
              label: "Submit Claim",
              href: "/tada",
              icon: <Receipt size={20} />,
            },
            {
              label: "Plan Visit",
              href: "/visits",
              icon: <CalendarCheck size={20} />,
            },
            {
              label: "Marketing Report",
              href: "/marketing-report",
              icon: <TrendingUp size={20} />,
            },
          ].map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="hover:shadow-elevated transition-shadow cursor-pointer group">
                <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2 text-center">
                  <span className="text-primary group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {item.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
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
