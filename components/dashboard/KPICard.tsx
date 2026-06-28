interface Props {
  label: string
  value: string
  subvalue?: string
  color?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function KPICard({ label, value, subvalue, color = '#E8E8E8' }: Props) {
  return (
    <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem', transition: 'border-color 0.15s' }}>
      <p style={{ color: '#888888', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.875rem' }}>{label}</p>
      <p style={{ color, fontSize: '1.375rem', fontWeight: 700, margin: '0', fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
      {subvalue && <p style={{ color: '#888888', fontSize: '0.75rem', margin: '0.375rem 0 0' }}>{subvalue}</p>}
    </div>
  )
}
