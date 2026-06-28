'use client'
import { useCalculations } from '@/hooks/useCalculations'
import { useUIStore } from '@/stores/uiStore'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { ToastContainer } from '@/components/shared/ToastContainer'
import { KPICard } from '@/components/dashboard/KPICard'
import { formatAmount } from '@/lib/utils/format'

export default function InvestmentsPage() {
  const { totals, baseCurrency } = useCalculations()
  const { openTransactionModal } = useUIStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem' }}>Investments</h2>
          <p style={{ color: '#888888', fontSize: '0.8125rem', margin: 0 }}>Monthly wealth-building contributions</p>
        </div>
        <button onClick={() => openTransactionModal('add')} style={{ background: '#60A5FA', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>+ Add Investment</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        <KPICard label="Cash Invested" value={formatAmount(totals.cashInvest, baseCurrency)} subvalue="Out of pocket" color="#60A5FA" />
        <KPICard label="Pre-deducted" value={formatAmount(totals.preDeducted, baseCurrency)} subvalue="Employer/payroll" color="#C084FC" />
        <KPICard label="Total Wealth Building" value={formatAmount(totals.totalWealth, baseCurrency)} subvalue={`${formatAmount(totals.annualWealth, baseCurrency, true)}/yr`} color="#C8A96E" />
      </div>
      <TransactionTable filterFlow="Invest" />
      <TransactionModal />
      <ToastContainer />
    </div>
  )
}
