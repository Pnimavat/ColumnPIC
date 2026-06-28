'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatAmount } from '@/lib/utils/format'

const COLORS = ['#4ADE80', '#34D399', '#6EE7B7', '#A7F3D0', '#C8A96E', '#E8C97E', '#60A5FA', '#C084FC']

interface Props {
  bySource: Record<string, number>
  baseCurrency: string
}

export function IncomeDonut({ bySource, baseCurrency }: Props) {
  const data = Object.entries(bySource).sort(([, a], [, b]) => b - a).map(([name, value]) => ({ name, value }))
  if (data.length === 0) return null
  return (
    <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem' }}>
      <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1.25rem' }}>Income by Source</p>
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
