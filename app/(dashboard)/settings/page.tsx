'use client'
import { useState } from 'react'
import { useHouseholdStore } from '@/stores/householdStore'
import { DEFAULT_FX_RATES } from '@/lib/constants/countries'

export default function SettingsPage() {
  const { household, updateFxRates } = useHouseholdStore()
  const [fxDraft, setFxDraft] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(household?.fx_rates ?? DEFAULT_FX_RATES).map(([k, v]) => [k, String(v)])
    )
  )
  const [saved, setSaved] = useState(false)

  function handleSave() {
    const parsed: Record<string, number> = {}
    for (const [k, v] of Object.entries(fxDraft)) {
      const n = parseFloat(v)
      if (!isNaN(n) && n > 0) parsed[k] = n
    }
    updateFxRates(parsed)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    setFxDraft(Object.fromEntries(Object.entries(DEFAULT_FX_RATES).map(([k, v]) => [k, String(v)])))
  }

  const inputStyle: React.CSSProperties = {
    background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '6px',
    padding: '0.375rem 0.75rem', color: '#E8E8E8', fontSize: '0.875rem',
    fontFamily: 'monospace', outline: 'none', width: '120px', textAlign: 'right',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Settings</h2>
        <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
          Configure household profile, FX conversion rates, and display preferences. FX rate changes apply immediately to all views.
        </p>
      </div>

      {/* Household info */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1E1E1E', background: '#0A0A0A' }}>
          <p style={{ color: '#E8E8E8', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>Household</p>
        </div>
        {[
          { label: 'Household Name', value: household?.name ?? '—' },
          { label: 'Base Currency', value: household?.base_currency ?? 'CAD' },
          { label: 'Country', value: household?.country === 'CA' ? 'Canada (Ontario)' : household?.country ?? '—' },
        ].map((item, i) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.5rem', borderTop: i > 0 ? '1px solid #1E1E1E' : 'none' }}>
            <span style={{ color: '#888888', fontSize: '0.875rem' }}>{item.label}</span>
            <span style={{ color: '#E8E8E8', fontSize: '0.875rem', fontFamily: 'monospace' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* FX Rates */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1E1E1E', background: '#0A0A0A' }}>
          <p style={{ color: '#E8E8E8', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>FX Rates</p>
          <p style={{ color: '#888888', fontSize: '0.75rem', margin: '0.125rem 0 0' }}>
            Units of foreign currency per 1 {household?.base_currency ?? 'CAD'}. Used to convert overseas assets and foreign-currency transactions.
          </p>
        </div>
        {Object.entries(fxDraft).map(([currency, value], i) => (
          <div key={currency} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.5rem', borderTop: i > 0 ? '1px solid #1E1E1E' : 'none' }}>
            <div>
              <span style={{ color: '#E8E8E8', fontSize: '0.875rem', fontWeight: 500 }}>{currency}</span>
              <span style={{ color: '#444444', fontSize: '0.75rem', marginLeft: '0.5rem' }}>per 1 {household?.base_currency ?? 'CAD'}</span>
            </div>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={value}
              onChange={e => setFxDraft(d => ({ ...d, [currency]: e.target.value }))}
              style={inputStyle}
            />
          </div>
        ))}
        <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #1E1E1E', background: '#0A0A0A' }}>
          <p style={{ color: '#444444', fontSize: '0.75rem', margin: 0 }}>
            Example: INR 69.2 means 1 CAD = 69.2 INR. Overseas asset values are divided by this rate to convert to {household?.base_currency ?? 'CAD'}.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button onClick={handleReset} style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', color: '#888888', padding: '0.625rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          style={{ background: saved ? '#4ADE80' : '#C8A96E', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </div>

      <p style={{ color: '#444444', fontSize: '0.75rem', textAlign: 'center' }}>
        FX rate changes apply to overseas assets and foreign-currency transactions immediately. Connect Supabase to persist across sessions.
      </p>
    </div>
  )
}
