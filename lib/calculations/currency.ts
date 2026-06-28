export function toBase(
  nativeAmount: number,
  currency: string,
  fxRates: Record<string, number>,
  baseCurrency: string
): number {
  if (currency === baseCurrency) return nativeAmount
  const rate = fxRates[currency]
  if (!rate) return nativeAmount
  return nativeAmount / rate
}

export function toNative(
  baseAmount: number,
  currency: string,
  fxRates: Record<string, number>,
  baseCurrency: string
): number {
  if (currency === baseCurrency) return baseAmount
  const rate = fxRates[currency]
  if (!rate) return baseAmount
  return baseAmount * rate
}

export function formatCurrency(amount: number, currency = 'CAD', compact = false): string {
  if (compact && Math.abs(amount) >= 1000) {
    const val = amount / 1000
    return `${currency} ${val.toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const SUPPORTED_CURRENCIES = ['CAD', 'USD', 'INR', 'GBP', 'AUD', 'EUR'] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export const CURRENCY_FLAGS: Record<string, string> = {
  CAD: '🇨🇦', USD: '🇺🇸', INR: '🇮🇳', GBP: '🇬🇧', AUD: '🇦🇺', EUR: '🇪🇺',
}
