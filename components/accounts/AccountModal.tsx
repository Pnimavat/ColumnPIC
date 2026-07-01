'use client'
import { useState, useEffect } from 'react'
import { useAccountStore } from '@/stores/accountStore'
import { useHouseholdStore } from '@/stores/householdStore'
import { useUIStore } from '@/stores/uiStore'
import { Account, AccountType, Holding } from '@/types'
import { ACCOUNT_CONFIGS } from '@/lib/calculations/accounts'
import { SUPPORTED_CURRENCIES } from '@/lib/calculations/currency'

const ACCOUNT_TYPES = Object.keys(ACCOUNT_CONFIGS) as AccountType[]

export function AccountModal() {
  const { accountModalOpen, accountModalMode, accountModalId, closeAccountModal } = useUIStore()
  const { accounts, addAccount, updateAccount } = useAccountStore()
  const { household, members } = useHouseholdStore()
  const { addToast } = useUIStore()

  const existing = accountModalId ? accounts.find(a => a.id === accountModalId) : null

  const [accountName, setAccountName] = useState('')
  const [accountType, setAccountType] = useState<AccountType>('TFSA')
  const [institution, setInstitution] = useState('')
  const [memberId, setMemberId] = useState('')
  const [balance, setBalance] = useState('')
  const [currency, setCurrency] = useState('CAD')
  const [allTimeReturn, setAllTimeReturn] = useState('')
  const [contributionRoom, setContributionRoom] = useState('')
  const [notes, setNotes] = useState('')
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [holdingSymbol, setHoldingSymbol] = useState('')
  const [holdingPct, setHoldingPct] = useState('')
  const [error, setError] = useState('')

  const cfg = ACCOUNT_CONFIGS[accountType]

  useEffect(() => {
    if (existing) {
      setAccountName(existing.account_name)
      setAccountType(existing.account_type)
      setInstitution(existing.institution ?? '')
      setMemberId(existing.member_id ?? '')
      setBalance(String(existing.current_balance))
      setCurrency(existing.currency)
      setAllTimeReturn(existing.all_time_return !== null ? String(existing.all_time_return) : '')
      setContributionRoom(existing.contribution_room !== null ? String(existing.contribution_room) : '')
      setNotes(existing.notes ?? '')
      setHoldings(existing.holdings ?? [])
    } else {
      setAccountName('')
      setAccountType('TFSA')
      setInstitution('')
      setMemberId(members[0]?.id ?? '')
      setBalance('')
      setCurrency('CAD')
      setAllTimeReturn('')
      setContributionRoom('')
      setNotes('')
      setHoldings([])
    }
    setHoldingSymbol('')
    setHoldingPct('')
    setError('')
  }, [existing, accountModalOpen, members])

  // Auto-fill contribution room when type changes (only in add mode)
  useEffect(() => {
    if (accountModalMode === 'add' && cfg.annualLimit) {
      setContributionRoom(String(cfg.annualLimit))
    }
  }, [accountType, accountModalMode, cfg.annualLimit])

  function addHolding() {
    if (!holdingSymbol.trim() || !holdingPct) return
    const pct = parseFloat(holdingPct)
    if (isNaN(pct) || pct <= 0 || pct > 100) return
    setHoldings(h => [...h, { symbol: holdingSymbol.trim().toUpperCase(), pct, assessment: '' }])
    setHoldingSymbol('')
    setHoldingPct('')
  }

  function removeHolding(i: number) {
    setHoldings(h => h.filter((_, idx) => idx !== i))
  }

  function handleSave() {
    if (!accountName.trim()) { setError('Account name is required'); return }
    if (!balance || parseFloat(balance) < 0) { setError('Balance must be 0 or greater'); return }

    const now = new Date().toISOString()
    const base: Omit<Account, 'id'> = {
      household_id: household?.id ?? 'hh-001',
      member_id: memberId || null,
      account_name: accountName.trim(),
      account_type: accountType,
      institution: institution.trim() || null,
      current_balance: parseFloat(balance) || 0,
      currency,
      all_time_return: allTimeReturn !== '' ? parseFloat(allTimeReturn) : null,
      contribution_room: contributionRoom !== '' ? parseFloat(contributionRoom) : null,
      annual_limit: cfg.annualLimit,
      lifetime_limit: cfg.lifetimeLimit,
      is_tax_deductible: cfg.isTaxDeductible,
      is_tax_free_growth: cfg.isTaxFreeGrowth,
      is_tax_free_withdrawal: cfg.isTaxFreeWithdrawal,
      country: cfg.country,
      notes: notes.trim() || null,
      holdings,
      last_updated: now,
      created_at: now,
      updated_at: now,
    }

    if (accountModalMode === 'edit' && accountModalId) {
      updateAccount(accountModalId, { ...base, updated_at: now })
      addToast(`Updated "${accountName}"`)
    } else {
      const id = 'acc-' + Math.random().toString(36).slice(2)
      addAccount({ ...base, id })
      addToast(`Added "${accountName}"`)
    }
    closeAccountModal()
  }

  if (!accountModalOpen) return null

  const inputStyle: React.CSSProperties = { width: '100%', background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.625rem 0.75rem', color: '#E8E8E8', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', color: '#888888', marginBottom: '0.375rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }
  const hasRoom = cfg.annualLimit !== null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#E8E8E8', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            {accountModalMode === 'edit' ? 'Edit Account' : 'Add Account'}
          </h2>
          <button onClick={closeAccountModal} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Account Type */}
          <div>
            <label style={labelStyle}>Account Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {ACCOUNT_TYPES.map(t => (
                <button key={t} onClick={() => setAccountType(t)} style={{ padding: '0.375rem 0.75rem', borderRadius: '100px', border: `1px solid ${accountType === t ? '#C8A96E' : '#1E1E1E'}`, background: accountType === t ? 'rgba(200,169,110,0.12)' : 'transparent', color: accountType === t ? '#C8A96E' : '#888888', fontSize: '0.75rem', fontWeight: accountType === t ? 700 : 400, cursor: 'pointer' }}>
                  {t}
                </button>
              ))}
            </div>
            {/* Tax flags badge */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {cfg.isTaxDeductible && <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'rgba(96,165,250,0.1)', color: '#60A5FA' }}>Tax Deductible</span>}
              {cfg.isTaxFreeGrowth && <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'rgba(74,222,128,0.1)', color: '#4ADE80' }}>Tax-Free Growth</span>}
              {cfg.isTaxFreeWithdrawal && <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '4px', background: 'rgba(192,132,252,0.1)', color: '#C084FC' }}>Tax-Free Withdrawal</span>}
            </div>
          </div>

          {/* Account Name + Institution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Account Name *</label>
              <input value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="e.g. Wealthsimple TFSA" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Institution</label>
              <input value={institution} onChange={e => setInstitution(e.target.value)} placeholder="e.g. Wealthsimple" style={inputStyle} />
            </div>
          </div>

          {/* Member + Currency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Assigned To</label>
              <select value={memberId} onChange={e => setMemberId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Household</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Balance + Return */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Current Balance *</label>
              <input type="number" min="0" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} placeholder="0.00" style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
            <div>
              <label style={labelStyle}>All-time Return %</label>
              <input type="number" step="0.1" value={allTimeReturn} onChange={e => setAllTimeReturn(e.target.value)} placeholder="e.g. 12.4" style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
          </div>

          {/* Contribution Room (only for registered accounts) */}
          {hasRoom && (
            <div>
              <label style={labelStyle}>Contribution Room Remaining</label>
              <input type="number" min="0" step="1" value={contributionRoom} onChange={e => setContributionRoom(e.target.value)} placeholder="0" style={{ ...inputStyle, fontFamily: 'monospace' }} />
              <p style={{ color: '#444444', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                Annual limit: ${cfg.annualLimit?.toLocaleString() ?? '—'}{cfg.lifetimeLimit ? ` · Lifetime: $${cfg.lifetimeLimit.toLocaleString()}` : ''}
              </p>
            </div>
          )}

          {/* Holdings */}
          <div>
            <label style={labelStyle}>Holdings</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input value={holdingSymbol} onChange={e => setHoldingSymbol(e.target.value)} placeholder="Symbol (e.g. XEQT)" style={{ ...inputStyle, width: '50%' }} onKeyDown={e => e.key === 'Enter' && addHolding()} />
              <input type="number" min="0" max="100" step="1" value={holdingPct} onChange={e => setHoldingPct(e.target.value)} placeholder="%" style={{ ...inputStyle, width: '30%', fontFamily: 'monospace' }} onKeyDown={e => e.key === 'Enter' && addHolding()} />
              <button onClick={addHolding} style={{ background: '#1E1E1E', border: '1px solid #2E2E2E', borderRadius: '8px', color: '#888888', padding: '0 0.75rem', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}>+</button>
            </div>
            {holdings.length > 0 && (
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {holdings.map((h, i) => (
                  <span key={i} onClick={() => removeHolding(i)} style={{ fontSize: '0.6875rem', padding: '0.25rem 0.625rem', borderRadius: '4px', background: '#1A1A1A', color: '#888888', border: '1px solid #1E1E1E', cursor: 'pointer' }} title="Click to remove">
                    {h.symbol} {h.pct}% ✕
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." rows={2} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          {error && <p style={{ color: '#F87171', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #1E1E1E', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={closeAccountModal} style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', color: '#888888', padding: '0.625rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ background: '#C084FC', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
            {accountModalMode === 'edit' ? 'Save Changes' : 'Add Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
