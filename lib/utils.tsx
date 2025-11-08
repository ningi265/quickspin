import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MW", {
    style: "currency",
    currency: "MWK",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-MW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
