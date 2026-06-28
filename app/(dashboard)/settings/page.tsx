export default function SettingsPage() {
  const sections = [
    { title: 'Household', items: [{ label: 'Household Name', value: 'My Household' }, { label: 'Base Currency', value: 'CAD' }, { label: 'Country', value: 'Canada' }] },
    { title: 'FX Rates', items: [{ label: 'USD/CAD', value: '1.36' }, { label: 'INR/CAD', value: '0.01445' }, { label: 'GBP/CAD', value: '1.72' }, { label: 'EUR/CAD', value: '1.48' }] },
    { title: 'Preferences', items: [{ label: 'Compact Number Format', value: 'Enabled' }, { label: 'Default Projection Return', value: '7%' }] },
  ]
  return (
    <div>
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.5rem' }}>Settings</h2>
        <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0 }}>Configure household settings, FX rates, and preferences.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sections.map(s => (
          <div key={s.title} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1E1E1E', background: '#0A0A0A' }}>
              <p style={{ color: '#E8E8E8', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{s.title}</p>
            </div>
            {s.items.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.5rem', borderTop: i > 0 ? '1px solid #1E1E1E' : 'none' }}>
                <span style={{ color: '#888888', fontSize: '0.875rem' }}>{item.label}</span>
                <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '6px', padding: '0.375rem 0.75rem', color: '#E8E8E8', fontSize: '0.875rem', fontFamily: 'monospace' }}>{item.value}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', color: '#888888', padding: '0.625rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>Reset to Defaults</button>
        <button style={{ background: '#C8A96E', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Save Settings</button>
      </div>
    </div>
  )
}
