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
  | "won"
  | "lost"
  | "closed";

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
  won: "Won",
  lost: "Lost",
  closed: "Closed",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase() === "inprogress" ? "inProgress" : status;
  const label = statusLabels[key] ?? status;
  const cssKey = key === "inProgress" ? "inprogress" : key.toLowerCase();

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
