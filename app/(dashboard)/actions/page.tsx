'use client'
import { useMemo } from 'react'
import { useAccountStore } from '@/stores/accountStore'
import { useCalculations } from '@/hooks/useCalculations'
import { useHouseholdStore } from '@/stores/householdStore'
import { formatAmount } from '@/lib/utils/format'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

interface Action {
  id: string
  priority: Priority
  label: string
  detail: string
  status: Status
  color: string
}

const PRIORITY_COLOR: Record<Priority, string> = {
  HIGH: '#F87171',
  MEDIUM: '#FB923C',
  LOW: '#4ADE80',
}

export default function ActionsPage() {
  const { accounts } = useAccountStore()
  const { totals, baseCurrency } = useCalculations()
  const { members } = useHouseholdStore()

  const actions = useMemo<Action[]>(() => {
    const list: Action[] = []

    const fhsaRoom = accounts.filter(a => a.account_type === 'FHSA').reduce((s, a) => s + (a.contribution_room ?? 0), 0)
    if (fhsaRoom > 0) {
      list.push({
        id: 'fhsa-room',
        priority: 'HIGH',
        label: `Max out FHSA — ${formatAmount(fhsaRoom, baseCurrency)} room remaining`,
        detail: 'FHSA contributions are both tax-deductible AND grow tax-free. First-dollar priority.',
        status: 'TODO',
        color: PRIORITY_COLOR.HIGH,
      })
    }

    const tfsaRoom = accounts.filter(a => a.account_type === 'TFSA').reduce((s, a) => s + (a.contribution_room ?? 0), 0)
    if (tfsaRoom > 0) {
      list.push({
        id: 'tfsa-room',
        priority: 'HIGH',
        label: `Fill TFSA — ${formatAmount(tfsaRoom, baseCurrency)} contribution room available`,
        detail: 'Tax-free growth and withdrawals. Second in priority after FHSA.',
        status: 'IN_PROGRESS',
        color: PRIORITY_COLOR.HIGH,
      })
    }

    const rrspRoom = accounts.filter(a => a.account_type === 'RRSP').reduce((s, a) => s + (a.contribution_room ?? 0), 0)
    if (rrspRoom > 0) {
      list.push({
        id: 'rrsp-room',
        priority: 'MEDIUM',
        label: `RRSP deduction space — ${formatAmount(rrspRoom, baseCurrency)} unused`,
        detail: 'Deductible contributions reduce taxable income at your marginal rate. Use after FHSA/TFSA.',
        status: 'TODO',
        color: PRIORITY_COLOR.MEDIUM,
      })
    }

    if (totals.fcf > 500) {
      list.push({
        id: 'deploy-fcf',
        priority: 'MEDIUM',
        label: `Deploy surplus FCF — ${formatAmount(totals.fcf, baseCurrency)}/mo unallocated`,
        detail: 'Free cash flow sitting in chequing earns nothing. Route it to TFSA or Non-Reg.',
        status: 'TODO',
        color: PRIORITY_COLOR.MEDIUM,
      })
    }

    const savingsRate = totals.income > 0 ? ((totals.cashInvest + Math.max(0, totals.fcf)) / totals.income) * 100 : 0
    if (savingsRate < 20) {
      list.push({
        id: 'savings-rate',
        priority: 'HIGH',
        label: `Savings rate ${savingsRate.toFixed(1)}% — target 20%+`,
        detail: 'Wealth-building requires a consistent savings rate. Review variable expenses for reduction opportunities.',
        status: 'TODO',
        color: PRIORITY_COLOR.HIGH,
      })
    }

    const memberIdsWithFhsa = new Set(accounts.filter(a => a.account_type === 'FHSA').map(a => a.member_id))
    for (const m of members) {
      if (!memberIdsWithFhsa.has(m.id) && m.role !== 'dependant') {
        list.push({
          id: `open-fhsa-${m.id}`,
          priority: 'HIGH',
          label: `Open FHSA for ${m.name}`,
          detail: 'Each eligible member can contribute up to $8K/yr ($40K lifetime). Tax-deductible + tax-free growth.',
          status: 'TODO',
          color: PRIORITY_COLOR.HIGH,
        })
      }
    }

    list.push({
      id: 'insurance-review',
      priority: 'LOW',
      label: 'Annual insurance premium review',
      detail: 'Term life, disability, and home coverage. Rates improve every few years — shop comparisons.',
      status: 'TODO',
      color: PRIORITY_COLOR.LOW,
    })

    list.push({
      id: 'estate-plan',
      priority: 'LOW',
      label: 'Review beneficiary designations',
      detail: 'TFSA, RRSP, and FHSA beneficiaries should be updated after major life events.',
      status: 'TODO',
      color: PRIORITY_COLOR.LOW,
    })

    return list
  }, [accounts, totals, baseCurrency, members])

  const byPriority = {
    HIGH: actions.filter(a => a.priority === 'HIGH'),
    MEDIUM: actions.filter(a => a.priority === 'MEDIUM'),
    LOW: actions.filter(a => a.priority === 'LOW'),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, color: '#C8A96E' }}>◈</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Action Items</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            {actions.length} prioritized actions generated from your live financial data. High-priority items first.
          </p>
        </div>
      </div>

      {/* Priority summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {(['HIGH', 'MEDIUM', 'LOW'] as Priority[]).map(p => (
          <div key={p} style={{ background: '#111111', border: `1px solid ${PRIORITY_COLOR[p]}33`, borderLeft: `3px solid ${PRIORITY_COLOR[p]}`, borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.5rem' }}>{p.charAt(0) + p.slice(1).toLowerCase()} Priority</p>
            <p style={{ color: PRIORITY_COLOR[p], fontSize: '1.5rem', fontWeight: 700, margin: 0, fontFamily: 'monospace' }}>{byPriority[p].length}</p>
          </div>
        ))}
      </div>

      {/* Action list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {actions.map(action => (
          <div key={action.id} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: action.color, flexShrink: 0, marginTop: '4px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: '#E8E8E8', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.25rem' }}>{action.label}</p>
              <p style={{ color: '#888888', fontSize: '0.75rem', margin: 0, lineHeight: '1.5' }}>{action.detail}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '0.25rem 0.625rem', borderRadius: '100px', background: action.status === 'IN_PROGRESS' ? 'rgba(96,165,250,0.1)' : '#1E1E1E', color: action.status === 'IN_PROGRESS' ? '#60A5FA' : '#888888', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                {action.status.replace('_', ' ')}
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '100px', background: `${action.color}15`, color: action.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {action.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
