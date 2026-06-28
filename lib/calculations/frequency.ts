import { FrequencyType } from '@/types'

export const FREQUENCY_MULTIPLIERS: Record<FrequencyType, number> = {
  Monthly: 1,
  Weekly: 4.333333,
  Biweekly: 2.166667,
  Annual: 0.083333,
  'One-time': 1,
}

export function toMonthly(amount: number, frequency: FrequencyType): number {
  return amount * FREQUENCY_MULTIPLIERS[frequency]
}

export function fromMonthly(monthly: number, frequency: FrequencyType): number {
  const mult = FREQUENCY_MULTIPLIERS[frequency]
  return mult === 0 ? 0 : monthly / mult
}
