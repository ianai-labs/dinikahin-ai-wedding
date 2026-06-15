// Formatters for currency, dates, and display values (Indonesia locale)

export function formatCurrency(amount: number, currency: string = "IDR"): string {
  if (currency === "IDR") {
    if (amount >= 1_000_000_000) {
      return `Rp${(amount / 1_000_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000_000) {
      return `Rp${(amount / 1_000_000).toFixed(0)}jt`;
    }
    return `Rp${amount.toLocaleString("id-ID")}`;
  }
  return new Intl.NumberFormat("id-ID", { style: "currency", currency }).format(amount);
}

export function formatPriceRange(min: number, max: number, currency: string = "IDR"): string {
  if (min === max) return formatCurrency(min, currency);
  return `${formatCurrency(min, currency)}–${formatCurrency(max, currency)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("id-ID");
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function formatMonth(month: number): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return months[month - 1] || "";
}

export function formatCompleteness(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Lengkap", color: "text-green-600" };
  if (score >= 50) return { label: "Cukup", color: "text-amber-600" };
  return { label: "Minimal", color: "text-red-600" };
}

export function formatScoreColor(score: number): string {
  if (score >= 80) return "text-score-high";
  if (score >= 50) return "text-score-mid";
  return "text-score-low";
}

export function formatScoreBg(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}
