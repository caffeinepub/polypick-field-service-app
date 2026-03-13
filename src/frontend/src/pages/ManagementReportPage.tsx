import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BarChart2,
  Briefcase,
  CheckCircle2,
  Clock,
  Printer,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function ManagementReportPage() {
  const today = new Date();
  const [month, setMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
  );

  const reportData = useMemo(() => {
    // Read from localStorage sources
    const visits: Array<{ date?: string; status?: string }> = (() => {
      try {
        return JSON.parse(localStorage.getItem("polypick_visits") ?? "[]");
      } catch {
        return [];
      }
    })();

    const clients: Array<{ createdAt?: string }> = (() => {
      try {
        return JSON.parse(localStorage.getItem("polypick_clients") ?? "[]");
      } catch {
        return [];
      }
    })();

    const ppiEntries: Array<{ createdAt?: string; updatedAt?: string }> =
      (() => {
        try {
          return JSON.parse(localStorage.getItem("polypick_ppi") ?? "[]");
        } catch {
          return [];
        }
      })();

    const claims: Array<{ createdAt?: string; status?: string }> = (() => {
      try {
        return JSON.parse(localStorage.getItem("polypick_claims") ?? "[]");
      } catch {
        return [];
      }
    })();

    const activityEntries: Array<{ date?: string; stage?: string }> = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("polypick_activity_tracker") ?? "[]",
        );
      } catch {
        return [];
      }
    })();

    const tickets: Array<{ createdAt?: string; status?: string }> = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("polypick_service_tickets") ?? "[]",
        );
      } catch {
        return [];
      }
    })();

    const inMonth = (dateStr?: string) => {
      if (!dateStr) return false;
      return dateStr.startsWith(month);
    };

    const totalVisits = visits.filter((v) => inMonth(v.date)).length;
    const completedVisits = visits.filter(
      (v) => inMonth(v.date) && v.status === "Completed",
    ).length;
    const newClients = clients.filter((c) => inMonth(c.createdAt)).length;
    const ppiCount = ppiEntries.filter(
      (p) => inMonth(p.createdAt) || inMonth(p.updatedAt),
    ).length;
    const claimsSubmitted = claims.filter((c) => inMonth(c.createdAt)).length;
    const claimsApproved = claims.filter(
      (c) => inMonth(c.createdAt) && c.status === "approved",
    ).length;
    const activityCount = activityEntries.filter((a) => inMonth(a.date)).length;
    const openTickets = tickets.filter(
      (t) => inMonth(t.createdAt) && t.status !== "Closed",
    ).length;

    return {
      totalVisits,
      completedVisits,
      newClients,
      ppiCount,
      claimsSubmitted,
      claimsApproved,
      activityCount,
      openTickets,
    };
  }, [month]);

  const [y, m] = month.split("-");
  const monthLabel = new Date(Number(y), Number(m) - 1, 1).toLocaleString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div
      className="p-4 pb-24 max-w-2xl mx-auto space-y-4"
      id="mgmt-report-print"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Management Report</h1>
          <p className="text-sm text-muted-foreground">
            Monthly summary for management
          </p>
        </div>
        <Button
          data-ocid="mgmt.primary_button"
          size="sm"
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer size={14} className="mr-1" /> Print / PDF
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <input
          data-ocid="mgmt.input"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-border rounded-md px-3 py-1.5 text-sm bg-background text-foreground"
        />
        <span className="text-sm font-medium text-muted-foreground">
          {monthLabel}
        </span>
      </div>

      <Card className="print:shadow-none">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 size={16} /> Monthly Summary — {monthLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reportData.totalVisits}</p>
              <p className="text-xs text-muted-foreground">Total Visits</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reportData.completedVisits}</p>
              <p className="text-xs text-muted-foreground">Completed Visits</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Briefcase size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reportData.newClients}</p>
              <p className="text-xs text-muted-foreground">New Clients</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <BarChart2 size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reportData.ppiCount}</p>
              <p className="text-xs text-muted-foreground">PPI Entries</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reportData.claimsSubmitted}</p>
              <p className="text-xs text-muted-foreground">Claims Submitted</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reportData.claimsApproved}</p>
              <p className="text-xs text-muted-foreground">Claims Approved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="print:shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Additional Metrics</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Activity Tracker Entries
            </span>
            <span className="font-semibold">{reportData.activityCount}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Open Service Tickets</span>
            <span className="font-semibold">{reportData.openTickets}</span>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center print:block hidden">
        Generated by Polypick Engineers Field Service App —{" "}
        {new Date().toLocaleDateString("en-IN")}
      </p>
    </div>
  );
}
