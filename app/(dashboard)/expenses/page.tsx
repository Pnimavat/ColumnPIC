'use client'
import { useCalculations } from '@/hooks/useCalculations'
import { useUIStore } from '@/stores/uiStore'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { ToastContainer } from '@/components/shared/ToastContainer'
import { KPICard } from '@/components/dashboard/KPICard'
import { formatAmount } from '@/lib/utils/format'

export default function ExpensesPage() {
  const { totals, baseCurrency } = useCalculations()
  const { openTransactionModal } = useUIStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem' }}>Expenses</h2>
          <p style={{ color: '#888888', fontSize: '0.8125rem', margin: 0 }}>Fixed and variable household spending</p>
        </div>
        <button onClick={() => openTransactionModal('add')} style={{ background: '#F87171', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>+ Add Expense</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        <KPICard label="Fixed Expenses" value={formatAmount(totals.fixedExpense, baseCurrency)} color="#F87171" />
        <KPICard label="Variable Expenses" value={formatAmount(totals.variableExpense, baseCurrency)} color="#FB923C" />
        <KPICard label="Total Monthly" value={formatAmount(totals.totalExpense, baseCurrency)} color="#F87171" />
      </div>
      <TransactionTable filterFlow="Out" />
      <TransactionModal />
      <ToastContainer />
    </div>
  )
}
