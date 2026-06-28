import { z } from 'zod'

export const transactionSchema = z.object({
  item: z.string().min(1, 'Item name is required').max(120),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().max(60).optional().nullable(),
  flow: z.enum(['In', 'Out', 'Invest'] as const),
  treatment: z.enum(['Income', 'Fixed', 'Variable', 'Wealth'] as const),
  frequency: z.enum(['Monthly', 'Weekly', 'Biweekly', 'Annual', 'One-time'] as const),
  currency: z.string().length(3).toUpperCase(),
  native_amount: z.number().positive('Amount must be greater than 0').max(10_000_000),
  member_id: z.string().uuid().optional().nullable(),
  is_pre_deducted: z.boolean().default(false),
  is_shared: z.boolean().default(false),
  country_flag: z.string().default('🇨🇦'),
  notes: z.string().max(500).optional().nullable(),
  tags: z.array(z.string().max(40)).max(10).default([]),
  is_active: z.boolean().default(true),
  effective_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  effective_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
