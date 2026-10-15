import { cn } from "@/lib/utils";

const StatusBadge = ({ label, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-2 animate-ping rounded-full bg-accent opacity-70" />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      {label}
    </span>
  );
};

export default StatusBadge;
