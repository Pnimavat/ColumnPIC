export function formatAmount(amount: number, currency = 'CAD', compact = false): string {
  if (compact) {
    if (Math.abs(amount) >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
    if (Math.abs(amount) >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
