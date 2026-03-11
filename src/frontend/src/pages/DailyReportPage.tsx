import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  ExternalLink,
  FileDown,
  FileText,
  Loader2,
  Send,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useClients, useIsAdmin, useUserProfile } from "../hooks/useQueries";

// ── Types ──────────────────────────────────────────────────────────────────────

interface DailyReport {
  id: string;
  date: string;
  staffName: string;
  principalId: string;
  reportText: string;
  linkedClientIds: string[];
  pendingActions: string;
  submittedAt: string;
}

const STORAGE_KEY = "daily_reports";

function loadReports(): DailyReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DailyReport[];
  } catch {
    return [];
  }
}

function saveReports(reports: DailyReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── PDF print helper ─────────────────────────────────────────────────────────

function printDailyReportsPDF(
  reports: DailyReport[],
  clientMap: Map<string, string>,
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const sections = reports
    .map((r) => {
      const linkedNames = r.linkedClientIds
        .map((id) => clientMap.get(id))
        .filter(Boolean)
        .join(", ");
      const reportDate = new Date(r.date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `
      <div class="report">
        <div class="report-header">
          <strong>${reportDate}</strong> &nbsp;–&nbsp; ${r.staffName}
          ${linkedNames ? `<span class="clients"> | Clients: ${linkedNames}</span>` : ""}
        </div>
        <div class="report-body">${r.reportText.replace(/\n/g, "<br>")}</div>
        ${r.pendingActions?.trim() ? `<div class="pending"><strong>Pending Actions:</strong><br>${r.pendingActions.replace(/\n/g, "<br>")}</div>` : ""}
      </div>`;
    })
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Daily Field Reports – Polypick Engineers Pvt Ltd</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 780px; margin: 30px auto; color: #111; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 3px 0; color: #555; font-size: 12px; }
        .report { margin-bottom: 18px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
        .report-header { background: #f5f5f5; padding: 8px 12px; font-size: 12px; border-bottom: 1px solid #ddd; }
        .clients { color: #555; }
        .report-body { padding: 10px 12px; font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
        .pending { padding: 8px 12px; background: #fffbeb; border-top: 1px solid #fde68a; font-size: 11px; color: #92400e; }
        @media print { body { margin: 10px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Polypick Engineers Pvt Ltd</h1>
        <p>Daily Field Reports</p>
        <p>Generated: ${date} &nbsp;|&nbsp; Total Reports: ${reports.length}</p>
      </div>
      ${sections}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ReportCard({
  report,
  clientMap,
  index,
}: {
  report: DailyReport;
  clientMap: Map<string, string>;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const linkedNames = report.linkedClientIds
    .map((id) => clientMap.get(id))
    .filter(Boolean) as string[];

  const truncated = report.reportText.length > 200 && !expanded;

  return (
    <Card
      data-ocid={`daily_report.item.${index + 1}`}
      className="border-border/60 hover:border-border transition-colors"
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              {formatDisplayDate(report.date)}
            </CardTitle>
            <div className="flex items-center gap-1.5 mt-1">
              <User size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {report.staffName}
              </span>
              <span className="text-xs text-muted-foreground/50 ml-1">
                ·{" "}
                {new Date(report.submittedAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {linkedNames.length > 0 && (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {report.linkedClientIds.slice(0, 3).map((id) => {
                const name = clientMap.get(id);
                if (!name) return null;
                return (
                  <button
                    type="button"
                    key={id}
                    data-ocid="daily_report.client_link"
                    onClick={() => navigate({ to: "/clients" })}
                    className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {name}
                    <ExternalLink size={8} />
                  </button>
                );
              })}
              {linkedNames.length > 3 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  +{linkedNames.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Report text */}
        <div>
          <p
            className={`text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap ${truncated ? "line-clamp-3" : ""}`}
          >
            {report.reportText}
          </p>
          {report.reportText.length > 200 && (
            <button
              type="button"
              data-ocid={`daily_report.toggle.${index + 1}`}
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs text-primary flex items-center gap-0.5 hover:underline"
            >
              {expanded ? (
                <>
                  <ChevronUp size={12} /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={12} /> Read more
                </>
              )}
            </button>
          )}
        </div>

        {/* Pending actions */}
        {report.pendingActions?.trim() && (
          <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
              Pending Actions
            </p>
            <p className="text-xs text-amber-800 whitespace-pre-wrap leading-relaxed">
              {report.pendingActions}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DailyReportPage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: isAdmin } = useIsAdmin();

  const principalId = identity?.getPrincipal().toString() ?? "";

  // Form state
  const [date, setDate] = useState(todayStr());
  const [reportText, setReportText] = useState("");
  const [pendingActions, setPendingActions] = useState("");
  const [linkedClientIds, setLinkedClientIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClientSelect, setShowClientSelect] = useState(false);

  // Reports state
  const [reports, setReports] = useState<DailyReport[]>([]);

  useEffect(() => {
    setReports(loadReports());
  }, []);

  const staffName = profile?.name ?? "Staff";

  // Build client map for name resolution
  const clientMap = new Map<string, string>(
    (clients ?? []).map((c) => [c.id.toString(), `${c.name} (${c.company})`]),
  );

  // Filter: admin sees all, staff sees own
  const visibleReports = isAdmin
    ? reports
    : reports.filter((r) => r.principalId === principalId);

  // Group by date
  const grouped = visibleReports.reduce<Record<string, DailyReport[]>>(
    (acc, r) => {
      if (!acc[r.date]) acc[r.date] = [];
      acc[r.date].push(r);
      return acc;
    },
    {},
  );
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const toggleClient = (clientId: string) => {
    setLinkedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) {
      toast.error("Report text is required");
      return;
    }
    if (!principalId) {
      toast.error("Please log in first");
      return;
    }
    setIsSubmitting(true);
    try {
      const newReport: DailyReport = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date,
        staffName,
        principalId,
        reportText: reportText.trim(),
        linkedClientIds,
        pendingActions: pendingActions.trim(),
        submittedAt: new Date().toISOString(),
      };
      const updated = [newReport, ...loadReports()];
      saveReports(updated);
      setReports(updated);
      setReportText("");
      setPendingActions("");
      setLinkedClientIds([]);
      setDate(todayStr());
      setShowClientSelect(false);
      toast.success("Daily report submitted!");
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText size={24} className="text-primary" />
          Daily Report
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Submit your daily field report and track pending actions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Submit Form ── */}
        <div className="lg:col-span-2">
          <Card className="border-border/60 sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Send size={16} className="text-primary" />
                New Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="daily_report.dialog"
              >
                {/* Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="report-date">Report Date</Label>
                  <Input
                    id="report-date"
                    type="date"
                    data-ocid="daily_report.date.input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Staff Name */}
                <div className="space-y-1.5">
                  <Label>Staff Name</Label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/40 text-sm text-muted-foreground">
                    {profileLoading ? (
                      <Skeleton className="h-4 w-28" />
                    ) : (
                      <>
                        <User size={14} className="flex-shrink-0" />
                        <span>{staffName}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Report Text */}
                <div className="space-y-1.5">
                  <Label htmlFor="report-text">
                    Daily Report{" "}
                    <span className="text-destructive text-xs">*</span>
                  </Label>
                  <Textarea
                    id="report-text"
                    data-ocid="daily_report.textarea"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Write your daily field report here... List client visits, discussions, follow-ups, pending actions, etc."
                    rows={7}
                    className="resize-none text-sm"
                    required
                  />
                </div>

                {/* Linked Clients */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    data-ocid="daily_report.clients.toggle"
                    onClick={() => setShowClientSelect((v) => !v)}
                    className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {showClientSelect ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                    Linked Clients
                    {linkedClientIds.length > 0 && (
                      <Badge className="ml-1 text-[10px] h-4 px-1.5">
                        {linkedClientIds.length}
                      </Badge>
                    )}
                  </button>

                  {showClientSelect && (
                    <div className="rounded-md border border-border max-h-44 overflow-y-auto p-2 space-y-1 bg-background">
                      {clientsLoading ? (
                        <div className="space-y-2 p-1">
                          {Array.from({ length: 4 }).map((_, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                            <Skeleton key={i} className="h-4 w-full" />
                          ))}
                        </div>
                      ) : (clients ?? []).length === 0 ? (
                        <p className="text-xs text-muted-foreground px-2 py-1">
                          No clients found
                        </p>
                      ) : (
                        (clients ?? []).map((client) => {
                          const cid = client.id.toString();
                          return (
                            <label
                              key={cid}
                              htmlFor={`client-cb-${cid}`}
                              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                              <Checkbox
                                id={`client-cb-${cid}`}
                                data-ocid="daily_report.client.checkbox"
                                checked={linkedClientIds.includes(cid)}
                                onCheckedChange={() => toggleClient(cid)}
                                className="h-3.5 w-3.5"
                              />
                              <span className="text-xs leading-tight">
                                <span className="font-medium">
                                  {client.name}
                                </span>
                                {client.company && (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    · {client.company}
                                  </span>
                                )}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* Pending Actions */}
                <div className="space-y-1.5">
                  <Label htmlFor="pending-actions">Pending Actions</Label>
                  <Textarea
                    id="pending-actions"
                    data-ocid="daily_report.pending_actions.textarea"
                    value={pendingActions}
                    onChange={(e) => setPendingActions(e.target.value)}
                    placeholder="List pending actions, follow-ups needed..."
                    rows={3}
                    className="resize-none text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  data-ocid="daily_report.submit_button"
                  disabled={isSubmitting || !reportText.trim()}
                  className="w-full gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ── Reports List ── */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <ClipboardList size={18} className="text-primary" />
              {isAdmin ? "All Reports" : "My Reports"}
            </h2>
            <div className="flex items-center gap-2">
              {visibleReports.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid="daily_report.pdf.button"
                  onClick={() =>
                    printDailyReportsPDF(visibleReports, clientMap)
                  }
                  className="gap-2"
                >
                  <FileDown size={14} />
                  Export PDF
                </Button>
              )}
              <Badge variant="outline" className="text-xs">
                {visibleReports.length} total
              </Badge>
            </div>
          </div>

          {visibleReports.length === 0 ? (
            <Card
              data-ocid="daily_report.empty_state"
              className="border-dashed border-border/60"
            >
              <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                <FileText size={36} className="text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No reports yet
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Submit your first daily report using the form
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedDates.map((dateKey) => (
              <div key={dateKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border/40" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    {formatDisplayDate(dateKey)}
                  </span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>

                {grouped[dateKey].map((report, i) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    clientMap={clientMap}
                    index={i}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
