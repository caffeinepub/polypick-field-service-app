import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Printer,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { T } from "../backend.d";
import { StatusBadge } from "../components/StatusBadge";
import {
  useAllVisits,
  useClients,
  useIsAdmin,
  useMyVisits,
} from "../hooks/useQueries";
import { formatDate } from "../utils/dateUtils";
import { gpsToMapsURL, parseGPS } from "../utils/locationUtils";

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

function SummaryCard({
  title,
  value,
  icon,
  color,
  loading,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">{title}</p>
            {loading ? (
              <Skeleton className="h-7 w-14 mt-0.5" />
            ) : (
              <p className="font-display text-2xl font-bold text-foreground mt-0.5">
                {value}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MarketingReportPage() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const { data: isAdmin } = useIsAdmin();
  const { data: allVisits, isLoading: allLoading } = useAllVisits();
  const { data: myVisits, isLoading: myLoading } = useMyVisits();
  const { data: clients } = useClients();

  const visits = isAdmin ? (allVisits ?? []) : (myVisits ?? []);
  const isLoading = isAdmin ? allLoading : myLoading;

  const getClientName = (id: bigint) =>
    clients?.find((c) => c.id === id)?.name ?? `Client #${id}`;

  // Navigate months
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isCurrentMonth =
    viewMonth === now.getMonth() && viewYear === now.getFullYear();

  // Filter to selected month
  const monthVisits = useMemo(() => {
    return visits.filter((v) => {
      const d = new Date(Number(v.plannedDate / 1_000_000n));
      return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
    });
  }, [visits, viewMonth, viewYear]);

  // Summary stats
  const totalVisits = monthVisits.length;
  const uniqueClients = new Set(monthVisits.map((v) => v.clientId.toString()))
    .size;
  const completedVisits = monthVisits.filter(
    (v) => v.status === "completed",
  ).length;
  const plannedVisits = monthVisits.filter(
    (v) => v.status === "planned",
  ).length;

  // Group by date for daily log
  const visitsByDate = useMemo(() => {
    const map = new Map<string, T[]>();
    for (const v of monthVisits) {
      const d = new Date(Number(v.plannedDate / 1_000_000n));
      const key = d.toISOString().slice(0, 10);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, v]);
    }
    // Sort by date descending
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [monthVisits]);

  // Client visit summary
  const clientSummary = useMemo(() => {
    const map = new Map<
      string,
      {
        clientId: bigint;
        count: number;
        lastVisit: bigint;
        completed: number;
        planned: number;
      }
    >();
    for (const v of monthVisits) {
      const key = v.clientId.toString();
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          clientId: v.clientId,
          count: 1,
          lastVisit: v.plannedDate,
          completed: v.status === "completed" ? 1 : 0,
          planned: v.status === "planned" ? 1 : 0,
        });
      } else {
        existing.count += 1;
        if (v.plannedDate > existing.lastVisit)
          existing.lastVisit = v.plannedDate;
        if (v.status === "completed") existing.completed += 1;
        if (v.status === "planned") existing.planned += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [monthVisits]);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp size={24} className="text-primary" />
            Marketing Monthly Report
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isAdmin
              ? "All staff field visit activity report"
              : "Your field visit activity report"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 self-start"
          onClick={() => window.print()}
          data-ocid="marketing.print.button"
        >
          <Printer size={14} />
          Print Report
        </Button>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center gap-3 bg-muted/30 border border-border rounded-lg px-4 py-3 self-start w-fit">
        <button
          type="button"
          data-ocid="marketing.prev_month.button"
          onClick={prevMonth}
          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="text-center min-w-[140px]">
          <p className="font-display font-semibold text-foreground">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </p>
          {isCurrentMonth && (
            <span className="text-[10px] text-primary font-medium">
              Current Month
            </span>
          )}
        </div>
        <button
          type="button"
          data-ocid="marketing.next_month.button"
          onClick={nextMonth}
          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Visits"
          value={totalVisits}
          icon={<CalendarCheck size={18} className="text-blue-700" />}
          color="bg-blue-50"
          loading={isLoading}
        />
        <SummaryCard
          title="Unique Clients"
          value={uniqueClients}
          icon={<Users size={18} className="text-purple-700" />}
          color="bg-purple-50"
          loading={isLoading}
        />
        <SummaryCard
          title="Completed"
          value={completedVisits}
          icon={<CheckCircle2 size={18} className="text-emerald-700" />}
          color="bg-emerald-50"
          loading={isLoading}
        />
        <SummaryCard
          title="Planned"
          value={plannedVisits}
          icon={<Clock size={18} className="text-amber-700" />}
          color="bg-amber-50"
          loading={isLoading}
        />
      </div>

      {/* Daily Visit Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <CalendarCheck size={16} className="text-primary" />
            Daily Visit Log
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <Skeleton key={`sk-${i}`} className="h-12 w-full" />
              ))}
            </div>
          ) : visitsByDate.length === 0 ? (
            <div
              data-ocid="marketing.daily_log.empty_state"
              className="text-center py-10 text-muted-foreground"
            >
              <CalendarCheck size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No visits recorded this month</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visitsByDate.map(([dateKey, dayVisits]) => {
                const dateDisplay = new Date(dateKey).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                );
                return (
                  <div key={dateKey}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {dateDisplay}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {dayVisits.length} visit
                        {dayVisits.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/20">
                            <TableHead className="font-semibold text-xs h-8">
                              Client
                            </TableHead>
                            <TableHead className="font-semibold text-xs h-8 hidden md:table-cell">
                              Purpose
                            </TableHead>
                            <TableHead className="font-semibold text-xs h-8">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-xs h-8 w-16">
                              GPS
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dayVisits.map((v, idx) => {
                            const gps =
                              parseGPS(v.completionNotes || "") ||
                              parseGPS(v.purpose || "");
                            const purposeClean = (v.purpose || "—").replace(
                              /\[GPS:[^\]]+\]\s*/,
                              "",
                            );
                            return (
                              <TableRow
                                key={v.id.toString()}
                                data-ocid={`marketing.visit.item.${idx + 1}`}
                                className="hover:bg-muted/10"
                              >
                                <TableCell className="text-sm font-medium py-2">
                                  {getClientName(v.clientId)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-xs text-muted-foreground py-2 max-w-[200px] truncate">
                                  {purposeClean}
                                </TableCell>
                                <TableCell className="py-2">
                                  <StatusBadge status={v.status} />
                                </TableCell>
                                <TableCell className="py-2">
                                  {gps ? (
                                    <a
                                      href={gpsToMapsURL(gps.lat, gps.lng)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:text-primary/70 transition-colors flex items-center gap-0.5 text-xs"
                                      title={`${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}`}
                                    >
                                      <MapPin size={12} />
                                      Map
                                    </a>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      —
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Visit Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            Client Visit Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {clientSummary.length === 0 ? (
            <div
              data-ocid="marketing.client_summary.empty_state"
              className="text-center py-10 text-muted-foreground"
            >
              <Users size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No client visits this month</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table data-ocid="marketing.client_summary.table">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Client Name</TableHead>
                    <TableHead className="font-semibold text-center">
                      Total Visits
                    </TableHead>
                    <TableHead className="font-semibold text-center hidden sm:table-cell">
                      Completed
                    </TableHead>
                    <TableHead className="font-semibold text-center hidden sm:table-cell">
                      Planned
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Last Visit
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientSummary.map((row, idx) => (
                    <TableRow
                      key={row.clientId.toString()}
                      data-ocid={`marketing.client.item.${idx + 1}`}
                      className="hover:bg-muted/20"
                    >
                      <TableCell className="font-medium">
                        {getClientName(row.clientId)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {row.count}
                        </span>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        <span className="text-emerald-600 font-medium text-sm">
                          {row.completed}
                        </span>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        <span className="text-amber-600 font-medium text-sm">
                          {row.planned}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatDate(row.lastVisit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Print hint */}
      <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground print:hidden">
        <p className="flex items-center gap-2">
          <Printer size={14} />
          Use the Print button to export this report as PDF or paper copy.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => window.print()}
          data-ocid="marketing.print_bottom.button"
        >
          <Printer size={12} />
          Print
        </Button>
      </div>

      {/* Footer */}
      <footer className="pt-4 border-t border-border print:hidden">
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
