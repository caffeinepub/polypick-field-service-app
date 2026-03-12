import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileBarChart2,
} from "lucide-react";
import { useState } from "react";

function getWeekStart(offset = 0): Date {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = d.getDate() - day + 1 + offset * 7; // Mon
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}

function getDaysOfWeek(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatWeekLabel(start: Date) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${start.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString("en-IN", { ...opts, year: "numeric" })}`;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyReportPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = getWeekStart(weekOffset);
  const days = getDaysOfWeek(weekStart);

  // Read localStorage data
  const visits: { date?: string; createdAt?: string }[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_visits") ?? "[]");
    } catch {
      return [];
    }
  })();

  const interactions: { createdAt?: string; date?: string }[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_interactions") ?? "[]");
    } catch {
      return [];
    }
  })();

  const tadaClaims: { date?: string; createdAt?: string }[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_tada_claims") ?? "[]");
    } catch {
      return [];
    }
  })();

  const clients: unknown[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("polypick_clients") ?? "[]");
    } catch {
      return [];
    }
  })();

  const activityEntries: { date?: string; createdAt?: string }[] = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("polypick_activity_entries") ?? "[]",
      );
    } catch {
      return [];
    }
  })();

  function countInWeek(
    items: { date?: string; createdAt?: string }[],
    day?: Date,
  ): number {
    return items.filter((item) => {
      const raw = item.date ?? item.createdAt ?? "";
      if (!raw) return false;
      const d = new Date(raw);
      if (day) return isSameDay(d, day);
      return d >= weekStart && d < new Date(weekStart.getTime() + 7 * 86400000);
    }).length;
  }

  const totalVisits = countInWeek(visits);
  const totalInteractions = countInWeek(interactions);
  const totalTada = countInWeek(tadaClaims);
  const totalClients = clients.length;
  const totalActivity = countInWeek(activityEntries);

  const summaryCards = [
    { label: "Visits This Week", value: totalVisits, color: "text-blue-600" },
    {
      label: "PPI Entries",
      value: totalInteractions,
      color: "text-indigo-600",
    },
    { label: "TA DA Claims", value: totalTada, color: "text-amber-600" },
    { label: "Total Clients", value: totalClients, color: "text-green-600" },
    {
      label: "Activity Entries",
      value: totalActivity,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
            <FileBarChart2 size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Weekly Report
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatWeekLabel(weekStart)}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          data-ocid="weekly_report.download.button"
        >
          <Download size={14} className="mr-1.5" />
          PDF
        </Button>
      </div>

      {/* Week Navigator */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setWeekOffset((o) => o - 1)}
          data-ocid="weekly_report.pagination_prev"
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-sm font-medium flex-1 text-center">
          {weekOffset === 0
            ? "This Week"
            : weekOffset === -1
              ? "Last Week"
              : formatWeekLabel(weekStart)}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
          disabled={weekOffset === 0}
          data-ocid="weekly_report.pagination_next"
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="py-4 px-4">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p
                className={`text-2xl font-bold font-display mt-1 ${card.color}`}
              >
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">
            Daily Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead className="text-right">Visits</TableHead>
                <TableHead className="text-right">PPI</TableHead>
                <TableHead className="text-right">Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((day, i) => {
                const dayVisits = countInWeek(visits, day);
                const dayPpi = countInWeek(interactions, day);
                const dayActivity = countInWeek(activityEntries, day);
                const isToday = isSameDay(day, new Date());
                return (
                  <TableRow
                    key={DAY_LABELS[i]}
                    className={isToday ? "bg-primary/5" : ""}
                    data-ocid={`weekly_report.row.${i + 1}`}
                  >
                    <TableCell>
                      <span className="font-medium">{DAY_LABELS[i]}</span>
                      {isToday && (
                        <Badge
                          variant="secondary"
                          className="ml-2 text-[10px] h-4"
                        >
                          Today
                        </Badge>
                      )}
                      <span className="block text-xs text-muted-foreground">
                        {day.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {dayVisits > 0 ? (
                        <Badge variant="secondary">{dayVisits}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayPpi > 0 ? (
                        <Badge variant="secondary">{dayPpi}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {dayActivity > 0 ? (
                        <Badge variant="secondary">{dayActivity}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Week Date Range */}
      <p className="text-xs text-center text-muted-foreground">
        Report generated: {new Date().toLocaleString("en-IN")}
      </p>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .weekly-report-print, .weekly-report-print * { visibility: visible; }
          .weekly-report-print { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
