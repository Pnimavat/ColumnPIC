'use client'
import { useCalculations } from '@/hooks/useCalculations'
import { useHouseholdStore } from '@/stores/householdStore'
import { useUIStore } from '@/stores/uiStore'
import { KPICard } from '@/components/dashboard/KPICard'
import { CashFlowBar } from '@/components/dashboard/CashFlowBar'
import { ExpensePie } from '@/components/dashboard/ExpensePie'
import { IncomeDonut } from '@/components/dashboard/IncomeDonut'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { ToastContainer } from '@/components/shared/ToastContainer'
import { formatAmount, formatPct } from '@/lib/utils/format'

export default function DashboardPage() {
  const { totals, memberTotals, byCategory, bySource, baseCurrency } = useCalculations()
  const { household, members } = useHouseholdStore()
  const { openTransactionModal } = useUIStore()

  const primaryMember = members[0]
  const spouseMember = members[1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>{household?.name ?? 'Household'}</h2>
          <p style={{ color: '#888888', fontSize: '0.8125rem', margin: 0 }}>Live household financial snapshot</p>
        </div>
        <button onClick={() => openTransactionModal('add')} style={{ background: '#C8A96E', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
          + Add Transaction
        </button>
      </div>

      {/* Row 1 — Primary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <KPICard label="Monthly Income" value={formatAmount(totals.income, baseCurrency)} subvalue={`${formatAmount(totals.income * 12, baseCurrency, true)}/yr`} color="#4ADE80" />
        <KPICard label="Total Expenses" value={formatAmount(totals.totalExpense, baseCurrency)} subvalue={`Fixed ${formatAmount(totals.fixedExpense, baseCurrency)} + Var ${formatAmount(totals.variableExpense, baseCurrency)}`} color="#F87171" />
        <KPICard label="Cash Invested" value={formatAmount(totals.cashInvest, baseCurrency)} subvalue={`Pre-deducted: ${formatAmount(totals.preDeducted, baseCurrency)}`} color="#60A5FA" />
        <KPICard label="Free Cash Flow" value={formatAmount(totals.fcf, baseCurrency)} subvalue={totals.fcf >= 0 ? 'Surplus' : 'Deficit'} color={totals.fcf >= 0 ? '#C8A96E' : '#F87171'} />
      </div>

      {/* Row 2 — Secondary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <KPICard label="Total Wealth Building" value={formatAmount(totals.totalWealth, baseCurrency)} subvalue={`${formatAmount(totals.annualWealth, baseCurrency, true)}/yr`} color="#C084FC" />
        <KPICard label="Savings Rate" value={formatPct(totals.savingsRate * 100)} subvalue="% of income invested" color="#E8C97E" />
        {primaryMember && memberTotals[primaryMember.id] && (
          <KPICard label={`${primaryMember.name} Net`} value={formatAmount(memberTotals[primaryMember.id].fcf, baseCurrency)} subvalue={`Income: ${formatAmount(memberTotals[primaryMember.id].income, baseCurrency)}`} color={primaryMember.color} />
        )}
        {spouseMember && memberTotals[spouseMember.id] && (
          <KPICard label={`${spouseMember.name} Net`} value={formatAmount(memberTotals[spouseMember.id].fcf, baseCurrency)} subvalue={`Income: ${formatAmount(memberTotals[spouseMember.id].income, baseCurrency)}`} color={spouseMember.color} />
        )}
      </div>

      {/* Row 3 — Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <IncomeDonut bySource={bySource} baseCurrency={baseCurrency} />
        <ExpensePie byCategory={byCategory} baseCurrency={baseCurrency} />
      </div>

      {/* Row 4 — Cash flow bar */}
      <CashFlowBar totals={totals} baseCurrency={baseCurrency} />

      <TransactionModal />
      <ToastContainer />
    </div>
  )
}
