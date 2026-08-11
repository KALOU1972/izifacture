import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "draft" | "sent" | "paid" | "overdue";
};

export function Badge({ children, className, variant = "draft", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-[var(--color-status-draft-bg)] text-[var(--color-status-draft)]": variant === "draft",
          "bg-[var(--color-status-sent-bg)] text-[var(--color-status-sent)]": variant === "sent",
          "bg-[var(--color-status-paid-bg)] text-[var(--color-status-paid)]": variant === "paid",
          "bg-[var(--color-status-overdue-bg)] text-[var(--color-status-overdue)]": variant === "overdue",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
