'use client'
import { useMemo } from 'react'
import { useHouseholdStore } from '@/stores/householdStore'
import { useTransactionStore } from '@/stores/transactionStore'
import { getMarginalRate, getEffectiveTaxRate, getRefundEstimate } from '@/lib/calculations/tax'
import { KPICard } from '@/components/dashboard/KPICard'
import { formatAmount, formatPct } from '@/lib/utils/format'

const BRACKETS_2026 = [
  ['$0 – $16,129',       '15%',   '20.05%'],
  ['$16,129 – $57,375',  '20.5%', '29.65%'],
  ['$57,375 – $102,000', '26%',   '37.16%'],
  ['$102,000 – $111,733','29%',   '40.16%'],
  ['$111,733 – $154,906','29%',   '42.16%'],
  ['$154,906 – $220,000','33%',   '46.16%'],
  ['$220,000+',          '33%',   '46.16%'],
]

export default function TaxPage() {
  const { members, household } = useHouseholdStore()
  const { transactions } = useTransactionStore()
  const country = household?.country ?? 'CA'
  const baseCurrency = household?.base_currency ?? 'CAD'

  const memberTax = useMemo(() => members.map(m => {
    const gross = m.gross_annual ?? 0
    const marginal = getMarginalRate(gross, country)
    const effective = getEffectiveTaxRate(gross, country)

    const rrspAnnual = transactions
      .filter(t => t.member_id === m.id && t.flow === 'Invest' && t.category === 'RRSP' && t.is_active)
      .reduce((s, t) => s + t.monthly_base * 12, 0)
    const fhsaAnnual = transactions
      .filter(t => t.member_id === m.id && t.flow === 'Invest' && t.category === 'FHSA' && t.is_active)
      .reduce((s, t) => s + t.monthly_base * 12, 0)
    const refund = getRefundEstimate(rrspAnnual, fhsaAnnual, marginal)

    return { member: m, gross, marginal, effective, rrspAnnual, fhsaAnnual, refund }
  }), [members, transactions, country])

  const householdRefund = memberTax.reduce((s, mt) => s + mt.refund, 0)
  const avgMarginal = memberTax.length > 0 ? memberTax.reduce((s, mt) => s + mt.marginal, 0) / memberTax.length : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, color: '#FB923C' }}>◧</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Tax Center</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            2026 CA / Ontario brackets. Marginal and effective rates, RRSP / FHSA refund estimates, and household tax optimization.
          </p>
        </div>
      </div>

      {/* Household summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <KPICard label="Avg Marginal Rate" value={formatPct(avgMarginal)} subvalue="Combined federal + Ontario" color="#FB923C" />
        <KPICard label="Estimated Refund" value={formatAmount(householdRefund, baseCurrency)} subvalue="RRSP + FHSA deductions" color="#4ADE80" />
        <KPICard label="RRSP Contributions" value={formatAmount(memberTax.reduce((s, mt) => s + mt.rrspAnnual, 0), baseCurrency)} subvalue="Annual across household" color="#60A5FA" />
        <KPICard label="FHSA Contributions" value={formatAmount(memberTax.reduce((s, mt) => s + mt.fhsaAnnual, 0), baseCurrency)} subvalue="Annual across household" color="#C8A96E" />
      </div>

      {/* Per-member tax breakdown */}
      {memberTax.map(({ member, gross, marginal, effective, rrspAnnual, fhsaAnnual, refund }) => (
        <div key={member.id} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${member.color}20`, border: `2px solid ${member.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, color: member.color, flexShrink: 0 }}>
              {member.avatar_initials ?? member.name.charAt(0)}
            </div>
            <div>
              <p style={{ color: '#E8E8E8', fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>{member.name}</p>
              <p style={{ color: '#888888', fontSize: '0.8125rem', margin: 0 }}>
                Gross income: <span style={{ color: '#E8E8E8', fontFamily: 'monospace' }}>{formatAmount(gross, baseCurrency, true)}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ color: '#888888', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>Marginal Rate</p>
              <p style={{ color: '#FB923C', fontSize: '1.375rem', fontWeight: 700, fontFamily: 'monospace', margin: 0 }}>{formatPct(marginal)}</p>
            </div>
            <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ color: '#888888', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>Effective Rate</p>
              <p style={{ color: '#FBBF24', fontSize: '1.375rem', fontWeight: 700, fontFamily: 'monospace', margin: 0 }}>{formatPct(effective)}</p>
            </div>
            <div style={{ background: '#0D0D0D', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ color: '#888888', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>RRSP + FHSA</p>
              <p style={{ color: '#60A5FA', fontSize: '1.375rem', fontWeight: 700, fontFamily: 'monospace', margin: 0 }}>{formatAmount(rrspAnnual + fhsaAnnual, baseCurrency, true)}</p>
              <p style={{ color: '#888888', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>Annual deductions</p>
            </div>
            <div style={{ background: '#0a1a0f', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ color: '#888888', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>Est. Refund</p>
              <p style={{ color: '#4ADE80', fontSize: '1.375rem', fontWeight: 700, fontFamily: 'monospace', margin: 0 }}>{formatAmount(refund, baseCurrency)}</p>
              <p style={{ color: '#888888', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>At {formatPct(marginal)} marginal</p>
            </div>
          </div>
        </div>
      ))}

      {/* CA/ON 2026 brackets table */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem' }}>
        <p style={{ color: '#E8E8E8', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 1rem' }}>2026 CA / ON Combined Brackets</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem' }}>
          <div style={{ color: '#888888', padding: '0.5rem', fontWeight: 600 }}>Income Range</div>
          <div style={{ color: '#888888', padding: '0.5rem', fontWeight: 600 }}>Federal</div>
          <div style={{ color: '#888888', padding: '0.5rem', fontWeight: 600 }}>Combined</div>
          {BRACKETS_2026.map(([range, federal, combined], i) => {
            const isRelevant = memberTax.some(mt => {
              const gross = mt.gross
              const boundaries = [0, 16129, 57375, 102000, 111733, 154906, 220000]
              return gross > boundaries[i] && (i === BRACKETS_2026.length - 1 || gross <= boundaries[i + 1])
            })
            return (
              <>
                <div key={`r${i}`} style={{ color: isRelevant ? '#E8E8E8' : '#555555', padding: '0.375rem 0.5rem', borderTop: '1px solid #1E1E1E', fontFamily: 'monospace', fontSize: '0.75rem', background: isRelevant ? 'rgba(251,146,60,0.04)' : 'transparent' }}>{range}</div>
                <div key={`f${i}`} style={{ color: isRelevant ? '#60A5FA' : '#444444', padding: '0.375rem 0.5rem', borderTop: '1px solid #1E1E1E', fontFamily: 'monospace', background: isRelevant ? 'rgba(251,146,60,0.04)' : 'transparent' }}>{federal}</div>
                <div key={`c${i}`} style={{ color: isRelevant ? '#FB923C' : '#444444', padding: '0.375rem 0.5rem', borderTop: '1px solid #1E1E1E', fontFamily: 'monospace', fontWeight: isRelevant ? 700 : 400, background: isRelevant ? 'rgba(251,146,60,0.04)' : 'transparent' }}>{combined}</div>
              </>
            )
          })}
        </div>
        <p style={{ color: '#444444', fontSize: '0.75rem', margin: '0.875rem 0 0' }}>
          Highlighted rows = active marginal brackets for household members.
        </p>
      </div>
    </div>
  )
}
