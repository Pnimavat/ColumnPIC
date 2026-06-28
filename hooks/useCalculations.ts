'use client'
import { useMemo } from 'react'
import { useTransactionStore } from '@/stores/transactionStore'
import { useHouseholdStore } from '@/stores/householdStore'
import { calculateHousehold, calculateMember } from '@/lib/calculations/cashflow'
import { HouseholdCalculations } from '@/types'

export function useCalculations() {
  const { transactions } = useTransactionStore()
  const { household, members } = useHouseholdStore()

  const fxRates = household?.fx_rates ?? {}
  const baseCurrency = household?.base_currency ?? 'CAD'

  const totals = useMemo(
    () => calculateHousehold(transactions, fxRates, baseCurrency),
    [transactions, fxRates, baseCurrency]
  )

  const memberTotals = useMemo(() => {
    const map: Record<string, HouseholdCalculations> = {}
    for (const m of members) {
      map[m.id] = calculateMember(m.id, transactions, fxRates, baseCurrency)
    }
    return map
  }, [members, transactions, fxRates, baseCurrency])

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of transactions) {
      if (!t.is_active) continue
      if (t.flow !== 'Out') continue
      const monthly = t.monthly_base > 0 ? t.monthly_base : t.native_amount
      map[t.category] = (map[t.category] ?? 0) + monthly
    }
    return map
  }, [transactions])

  const bySource = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of transactions) {
      if (!t.is_active) continue
      if (t.flow !== 'In') continue
      const monthly = t.monthly_base > 0 ? t.monthly_base : t.native_amount
      map[t.category] = (map[t.category] ?? 0) + monthly
    }
    return map
  }, [transactions])

  return { totals, memberTotals, byCategory, bySource, baseCurrency, fxRates }
}
