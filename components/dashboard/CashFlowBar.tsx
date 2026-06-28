'use client'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatAmount } from '@/lib/utils/format'
import { HouseholdCalculations } from '@/types'

interface Props {
  totals: HouseholdCalculations
  baseCurrency: string
}

export function CashFlowBar({ totals, baseCurrency }: Props) {
  const data = [
    { name: 'Income', value: totals.income, fill: '#4ADE80' },
    { name: 'Fixed', value: totals.fixedExpense, fill: '#F87171' },
    { name: 'Variable', value: totals.variableExpense, fill: '#FB923C' },
    { name: 'Invested', value: totals.totalWealth, fill: '#60A5FA' },
    { name: 'Free Cash', value: Math.max(0, totals.fcf), fill: '#C8A96E' },
  ]

  return (
    <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem' }}>
      <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1.25rem' }}>Monthly Cash Flow</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatAmount(v, baseCurrency, true)} width={60} />
          <Tooltip
            contentStyle={{ background: '#161616', border: '1px solid #1E1E1E', borderRadius: '8px', fontSize: '0.8125rem' }}
            labelStyle={{ color: '#E8E8E8', fontWeight: 600 }}
            formatter={(v) => [typeof v === 'number' ? formatAmount(v, baseCurrency) : String(v ?? ''), '']}
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
