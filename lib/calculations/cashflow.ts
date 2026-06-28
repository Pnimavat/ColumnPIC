import { Transaction, HouseholdCalculations } from '@/types'
import { toMonthly } from './frequency'
import { toBase } from './currency'

export function calculateHousehold(
  transactions: Transaction[],
  fxRates: Record<string, number>,
  baseCurrency: string
): HouseholdCalculations {
  let income = 0
  let fixedExpense = 0
  let variableExpense = 0
  let cashInvest = 0
  let preDeducted = 0

  for (const t of transactions) {
    if (!t.is_active) continue
    const monthly = toBase(
      toMonthly(t.native_amount, t.frequency),
      t.currency,
      fxRates,
      baseCurrency
    )
    if (t.flow === 'In') income += monthly
    if (t.flow === 'Out') {
      if (t.treatment === 'Fixed') fixedExpense += monthly
      if (t.treatment === 'Variable') variableExpense += monthly
    }
    if (t.flow === 'Invest') {
      if (t.is_pre_deducted) preDeducted += monthly
      else cashInvest += monthly
    }
  }

  const totalExpense = fixedExpense + variableExpense
  const totalWealth = cashInvest + preDeducted
  const fcf = income - totalExpense - cashInvest
  const savingsRate = income > 0 ? totalWealth / income : 0

  return {
    income, fixedExpense, variableExpense,
    totalExpense, cashInvest, preDeducted,
    totalWealth, fcf, savingsRate,
    annualWealth: totalWealth * 12,
  }
}

export function calculateMember(
  memberId: string,
  transactions: Transaction[],
  fxRates: Record<string, number>,
  baseCurrency: string
): HouseholdCalculations {
  return calculateHousehold(
    transactions.filter(t => t.member_id === memberId),
    fxRates,
    baseCurrency
  )
}
