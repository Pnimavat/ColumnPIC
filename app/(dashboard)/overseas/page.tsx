'use client'
import { useMemo } from 'react'
import { useForeignAssetStore } from '@/stores/foreignAssetStore'
import { useHouseholdStore } from '@/stores/householdStore'
import { useUIStore } from '@/stores/uiStore'
import { KPICard } from '@/components/dashboard/KPICard'
import { ForeignAssetModal } from '@/components/overseas/ForeignAssetModal'
import { formatAmount } from '@/lib/utils/format'
import { ForeignAsset } from '@/types'

const TYPE_ICONS: Record<ForeignAsset['asset_type'], string> = {
  Property: '🏠', SIP: '📈', Gold: '🥇', Vehicle: '🚗',
  FD: '🏦', Stock: '📊', Business: '🏢', Other: '◉',
}

const COUNTRY_FLAGS: Record<string, string> = {
  IN: '🇮🇳', US: '🇺🇸', GB: '🇬🇧', AU: '🇦🇺', EU: '🇪🇺',
}

export default function OverseasPage() {
  const { foreignAssets } = useForeignAssetStore()
  const { household } = useHouseholdStore()
  const { openForeignAssetModal } = useUIStore()
  const fxRates = household?.fx_rates ?? {}
  const baseCurrency = household?.base_currency ?? 'CAD'

  function toCAD(amount: number, currency: string): number {
    if (currency === baseCurrency) return amount
    const rate = fxRates[currency]
    return rate ? amount / rate : amount
  }

  const stats = useMemo(() => {
    const active = foreignAssets.filter(a => a.is_active)
    const totalValueCAD = active.reduce((s, a) => s + toCAD(a.current_value ?? 0, a.currency), 0)
    const monthlyCAD = active.reduce((s, a) => s + toCAD(a.monthly_commitment, a.currency), 0)
    const countries = new Set(active.map(a => a.country)).size
    const assetTypes = new Set(active.map(a => a.asset_type)).size
    return { totalValueCAD, monthlyCAD, countries, assetTypes }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foreignAssets, fxRates])

  const byCountry = useMemo(() => {
    const map: Record<string, ForeignAsset[]> = {}
    for (const a of foreignAssets) {
      if (!map[a.country]) map[a.country] = []
      map[a.country].push(a)
    }
    return map
  }, [foreignAssets])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, color: '#FB923C' }}>◉</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Overseas Assets</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            Foreign investments, property, and savings converted to {baseCurrency}. Monthly commitments tracked automatically.
          </p>
        </div>
        <button onClick={() => openForeignAssetModal('add')} style={{ background: '#FB923C', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', flexShrink: 0 }}>+ Add Asset</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <KPICard label={`Total Value (${baseCurrency})`} value={formatAmount(stats.totalValueCAD, baseCurrency, true)} subvalue="All assets converted" color="#FB923C" />
        <KPICard label="Monthly Commitment" value={formatAmount(stats.monthlyCAD, baseCurrency)} subvalue="SIPs + contributions" color="#FBBF24" />
        <KPICard label="Countries" value={String(stats.countries)} subvalue="Active jurisdictions" color="#60A5FA" />
        <KPICard label="Asset Types" value={String(stats.assetTypes)} subvalue="Unique categories" color="#C084FC" />
      </div>

      {/* By country */}
      {Object.entries(byCountry).map(([country, assets]) => {
        const countryTotalCAD = assets.reduce((s, a) => s + toCAD(a.current_value ?? 0, a.currency), 0)
        const countryMonthlyCAD = assets.reduce((s, a) => s + toCAD(a.monthly_commitment, a.currency), 0)
        const flag = COUNTRY_FLAGS[country] ?? '🌍'

        return (
          <div key={country} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Country header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1E1E1E', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{flag}</span>
                <span style={{ color: '#E8E8E8', fontSize: '0.9375rem', fontWeight: 600 }}>
                  {country === 'IN' ? 'India' : country === 'US' ? 'United States' : country === 'GB' ? 'United Kingdom' : country}
                </span>
                <span style={{ color: '#888888', fontSize: '0.8125rem' }}>{assets.length} assets</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#FB923C', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9375rem', margin: 0 }}>{formatAmount(countryTotalCAD, baseCurrency, true)}</p>
                {countryMonthlyCAD > 0 && <p style={{ color: '#888888', fontSize: '0.75rem', margin: '0.125rem 0 0' }}>{formatAmount(countryMonthlyCAD, baseCurrency)}/mo ongoing</p>}
              </div>
            </div>

            {/* Asset rows */}
            <div>
              {assets.map((a, i) => {
                const valueCAD = toCAD(a.current_value ?? 0, a.currency)
                const monthlyCAD = toCAD(a.monthly_commitment, a.currency)
                const gain = a.purchase_value ? a.current_value! - a.purchase_value : null
                const gainPct = a.purchase_value && a.purchase_value > 0 ? ((a.current_value! - a.purchase_value) / a.purchase_value) * 100 : null

                return (
                  <div key={a.id} style={{ padding: '1.125rem 1.5rem', borderTop: i > 0 ? '1px solid #1E1E1E' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{TYPE_ICONS[a.asset_type]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#E8E8E8', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.asset_name}</p>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '4px', background: '#1E1E1E', color: '#888888', textTransform: 'uppercase' }}>{a.asset_type}</span>
                        {a.notes && <span style={{ color: '#444444', fontSize: '0.75rem' }}>{a.notes}</span>}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: '#E8E8E8', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.9375rem', margin: 0 }}>
                        {a.current_value !== null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: a.currency, maximumFractionDigits: 0 }).format(a.current_value) : '—'}
                      </p>
                      <p style={{ color: '#888888', fontSize: '0.75rem', margin: '0.125rem 0 0' }}>{formatAmount(valueCAD, baseCurrency)}</p>
                      {gainPct !== null && (
                        <p style={{ color: gainPct >= 0 ? '#4ADE80' : '#F87171', fontSize: '0.6875rem', margin: '0.125rem 0 0', fontWeight: 600 }}>
                          {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%
                        </p>
                      )}
                    </div>

                    {monthlyCAD > 0 && (
                      <div style={{ flexShrink: 0, textAlign: 'right', minWidth: '80px' }}>
                        <p style={{ color: '#60A5FA', fontSize: '0.8125rem', fontFamily: 'monospace', margin: 0 }}>{formatAmount(monthlyCAD, baseCurrency)}/mo</p>
                      </div>
                    )}
                    <button onClick={() => openForeignAssetModal('edit', a.id)} style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '6px', color: '#888888', padding: '0.25rem 0.5rem', fontSize: '0.6875rem', cursor: 'pointer', flexShrink: 0 }}>Edit</button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* FX note */}
      <p style={{ color: '#444444', fontSize: '0.75rem', textAlign: 'center' }}>
        Values converted at stored FX rates — update rates in Settings to refresh.
      </p>

      <ForeignAssetModal />
    </div>
  )
}
