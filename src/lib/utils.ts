import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value).replace(/\u202F/g, " ").replace(/\u00A0/g, " ");
}

export function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("XOF", "FCFA")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ");
}

export function formatDate(date: string | Date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}
