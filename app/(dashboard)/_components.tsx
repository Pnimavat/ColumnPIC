export function PageShell({ icon, title, description, accentColor, stats }: {
  icon: string
  title: string
  description: string
  accentColor: string
  stats: { label: string; hint: string }[]
}) {
  return (
    <div>
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: `${accentColor}1A`, border: `1px solid ${accentColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, color: accentColor }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>{title}</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>{description}</p>
        </div>
        <button style={{ background: accentColor, color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', flexShrink: 0 }}>+ Add</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {stats.map(({ label, hint }) => (
          <div key={label} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ color: '#888888', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>{label}</p>
            <div style={{ height: '24px', borderRadius: '6px', background: 'linear-gradient(90deg, #161616 25%, #1E1E1E 50%, #161616 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', marginBottom: '0.375rem' }} />
            <p style={{ color: '#444444', fontSize: '0.75rem', margin: 0 }}>{hint}</p>
          </div>
        ))}
      </div>
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>{icon}</div>
        <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0 }}>Connect your Supabase database to manage {title.toLowerCase()} data.</p>
      </div>
    </div>
  )
}
