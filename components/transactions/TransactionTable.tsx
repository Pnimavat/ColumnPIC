'use client'
import { useState, useMemo } from 'react'
import { useTransactionStore } from '@/stores/transactionStore'
import { useHouseholdStore } from '@/stores/householdStore'
import { useUIStore } from '@/stores/uiStore'
import { FlowType } from '@/types'
import { formatAmount } from '@/lib/utils/format'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface Props {
  filterFlow?: FlowType
}

const FLOW_COLORS: Record<FlowType, string> = { In: '#4ADE80', Out: '#F87171', Invest: '#60A5FA' }

export function TransactionTable({ filterFlow }: Props) {
  const { transactions, deleteTransaction, toggleActive } = useTransactionStore()
  const { members, household } = useHouseholdStore()
  const { openTransactionModal, addToast } = useUIStore()
  const baseCurrency = household?.base_currency ?? 'CAD'

  const [search, setSearch] = useState('')
  const [filterMember, setFilterMember] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortKey, setSortKey] = useState<'item' | 'monthly_base' | 'category' | 'frequency'>('monthly_base')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const memberMap = useMemo(() => Object.fromEntries(members.map(m => [m.id, m])), [members])

  const filtered = useMemo(() => {
    let rows = transactions
    if (filterFlow) rows = rows.filter(t => t.flow === filterFlow)
    if (search) rows = rows.filter(t => t.item.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    if (filterMember) rows = rows.filter(t => t.member_id === filterMember)
    if (filterCategory) rows = rows.filter(t => t.category === filterCategory)
    return [...rows].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'monthly_base') return (a.monthly_base - b.monthly_base) * dir
      return String(a[sortKey]).localeCompare(String(b[sortKey])) * dir
    })
  }, [transactions, filterFlow, search, filterMember, filterCategory, sortKey, sortDir])

  const categories = useMemo(() => [...new Set(filtered.map(t => t.category))].sort(), [filtered])

  function handleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  function toggleSelect(id: string) {
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function handleConfirmDelete() {
    if (!deleteId) return
    const tx = transactions.find(t => t.id === deleteId)
    deleteTransaction(deleteId)
    setDeleteId(null)
    addToast(`Deleted "${tx?.item}"`, 'info')
  }

  const thStyle: React.CSSProperties = { padding: '0.625rem 0.875rem', fontSize: '0.6875rem', color: '#888888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', background: '#0A0A0A', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }
  const tdStyle: React.CSSProperties = { padding: '0.75rem 0.875rem', fontSize: '0.875rem', color: '#E8E8E8', verticalAlign: 'middle' }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.5rem 0.875rem', color: '#E8E8E8', fontSize: '0.875rem', outline: 'none', flex: 1, minWidth: '160px' }} />
        <select value={filterMember} onChange={e => setFilterMember(e.target.value)} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#E8E8E8', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}>
          <option value="">All members</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#E8E8E8', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ color: '#888888', fontSize: '0.8125rem', flexShrink: 0 }}>{filtered.length} rows</span>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '8px', padding: '0.625rem 1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#C8A96E', fontSize: '0.875rem', fontWeight: 600 }}>{selected.size} selected</span>
          <button onClick={() => { addToast(`${selected.size} deleted`, 'info'); setSelected(new Set()) }} style={{ background: '#F87171', color: '#0A0A0A', border: 'none', borderRadius: '6px', padding: '0.375rem 0.75rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
          <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '6px', padding: '0.375rem 0.75rem', color: '#888888', fontSize: '0.8125rem', cursor: 'pointer' }}>Deselect</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E1E1E' }}>
                <th style={{ ...thStyle, width: '40px' }}>
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={e => setSelected(e.target.checked ? new Set(filtered.map(t => t.id)) : new Set())} style={{ accentColor: '#C8A96E' }} />
                </th>
                <th style={thStyle} onClick={() => handleSort('item')}>Item {sortKey === 'item' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={thStyle} onClick={() => handleSort('category')}>Category {sortKey === 'category' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                {!filterFlow && <th style={thStyle}>Flow</th>}
                <th style={thStyle}>Member</th>
                <th style={thStyle} onClick={() => handleSort('frequency')}>Freq {sortKey === 'frequency' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('monthly_base')}>Monthly {sortKey === 'monthly_base' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                <th style={{ ...thStyle, width: '80px' }}>Status</th>
                <th style={{ ...thStyle, width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: '#444444', padding: '3rem' }}>No transactions found</td></tr>
              ) : filtered.map((t, i) => {
                const member = t.member_id ? memberMap[t.member_id] : null
                return (
                  <tr key={t.id} style={{ borderTop: i > 0 ? '1px solid #1E1E1E' : 'none', background: i % 2 === 1 ? '#0D0D0D' : 'transparent', opacity: t.is_active ? 1 : 0.5 }}>
                    <td style={tdStyle}>
                      <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggleSelect(t.id)} style={{ accentColor: '#C8A96E' }} />
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {t.country_flag === 'IN' && <span style={{ fontSize: '0.75rem' }}>🇮🇳</span>}
                        <span style={{ fontWeight: 500 }}>{t.item}</span>
                      </div>
                      {t.notes && <p style={{ color: '#444444', fontSize: '0.75rem', margin: '0.125rem 0 0' }}>{t.notes}</p>}
                    </td>
                    <td style={{ ...tdStyle, color: '#888888' }}>{t.category}</td>
                    {!filterFlow && (
                      <td style={tdStyle}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '100px', background: `${FLOW_COLORS[t.flow]}15`, color: FLOW_COLORS[t.flow], textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.flow}</span>
                      </td>
                    )}
                    <td style={tdStyle}>
                      {member ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${member.color}20`, border: `1px solid ${member.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: member.color, flexShrink: 0 }}>{member.avatar_initials ?? member.name.charAt(0)}</div>
                          <span style={{ color: '#888888', fontSize: '0.8125rem' }}>{member.name}</span>
                        </div>
                      ) : <span style={{ color: '#444444', fontSize: '0.8125rem' }}>Shared</span>}
                    </td>
                    <td style={{ ...tdStyle, color: '#888888', fontSize: '0.8125rem' }}>{t.frequency}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: t.flow === 'In' ? '#4ADE80' : t.flow === 'Invest' ? '#60A5FA' : '#F87171' }}>
                      {formatAmount(t.monthly_base, baseCurrency)}
                      {t.currency !== baseCurrency && <div style={{ color: '#444444', fontSize: '0.75rem', fontWeight: 400 }}>{t.currency} {t.native_amount.toLocaleString()}</div>}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => toggleActive(t.id)} style={{ fontSize: '0.6875rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '100px', background: t.is_active ? 'rgba(74,222,128,0.1)' : '#1E1E1E', color: t.is_active ? '#4ADE80' : '#444444', border: `1px solid ${t.is_active ? 'rgba(74,222,128,0.3)' : '#2A2A2A'}`, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {t.is_active ? 'Active' : 'Off'}
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button onClick={() => openTransactionModal('edit', t.id)} title="Edit" style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '6px', color: '#888888', padding: '0.3rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>✎</button>
                        <button onClick={() => setDeleteId(t.id)} title="Delete" style={{ background: 'none', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '6px', color: '#F87171', padding: '0.3rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Transaction"
        description={`Delete "${transactions.find(t => t.id === deleteId)?.item}"? This cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  )
}
