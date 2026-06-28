'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatAmount } from '@/lib/utils/format'

const COLORS = ['#F87171', '#FB923C', '#FBBF24', '#34D399', '#60A5FA', '#C084FC', '#F472B6', '#A78BFA']

interface Props {
  byCategory: Record<string, number>
  baseCurrency: string
}

export function ExpensePie({ byCategory, baseCurrency }: Props) {
  const data = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  if (data.length === 0) return null

  return (
    <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem' }}>
      <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1.25rem' }}>Expenses by Category</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#161616', border: '1px solid #1E1E1E', borderRadius: '8px', fontSize: '0.8125rem' }}
            formatter={(v) => [typeof v === 'number' ? formatAmount(v, baseCurrency) : String(v ?? ''), '']}
          />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#888888', fontSize: '0.75rem' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
