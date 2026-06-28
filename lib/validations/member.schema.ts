import { z } from 'zod'

export const memberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  role: z.enum(['primary', 'spouse', 'contributor', 'dependant'] as const),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#C8A96E'),
  avatar_initials: z.string().max(3).optional().nullable(),
  gross_annual: z.number().min(0).max(100_000_000).optional().nullable(),
  tax_rate: z.number().min(0).max(100).optional().nullable(),
  employer: z.string().max(120).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
})

export type MemberFormValues = z.infer<typeof memberSchema>
