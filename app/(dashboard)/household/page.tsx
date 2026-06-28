'use client'
import { useMemo } from 'react'
import { useCalculations } from '@/hooks/useCalculations'
import { useAccountStore } from '@/stores/accountStore'
import { useForeignAssetStore } from '@/stores/foreignAssetStore'
import { useHouseholdStore } from '@/stores/householdStore'
import { KPICard } from '@/components/dashboard/KPICard'
import { formatAmount, formatPct } from '@/lib/utils/format'

export default function HouseholdPage() {
  const { totals, memberTotals, baseCurrency } = useCalculations()
  const { accounts } = useAccountStore()
  const { foreignAssets } = useForeignAssetStore()
  const { members, household } = useHouseholdStore()
  const fxRates = household?.fx_rates ?? {}

  function toBase(amount: number, currency: string): number {
    if (currency === baseCurrency) return amount
    const rate = fxRates[currency]
    return rate ? amount / rate : amount
  }

  const accountTotal = useMemo(
    () => accounts.reduce((s, a) => s + a.current_balance, 0),
    [accounts]
  )

  const overseasTotal = useMemo(
    () => foreignAssets.filter(a => a.is_active).reduce((s, a) => s + toBase(a.current_value ?? 0, a.currency), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [foreignAssets, fxRates]
  )

  const netWorth = accountTotal + overseasTotal
  const savingsRate = totals.income > 0 ? ((totals.cashInvest + Math.max(0, totals.fcf)) / totals.income) * 100 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, color: '#C8A96E' }}>⌂</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>{household?.name ?? 'Household Overview'}</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            Combined financial snapshot across {members.length} members — income, cashflow, registered accounts, and overseas assets.
          </p>
        </div>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <KPICard label="Combined Income" value={formatAmount(totals.income, baseCurrency, true)} subvalue="Monthly household" color="#4ADE80" />
        <KPICard label="Total Expenses" value={formatAmount(totals.totalExpense, baseCurrency, true)} subvalue="Fixed + variable" color="#F87171" />
        <KPICard label="Total Invested" value={formatAmount(totals.cashInvest, baseCurrency, true)} subvalue="Monthly into wealth" color="#60A5FA" />
        <KPICard label="Free Cash Flow" value={formatAmount(totals.fcf, baseCurrency, true)} subvalue="After expenses + invest" color={totals.fcf >= 0 ? '#C8A96E' : '#F87171'} />
        <KPICard label="Account Balances" value={formatAmount(accountTotal, baseCurrency, true)} subvalue={`Across ${accounts.length} accounts`} color="#C084FC" />
        <KPICard label="Overseas Assets" value={formatAmount(overseasTotal, baseCurrency, true)} subvalue={`${foreignAssets.filter(a => a.is_active).length} assets converted`} color="#FB923C" />
        <KPICard label="Net Worth" value={formatAmount(netWorth, baseCurrency, true)} subvalue="Accounts + overseas" color="#E8C97E" />
        <KPICard label="Savings Rate" value={formatPct(Math.max(0, savingsRate))} subvalue="Invest + FCF / income" color="#4ADE80" />
      </div>

      {/* Per-member breakdown table */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1E1E1E', background: '#0A0A0A' }}>
          <p style={{ color: '#E8E8E8', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Per-Member Breakdown</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                {['Member', 'Income', 'Expenses', 'Invested', 'FCF', 'Savings Rate'].map(col => (
                  <th key={col} style={{ color: '#888888', padding: '0.625rem 1.5rem', textAlign: col === 'Member' ? 'left' : 'right', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #1E1E1E', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const mt = memberTotals[m.id]
                const mSavings = mt && mt.income > 0 ? ((mt.cashInvest + Math.max(0, mt.fcf)) / mt.income) * 100 : 0
                return (
                  <tr key={m.id} style={{ borderTop: i > 0 ? '1px solid #1E1E1E' : 'none' }}>
                    <td style={{ padding: '0.875rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `${m.color}20`, border: `1px solid ${m.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 700, color: m.color, flexShrink: 0 }}>
                          {m.avatar_initials ?? m.name.charAt(0)}
                        </div>
                        <span style={{ color: '#E8E8E8', fontWeight: 500 }}>{m.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: '#4ADE80', fontFamily: 'monospace' }}>{mt ? formatAmount(mt.income, baseCurrency) : '—'}</td>
                    <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: '#F87171', fontFamily: 'monospace' }}>{mt ? formatAmount(mt.totalExpense, baseCurrency) : '—'}</td>
                    <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: '#60A5FA', fontFamily: 'monospace' }}>{mt ? formatAmount(mt.cashInvest, baseCurrency) : '—'}</td>
                    <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: mt && mt.fcf >= 0 ? '#C8A96E' : '#F87171', fontFamily: 'monospace' }}>{mt ? formatAmount(mt.fcf, baseCurrency) : '—'}</td>
                    <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: '#888888', fontFamily: 'monospace' }}>{formatPct(Math.max(0, mSavings))}</td>
                  </tr>
                )
              })}
              <tr style={{ borderTop: '2px solid #1E1E1E', background: '#0A0A0A' }}>
                <td style={{ padding: '0.875rem 1.5rem', color: '#888888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</td>
                <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: '#4ADE80', fontFamily: 'monospace', fontWeight: 700 }}>{formatAmount(totals.income, baseCurrency)}</td>
                <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: '#F87171', fontFamily: 'monospace', fontWeight: 700 }}>{formatAmount(totals.totalExpense, baseCurrency)}</td>
                <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: '#60A5FA', fontFamily: 'monospace', fontWeight: 700 }}>{formatAmount(totals.cashInvest, baseCurrency)}</td>
                <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: totals.fcf >= 0 ? '#C8A96E' : '#F87171', fontFamily: 'monospace', fontWeight: 700 }}>{formatAmount(totals.fcf, baseCurrency)}</td>
                <td style={{ padding: '0.875rem 1.5rem', textAlign: 'right', color: '#E8E8E8', fontFamily: 'monospace', fontWeight: 700 }}>{formatPct(Math.max(0, savingsRate))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset composition */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem' }}>
        <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1rem' }}>Wealth Composition</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[
            { label: 'Registered Accounts (CA)', value: accountTotal, color: '#C084FC' },
            { label: 'Overseas Assets', value: overseasTotal, color: '#FB923C' },
          ].map(({ label, value, color }) => {
            const pct = netWorth > 0 ? (value / netWorth) * 100 : 0
            return (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ color: '#888888', fontSize: '0.8125rem' }}>{label}</span>
                  <span style={{ color: '#E8E8E8', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 600 }}>{formatAmount(value, baseCurrency, true)} <span style={{ color: '#444444', fontWeight: 400 }}>({pct.toFixed(1)}%)</span></span>
                </div>
                <div style={{ height: '6px', borderRadius: '100px', background: '#1E1E1E', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '100px', background: color, width: `${pct}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
