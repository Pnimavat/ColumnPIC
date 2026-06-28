export default function DashboardPage() {
  const kpis = [
    { label: 'Monthly Income', color: '#4ADE80' },
    { label: 'Fixed Expenses', color: '#F87171' },
    { label: 'Variable Expenses', color: '#FB923C' },
    { label: 'Cash Invested', color: '#60A5FA' },
    { label: 'Pre-deducted Wealth', color: '#C084FC' },
    { label: 'Free Cash Flow', color: '#C8A96E' },
    { label: 'Savings Rate', color: '#E8C97E' },
    { label: 'Annual Wealth Building', color: '#4ADE80' },
  ]
  return (
    <div>
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(200,169,110,0.12)', border: '1px solid rgba(200,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>◈</div>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#E8E8E8', margin: '0 0 0.375rem' }}>Household Dashboard</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0 }}>Connect your Supabase database to see your live household financials.</p>
        </div>
      </div>
      <div style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>💡</span>
        <div>
          <p style={{ color: '#C8A96E', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.25rem' }}>Database not connected</p>
          <p style={{ color: '#888888', fontSize: '0.8125rem', margin: 0, lineHeight: '1.5' }}>
            Copy <code style={{ color: '#E8C97E', background: '#0A0A0A', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.75rem' }}>.env.example</code> to{' '}
            <code style={{ color: '#E8C97E', background: '#0A0A0A', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.75rem' }}>.env.local</code>, fill in your Supabase keys, then run{' '}
            <code style={{ color: '#E8C97E', background: '#0A0A0A', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.75rem' }}>supabase/schema.sql</code>.
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(({ label, color }) => (
          <div key={label} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 500, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, opacity: 0.6 }} />
            </div>
            <div style={{ height: '28px', borderRadius: '6px', background: 'linear-gradient(90deg, #161616 25%, #1E1E1E 50%, #161616 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', marginBottom: '0.5rem' }} />
            <div style={{ height: '14px', width: '60%', borderRadius: '4px', background: 'linear-gradient(90deg, #161616 25%, #1E1E1E 50%, #161616 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite 0.2s' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {['Cashflow Breakdown', 'Wealth Projection'].map(title => (
          <div key={title} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem', minHeight: '200px' }}>
            <p style={{ color: '#888888', fontSize: '0.75rem', fontWeight: 500, margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[80, 60, 45, 70].map((w, i) => (<div key={i} style={{ height: '14px', width: `${w}%`, borderRadius: '4px', background: 'linear-gradient(90deg, #161616 25%, #1E1E1E 50%, #161616 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.5s infinite ${i * 0.15}s` }} />))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
