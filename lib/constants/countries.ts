export const COUNTRIES = [
  { code: 'CA', name: 'Canada',         flag: '🇨🇦', currency: 'CAD' },
  { code: 'US', name: 'United States',  flag: '🇺🇸', currency: 'USD' },
  { code: 'IN', name: 'India',          flag: '🇮🇳', currency: 'INR' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺', currency: 'AUD' },
  { code: 'EU', name: 'Europe',         flag: '🇪🇺', currency: 'EUR' },
  { code: 'OT', name: 'Other',          flag: '🌍',  currency: 'USD' },
]

export const DEFAULT_FX_RATES: Record<string, number> = {
  INR: 69.2,
  USD: 1.36,
  GBP: 1.72,
  AUD: 0.90,
  EUR: 1.48,
}
