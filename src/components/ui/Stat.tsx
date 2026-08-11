import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { formatFCFA, formatNumber } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatProps {
  title: string;
  value: number | string;
  isCurrency?: boolean;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    description?: string;
    hideSign?: boolean;
  };
  valueClassName?: string;
}

export function Stat({ title, value, isCurrency = true, icon: Icon, trend, valueClassName }: StatProps) {
  const displayValue = isCurrency && typeof value === "number" 
    ? formatFCFA(value) 
    : (typeof value === "number" ? formatNumber(value) : value);

  return (
    <Card className="group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[var(--color-text-muted)]">{title}</CardTitle>
        <div className="h-10 w-10 rounded-full bg-[var(--color-sidebar-hover)] flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-colors duration-300">
          <Icon className="h-5 w-5 text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-lg sm:text-xl lg:text-base xl:text-lg 2xl:text-xl font-bold tracking-tighter whitespace-nowrap truncate ${valueClassName || 'text-[var(--color-text-main)]'}`} title={String(displayValue)}>
          {displayValue}
        </div>
        {trend && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)] flex items-center gap-1">
            <span className={trend.isPositive ? "text-[var(--color-status-paid)]" : "text-[var(--color-status-overdue)]"}>
              {!trend.hideSign && (trend.isPositive ? "+" : "-")}{trend.value}%
            </span>
            <span>{trend.description || "depuis le mois dernier"}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
