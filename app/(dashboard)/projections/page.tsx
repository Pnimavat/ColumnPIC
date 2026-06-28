'use client'
import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useCalculations } from '@/hooks/useCalculations'
import { useAccountStore } from '@/stores/accountStore'
import { projectWealth, findMilestoneAge } from '@/lib/calculations/projections'
import { formatAmount } from '@/lib/utils/format'

const SCENARIOS = [
  { key: 'conservative', label: 'Conservative', rate: 5, color: '#60A5FA' },
  { key: 'moderate',     label: 'Moderate',     rate: 7, color: '#C8A96E' },
  { key: 'aggressive',   label: 'Aggressive',   rate: 10, color: '#4ADE80' },
]

export default function ProjectionsPage() {
  const { totals, baseCurrency } = useCalculations()
  const { accounts } = useAccountStore()

  const defaultMonthly = Math.round(totals.totalWealth)
  const defaultBalance = Math.round(accounts.reduce((s, a) => s + a.current_balance, 0))

  const [monthly, setMonthly] = useState<number>(defaultMonthly)
  const [balance, setBalance] = useState<number>(defaultBalance)
  const [startAge, setStartAge] = useState(34)
  const [targetAge, setTargetAge] = useState(65)

  const data = useMemo(() => {
    const points = []
    for (let age = startAge; age <= targetAge; age++) {
      const years = age - startAge
      const row: Record<string, number | string> = { age }
      for (const s of SCENARIOS) {
        row[s.key] = Math.round(projectWealth(monthly, s.rate, years, balance))
      }
      row.contributed = Math.round(balance + monthly * 12 * years)
      points.push(row)
    }
    return points
  }, [monthly, balance, startAge, targetAge])

  const milestones = useMemo(() =>
    SCENARIOS.map(s => ({
      ...s,
      at65: projectWealth(monthly, s.rate, targetAge - startAge, balance),
      m500k: findMilestoneAge(500_000, startAge, monthly, s.rate, balance),
      m1m: findMilestoneAge(1_000_000, startAge, monthly, s.rate, balance),
      m2m: findMilestoneAge(2_000_000, startAge, monthly, s.rate, balance),
    })), [monthly, balance, startAge, targetAge])

  const inputStyle: React.CSSProperties = {
    background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '8px',
    padding: '0.5rem 0.75rem', color: '#E8E8E8', fontSize: '0.875rem',
    fontFamily: 'monospace', outline: 'none', width: '130px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, color: '#C8A96E' }}>◫</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Wealth Projections</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            Compound growth from age {startAge} to {targetAge} across three return scenarios, seeded with live investment data.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
        <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1rem' }}>Projection Inputs</p>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[
            { label: 'Monthly Invest', value: monthly, onChange: (v: number) => setMonthly(v), prefix: '$' },
            { label: 'Current Balance', value: balance, onChange: (v: number) => setBalance(v), prefix: '$' },
            { label: 'Start Age', value: startAge, onChange: (v: number) => setStartAge(v) },
            { label: 'Target Age', value: targetAge, onChange: (v: number) => setTargetAge(v) },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.375rem' }}>{label}</p>
              <input
                type="number"
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={inputStyle}
              />
            </div>
          ))}
          <button onClick={() => { setMonthly(defaultMonthly); setBalance(defaultBalance); setStartAge(34); setTargetAge(65) }}
            style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', color: '#888888', padding: '0.5rem 1rem', fontSize: '0.8125rem', cursor: 'pointer', marginBottom: '1px' }}>
            Reset to Live
          </button>
        </div>
      </div>

      {/* Scenario cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {milestones.map(s => (
          <div key={s.key} style={{ background: '#111111', border: `1px solid ${s.color}30`, borderLeft: `3px solid ${s.color}`, borderRadius: '12px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <p style={{ color: '#E8E8E8', fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>{s.label}</p>
                <p style={{ color: s.color, fontSize: '0.75rem', margin: '0.125rem 0 0', fontWeight: 600 }}>{s.rate}% annual return</p>
              </div>
              <p style={{ color: s.color, fontSize: '1.375rem', fontWeight: 700, fontFamily: 'monospace', margin: 0, letterSpacing: '-0.02em' }}>
                {formatAmount(s.at65, baseCurrency, true)}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                { target: '$500K', age: s.m500k },
                { target: '$1M',   age: s.m1m },
                { target: '$2M',   age: s.m2m },
              ].map(({ target, age }) => (
                <div key={target} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888888', fontSize: '0.75rem' }}>{target} milestone</span>
                  <span style={{ color: age ? '#E8E8E8' : '#444444', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>
                    {age ? `Age ${age} (${age - startAge}y)` : '> target age'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Wealth Projection Curve</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {SCENARIOS.map(s => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '10px', height: '2px', background: s.color }} />
                <span style={{ color: '#888888', fontSize: '0.75rem' }}>{s.label} ({s.rate}%)</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              {SCENARIOS.map(s => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
            <XAxis dataKey="age" tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Age', position: 'insideBottomRight', fill: '#888888', fontSize: 11, offset: -5 }} />
            <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}M`} width={55} />
            <Tooltip
              contentStyle={{ background: '#161616', border: '1px solid #1E1E1E', borderRadius: '8px', fontSize: '0.8125rem' }}
              labelFormatter={(age) => `Age ${age}`}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any, name: any) => [formatAmount(Number(v), baseCurrency, true), SCENARIOS.find(s => s.key === String(name))?.label ?? String(name ?? '')]}
            />
            <ReferenceLine y={1_000_000} stroke="#C8A96E" strokeDasharray="4 4" strokeOpacity={0.3} label={{ value: '$1M', fill: '#C8A96E', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={2_000_000} stroke="#C8A96E" strokeDasharray="4 4" strokeOpacity={0.2} label={{ value: '$2M', fill: '#C8A96E', fontSize: 10, position: 'right' }} />
            <Area type="monotone" dataKey="contributed" stroke="#444444" strokeWidth={1} fill="none" strokeDasharray="3 3" name="Contributed" />
            {SCENARIOS.map(s => (
              <Area key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} fill={`url(#grad-${s.key})`} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        <p style={{ color: '#444444', fontSize: '0.75rem', textAlign: 'center', margin: '0.75rem 0 0' }}>
          Dashed line = contributed capital (no growth). Assumes constant monthly investment.
        </p>
      </div>
    </div>
  )
}
