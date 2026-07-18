export function formatCurrency(amount: number, currency = "$"): string {
  return `${currency}${amount.toLocaleString()}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getDurationDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
}
