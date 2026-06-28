import { z } from 'zod'

const holdingSchema = z.object({
  symbol: z.string().min(1).max(20).toUpperCase(),
  pct: z.number().min(0).max(100),
  assessment: z.string().max(200).default(''),
})

export const accountSchema = z.object({
  account_name: z.string().min(1, 'Account name is required').max(120),
  account_type: z.enum(['TFSA', 'RRSP', 'FHSA', '401k', 'ISA', 'Non-Reg', 'Pension', 'Crypto', 'Property', 'Other'] as const),
  institution: z.string().max(100).optional().nullable(),
  current_balance: z.number().min(0).max(100_000_000).default(0),
  currency: z.string().length(3).toUpperCase().default('CAD'),
  all_time_return: z.number().min(-100).max(100_000).optional().nullable(),
  contribution_room: z.number().min(0).optional().nullable(),
  annual_limit: z.number().min(0).optional().nullable(),
  lifetime_limit: z.number().min(0).optional().nullable(),
  is_tax_deductible: z.boolean().default(false),
  is_tax_free_growth: z.boolean().default(false),
  is_tax_free_withdrawal: z.boolean().default(false),
  country: z.string().min(2).max(2).toUpperCase().default('CA'),
  notes: z.string().max(500).optional().nullable(),
  holdings: z.array(holdingSchema).default([]),
  member_id: z.string().uuid().optional().nullable(),
})

export type AccountFormValues = z.infer<typeof accountSchema>
export type HoldingFormValues = z.infer<typeof holdingSchema>
