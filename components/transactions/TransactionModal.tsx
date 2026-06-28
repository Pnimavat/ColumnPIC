'use client'
import { useState, useEffect } from 'react'
import { useTransactionStore } from '@/stores/transactionStore'
import { useHouseholdStore } from '@/stores/householdStore'
import { useUIStore } from '@/stores/uiStore'
import { Transaction, FlowType, TreatmentType, FrequencyType } from '@/types'
import { toMonthly } from '@/lib/calculations/frequency'
import { toBase, SUPPORTED_CURRENCIES } from '@/lib/calculations/currency'
import { formatAmount } from '@/lib/utils/format'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, INVESTMENT_CATEGORIES } from '@/lib/constants/categories'

export function TransactionModal() {
  const { transactionModalOpen, transactionModalMode, transactionModalId, closeTransactionModal } = useUIStore()
  const { transactions, addTransaction, updateTransaction } = useTransactionStore()
  const { household, members } = useHouseholdStore()
  const { addToast } = useUIStore()

  const existing = transactionModalId ? transactions.find(t => t.id === transactionModalId) : null

  const [flow, setFlow] = useState<FlowType>('Out')
  const [treatment, setTreatment] = useState<TreatmentType>('Fixed')
  const [item, setItem] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [frequency, setFrequency] = useState<FrequencyType>('Monthly')
  const [currency, setCurrency] = useState('CAD')
  const [amount, setAmount] = useState('')
  const [memberId, setMemberId] = useState<string>('')
  const [isPreDeducted, setIsPreDeducted] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [countryFlag, setCountryFlag] = useState('CA')
  const [notes, setNotes] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing) {
      setFlow(existing.flow)
      setTreatment(existing.treatment)
      setItem(existing.item)
      setCategory(existing.category)
      setSubcategory(existing.subcategory ?? '')
      setFrequency(existing.frequency)
      setCurrency(existing.currency)
      setAmount(String(existing.native_amount))
      setMemberId(existing.member_id ?? '')
      setIsPreDeducted(existing.is_pre_deducted)
      setIsShared(existing.is_shared)
      setCountryFlag(existing.country_flag)
      setNotes(existing.notes ?? '')
      setIsActive(existing.is_active)
    } else {
      setFlow('Out')
      setTreatment('Fixed')
      setItem('')
      setCategory('')
      setSubcategory('')
      setFrequency('Monthly')
      setCurrency('CAD')
      setAmount('')
      setMemberId('')
      setIsPreDeducted(false)
      setIsShared(false)
      setCountryFlag('CA')
      setNotes('')
      setIsActive(true)
    }
    setError('')
  }, [existing, transactionModalOpen])

  useEffect(() => {
    if (flow === 'In') setTreatment('Income')
    if (flow === 'Out') setTreatment('Fixed')
    if (flow === 'Invest') setTreatment('Wealth')
    setCategory('')
  }, [flow])

  const categories = flow === 'In' ? INCOME_CATEGORIES : flow === 'Out' ? EXPENSE_CATEGORIES : INVESTMENT_CATEGORIES

  const nativeAmount = parseFloat(amount) || 0
  const fxRates = household?.fx_rates ?? {}
  const baseCurrency = household?.base_currency ?? 'CAD'
  const monthlyBase = toBase(toMonthly(nativeAmount, frequency), currency, fxRates, baseCurrency)

  function handleSave() {
    if (!item.trim()) { setError('Item name is required'); return }
    if (!category) { setError('Category is required'); return }
    if (!amount || nativeAmount <= 0) { setError('Amount must be greater than 0'); return }

    const base: Omit<Transaction, 'id'> = {
      household_id: household?.id ?? 'hh-001',
      member_id: memberId || null,
      item: item.trim(),
      category,
      subcategory: subcategory.trim() || null,
      flow,
      treatment,
      frequency,
      currency,
      native_amount: nativeAmount,
      monthly_base: monthlyBase,
      is_pre_deducted: isPreDeducted,
      is_shared: isShared,
      country_flag: countryFlag,
      notes: notes.trim() || null,
      tags: [],
      is_active: isActive,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (transactionModalMode === 'edit' && transactionModalId) {
      updateTransaction(transactionModalId, { ...base, updated_at: new Date().toISOString() })
      addToast(`Updated "${item}"`)
    } else {
      const id = 't-' + Math.random().toString(36).slice(2)
      addTransaction({ ...base, id })
      addToast(`Added "${item}"`)
    }
    closeTransactionModal()
  }

  if (!transactionModalOpen) return null

  const inputStyle: React.CSSProperties = { width: '100%', background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.625rem 0.75rem', color: '#E8E8E8', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', color: '#888888', marginBottom: '0.375rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }

  const FLOW_OPTIONS: { value: FlowType; label: string; color: string }[] = [
    { value: 'In', label: 'Income (In)', color: '#4ADE80' },
    { value: 'Out', label: 'Expense (Out)', color: '#F87171' },
    { value: 'Invest', label: 'Investment', color: '#60A5FA' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '20px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#E8E8E8', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
            {transactionModalMode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={closeTransactionModal} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Flow type */}
          <div>
            <label style={labelStyle}>Flow Type</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {FLOW_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setFlow(opt.value)} style={{ flex: 1, padding: '0.625rem', borderRadius: '8px', border: `1px solid ${flow === opt.value ? opt.color : '#1E1E1E'}`, background: flow === opt.value ? `${opt.color}15` : 'transparent', color: flow === opt.value ? opt.color : '#888888', fontSize: '0.8125rem', fontWeight: flow === opt.value ? 600 : 400, cursor: 'pointer' }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Item name */}
          <div>
            <label style={labelStyle}>Item Name *</label>
            <input value={item} onChange={e => setItem(e.target.value)} placeholder="e.g. Netflix, Salary, TFSA" style={inputStyle} />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Amount + Currency + Frequency row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.5rem' }}>
            <div>
              <label style={labelStyle}>Amount *</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...selectStyle, width: '90px' }}>
                {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value as FrequencyType)} style={{ ...selectStyle, width: '110px' }}>
                {(['Monthly', 'Weekly', 'Biweekly', 'Annual', 'One-time'] as FrequencyType[]).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Monthly preview */}
          {nativeAmount > 0 && (
            <div style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '8px', padding: '0.625rem 1rem', fontSize: '0.8125rem', color: '#C8A96E', fontFamily: 'monospace' }}>
              = {formatAmount(monthlyBase, baseCurrency)} / month
              {currency !== baseCurrency && ` (${currency} ${nativeAmount.toLocaleString()} → ${baseCurrency})`}
            </div>
          )}

          {/* Member */}
          <div>
            <label style={labelStyle}>Assigned To</label>
            <select value={memberId} onChange={e => setMemberId(e.target.value)} style={selectStyle}>
              <option value="">Household (shared)</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
            </select>
          </div>

          {/* Treatment (only for Out) */}
          {flow === 'Out' && (
            <div>
              <label style={labelStyle}>Treatment</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['Fixed', 'Variable'] as TreatmentType[]).map(t => (
                  <button key={t} onClick={() => setTreatment(t)} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: `1px solid ${treatment === t ? '#C8A96E' : '#1E1E1E'}`, background: treatment === t ? 'rgba(200,169,110,0.12)' : 'transparent', color: treatment === t ? '#C8A96E' : '#888888', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: treatment === t ? 600 : 400 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invest options */}
          {flow === 'Invest' && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={isPreDeducted} onChange={e => setIsPreDeducted(e.target.checked)} style={{ accentColor: '#C8A96E', width: '14px', height: '14px' }} />
                <span style={{ color: '#888888', fontSize: '0.8125rem' }}>Pre-deducted from paycheck</span>
              </label>
            </div>
          )}

          {/* Shared + Active */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={isShared} onChange={e => setIsShared(e.target.checked)} style={{ accentColor: '#C8A96E', width: '14px', height: '14px' }} />
              <span style={{ color: '#888888', fontSize: '0.8125rem' }}>Shared household cost</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ accentColor: '#C8A96E', width: '14px', height: '14px' }} />
              <span style={{ color: '#888888', fontSize: '0.8125rem' }}>Active</span>
            </label>
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
          <button onClick={closeTransactionModal} style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', color: '#888888', padding: '0.625rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ background: '#C8A96E', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
            {transactionModalMode === 'edit' ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
