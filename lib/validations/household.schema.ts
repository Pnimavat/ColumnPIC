import { z } from 'zod'

const SUPPORTED_CURRENCIES = ['CAD', 'USD', 'INR', 'GBP', 'AUD', 'EUR'] as const
const SUPPORTED_COUNTRIES = ['CA', 'US', 'IN', 'GB', 'AU', 'EU', 'OT'] as const

export const householdSchema = z.object({
  name: z.string().min(1, 'Household name is required').max(100),
  base_currency: z.enum(SUPPORTED_CURRENCIES),
  country: z.enum(SUPPORTED_COUNTRIES),
  fx_rates: z.record(z.string().length(3), z.number().positive()).default({
    INR: 69.2, USD: 1.36, GBP: 1.72, AUD: 0.90, EUR: 1.48,
  }),
  settings: z.record(z.string(), z.unknown()).default({}),
})

export const householdSettingsSchema = z.object({
  compact_numbers: z.boolean().default(true),
  show_pre_tax: z.boolean().default(true),
  default_projection_return: z.number().min(0).max(50).default(7),
  hide_amounts: z.boolean().default(false),
})

export type HouseholdFormValues = z.infer<typeof householdSchema>
export type HouseholdSettingsValues = z.infer<typeof householdSettingsSchema>
