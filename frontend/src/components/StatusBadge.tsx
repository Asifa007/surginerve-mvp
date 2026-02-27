import { cn } from "@/lib/utils";

type StatusType = "Normal" | "Warning" | "Failure";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  Normal: "bg-success/15 text-success border-success/30",
  Warning: "bg-warning/15 text-warning border-warning/30",
  Failure: "bg-destructive/15 text-destructive border-destructive/30",
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        statusStyles[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

export default StatusBadge;
