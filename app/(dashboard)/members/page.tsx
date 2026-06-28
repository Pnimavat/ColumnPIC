'use client'
import { useMemo } from 'react'
import { useHouseholdStore } from '@/stores/householdStore'
import { useCalculations } from '@/hooks/useCalculations'
import { getMarginalRate, getEffectiveTaxRate } from '@/lib/calculations/tax'
import { KPICard } from '@/components/dashboard/KPICard'
import { formatAmount, formatPct } from '@/lib/utils/format'

const ROLE_COLORS: Record<string, string> = {
  primary: '#C8A96E',
  spouse: '#60A5FA',
  contributor: '#4ADE80',
  dependant: '#888888',
}

export default function MembersPage() {
  const { members, household } = useHouseholdStore()
  const { memberTotals, totals, baseCurrency } = useCalculations()
  const country = household?.country ?? 'CA'

  const memberStats = useMemo(() => members.map(m => {
    const mt = memberTotals[m.id]
    const marginal = getMarginalRate(m.gross_annual ?? 0, country)
    const effective = getEffectiveTaxRate(m.gross_annual ?? 0, country)
    return { member: m, mt, marginal, effective }
  }), [members, memberTotals, country])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, color: '#60A5FA' }}>◑</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Household Members</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            {members.length} members · combined gross {formatAmount(members.reduce((s, m) => s + (m.gross_annual ?? 0), 0), baseCurrency, true)}. Per-member income, cashflow, and tax breakdown.
          </p>
        </div>
        <button style={{ background: '#60A5FA', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', flexShrink: 0 }}>+ Add Member</button>
      </div>

      {/* Household totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        <KPICard label="Household Income" value={formatAmount(totals.income, baseCurrency, true)} subvalue="Combined monthly" color="#4ADE80" />
        <KPICard label="Total Expenses" value={formatAmount(totals.totalExpense, baseCurrency, true)} subvalue="Fixed + variable" color="#F87171" />
        <KPICard label="Total Invested" value={formatAmount(totals.cashInvest, baseCurrency, true)} subvalue="Monthly wealth building" color="#60A5FA" />
        <KPICard label="Household FCF" value={formatAmount(totals.fcf, baseCurrency, true)} subvalue="Free cash flow" color="#C8A96E" />
      </div>

      {/* Member cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {memberStats.map(({ member, mt, marginal, effective }) => {
          const roleColor = ROLE_COLORS[member.role] ?? '#888888'
          return (
            <div key={member.id} style={{ background: '#111111', border: `1px solid ${roleColor}25`, borderTop: `3px solid ${roleColor}`, borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${member.color}20`, border: `2px solid ${member.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: member.color, flexShrink: 0 }}>
                  {member.avatar_initials ?? member.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#E8E8E8', fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>{member.name}</p>
                  {member.employer && <p style={{ color: '#888888', fontSize: '0.75rem', margin: '0.125rem 0 0' }}>{member.employer}</p>}
                </div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '100px', background: `${roleColor}15`, color: roleColor, textTransform: 'capitalize', letterSpacing: '0.04em' }}>
                  {member.role}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'Gross Annual', value: formatAmount(member.gross_annual ?? 0, baseCurrency, true), color: '#4ADE80' },
                  { label: 'Net Monthly (est.)', value: mt ? formatAmount(mt.income, baseCurrency) : '—', color: '#E8E8E8' },
                  { label: 'Monthly Invested', value: mt ? formatAmount(mt.cashInvest, baseCurrency) : '—', color: '#60A5FA' },
                  { label: 'Free Cash Flow', value: mt ? formatAmount(mt.fcf, baseCurrency) : '—', color: mt && mt.fcf >= 0 ? '#C8A96E' : '#F87171' },
                  { label: 'Marginal Rate', value: formatPct(marginal), color: '#FB923C' },
                  { label: 'Effective Rate', value: formatPct(effective), color: '#FBBF24' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#888888', fontSize: '0.75rem' }}>{label}</span>
                    <span style={{ color, fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              {member.notes && (
                <p style={{ color: '#444444', fontSize: '0.75rem', margin: '0.875rem 0 0', paddingTop: '0.75rem', borderTop: '1px solid #1E1E1E' }}>{member.notes}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Role legend */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {Object.entries(ROLE_COLORS).map(([role, color]) => (
          <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111111', border: '1px solid #1E1E1E', borderRadius: '100px', padding: '0.375rem 0.875rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'capitalize' }}>{role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
