import { cn } from "@/lib/utils";

type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "planned"
  | "completed"
  | "cancelled"
  | "open"
  | "inProgress"
  | "in-progress"
  | "won"
  | "lost"
  | "closed"
  | "resolved";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  planned: "Planned",
  completed: "Completed",
  cancelled: "Cancelled",
  open: "Open",
  inProgress: "In Progress",
  "in-progress": "In Progress",
  won: "Won",
  lost: "Lost",
  closed: "Closed",
  resolved: "Resolved",
};

// Normalize status to a CSS-safe key
function normalizeCssKey(status: string): string {
  const lower = status.toLowerCase();
  if (lower === "inprogress" || lower === "in-progress") return "inprogress";
  if (lower === "resolved") return "closed";
  return lower;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const lower = status.toLowerCase();
  const lookupKey =
    lower === "inprogress" || lower === "in-progress"
      ? "inProgress"
      : lower === "in-progress"
        ? "in-progress"
        : status;
  const label = statusLabels[lookupKey] ?? statusLabels[lower] ?? status;
  const cssKey = normalizeCssKey(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        `status-badge-${cssKey}`,
        className,
      )}
    >
      {label}
    </span>
  );
}
