'use client'
import { useState, useEffect } from 'react'
import { useForeignAssetStore } from '@/stores/foreignAssetStore'
import { useHouseholdStore } from '@/stores/householdStore'
import { useUIStore } from '@/stores/uiStore'
import { ForeignAsset } from '@/types'
import { SUPPORTED_CURRENCIES } from '@/lib/calculations/currency'

const ASSET_TYPES: ForeignAsset['asset_type'][] = ['Property', 'SIP', 'Gold', 'Vehicle', 'FD', 'Stock', 'Business', 'Other']

const COMMON_COUNTRIES = [
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'AU', label: 'Australia' },
  { code: 'EU', label: 'Europe' },
  { code: 'SG', label: 'Singapore' },
  { code: 'AE', label: 'UAE' },
]

export function ForeignAssetModal() {
  const { foreignAssetModalOpen, foreignAssetModalMode, foreignAssetModalId, closeForeignAssetModal } = useUIStore()
  const { foreignAssets, addForeignAsset, updateForeignAsset } = useForeignAssetStore()
  const { household, members } = useHouseholdStore()
  const { addToast } = useUIStore()

  const existing = foreignAssetModalId ? foreignAssets.find(a => a.id === foreignAssetModalId) : null

  const [assetName, setAssetName] = useState('')
  const [assetType, setAssetType] = useState<ForeignAsset['asset_type']>('SIP')
  const [country, setCountry] = useState('IN')
  const [currency, setCurrency] = useState('INR')
  const [currentValue, setCurrentValue] = useState('')
  const [monthlyCommitment, setMonthlyCommitment] = useState('0')
  const [purchaseValue, setPurchaseValue] = useState('')
  const [memberId, setMemberId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing) {
      setAssetName(existing.asset_name)
      setAssetType(existing.asset_type)
      setCountry(existing.country)
      setCurrency(existing.currency)
      setCurrentValue(existing.current_value !== null ? String(existing.current_value) : '')
      setMonthlyCommitment(String(existing.monthly_commitment))
      setPurchaseValue(existing.purchase_value !== null ? String(existing.purchase_value) : '')
      setMemberId(existing.member_id ?? '')
      setIsActive(existing.is_active)
      setNotes(existing.notes ?? '')
    } else {
      setAssetName('')
      setAssetType('SIP')
      setCountry('IN')
      setCurrency('INR')
      setCurrentValue('')
      setMonthlyCommitment('0')
      setPurchaseValue('')
      setMemberId(members[0]?.id ?? '')
      setIsActive(true)
      setNotes('')
    }
    setError('')
  }, [existing, foreignAssetModalOpen, members])

  function handleSave() {
    if (!assetName.trim()) { setError('Asset name is required'); return }
    if (!currentValue) { setError('Current value is required'); return }

    const now = new Date().toISOString()
    const base: Omit<ForeignAsset, 'id'> = {
      household_id: household?.id ?? 'hh-001',
      member_id: memberId || null,
      asset_name: assetName.trim(),
      asset_type: assetType,
      country,
      currency,
      current_value: parseFloat(currentValue) || 0,
      monthly_commitment: parseFloat(monthlyCommitment) || 0,
      purchase_value: purchaseValue !== '' ? parseFloat(purchaseValue) : null,
      notes: notes.trim() || null,
      is_active: isActive,
      created_at: now,
      updated_at: now,
    }

    if (foreignAssetModalMode === 'edit' && foreignAssetModalId) {
      updateForeignAsset(foreignAssetModalId, { ...base, updated_at: now })
      addToast(`Updated "${assetName}"`)
    } else {
      const id = 'fa-' + Math.random().toString(36).slice(2)
      addForeignAsset({ ...base, id })
      addToast(`Added "${assetName}"`)
    }
    closeForeignAssetModal()
  }

  if (!foreignAssetModalOpen) return null

  const inputStyle: React.CSSProperties = { width: '100%', background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.625rem 0.75rem', color: '#E8E8E8', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', color: '#888888', marginBottom: '0.375rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '20px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#E8E8E8', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            {foreignAssetModalMode === 'edit' ? 'Edit Asset' : 'Add Overseas Asset'}
          </h2>
          <button onClick={closeForeignAssetModal} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Asset type */}
          <div>
            <label style={labelStyle}>Asset Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {ASSET_TYPES.map(t => (
                <button key={t} onClick={() => setAssetType(t)} style={{ padding: '0.375rem 0.75rem', borderRadius: '100px', border: `1px solid ${assetType === t ? '#FB923C' : '#1E1E1E'}`, background: assetType === t ? 'rgba(251,146,60,0.12)' : 'transparent', color: assetType === t ? '#FB923C' : '#888888', fontSize: '0.75rem', fontWeight: assetType === t ? 700 : 400, cursor: 'pointer' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Name */}
          <div>
            <label style={labelStyle}>Asset Name *</label>
            <input value={assetName} onChange={e => setAssetName(e.target.value)} placeholder="e.g. Parag Parikh SIP, Mumbai Flat" style={inputStyle} />
          </div>

          {/* Country + Currency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {COMMON_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label} ({c.code})</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Member */}
          <div>
            <label style={labelStyle}>Assigned To</label>
            <select value={memberId} onChange={e => setMemberId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Household</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          {/* Current Value + Monthly Commitment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Current Value *</label>
              <input type="number" min="0" step="1" value={currentValue} onChange={e => setCurrentValue(e.target.value)} placeholder="0" style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
            <div>
              <label style={labelStyle}>Monthly Commitment</label>
              <input type="number" min="0" step="1" value={monthlyCommitment} onChange={e => setMonthlyCommitment(e.target.value)} placeholder="0" style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
          </div>

          {/* Purchase Value */}
          <div>
            <label style={labelStyle}>Purchase / Cost Basis (optional)</label>
            <input type="number" min="0" step="1" value={purchaseValue} onChange={e => setPurchaseValue(e.target.value)} placeholder="Leave blank if unknown" style={{ ...inputStyle, fontFamily: 'monospace' }} />
            {purchaseValue && currentValue && parseFloat(currentValue) > 0 && (
              <p style={{ color: parseFloat(currentValue) >= parseFloat(purchaseValue) ? '#4ADE80' : '#F87171', fontSize: '0.75rem', margin: '0.25rem 0 0', fontFamily: 'monospace' }}>
                {((parseFloat(currentValue) - parseFloat(purchaseValue)) / parseFloat(purchaseValue) * 100).toFixed(1)}% gain
              </p>
            )}
          </div>

          {/* Active + Notes */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ accentColor: '#FB923C', width: '14px', height: '14px' }} />
            <span style={{ color: '#888888', fontSize: '0.8125rem' }}>Active (included in totals)</span>
          </label>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." rows={2} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          {error && <p style={{ color: '#F87171', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #1E1E1E', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={closeForeignAssetModal} style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', color: '#888888', padding: '0.625rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ background: '#FB923C', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
            {foreignAssetModalMode === 'edit' ? 'Save Changes' : 'Add Asset'}
          </button>
        </div>
      </div>
    </div>
  )
}
