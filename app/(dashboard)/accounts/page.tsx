'use client'
import { useMemo } from 'react'
import { useAccountStore } from '@/stores/accountStore'
import { useHouseholdStore } from '@/stores/householdStore'
import { useUIStore } from '@/stores/uiStore'
import { KPICard } from '@/components/dashboard/KPICard'
import { AccountModal } from '@/components/accounts/AccountModal'
import { formatAmount } from '@/lib/utils/format'
import { AccountType } from '@/types'

const TYPE_COLORS: Record<AccountType, string> = {
  TFSA: '#4ADE80', RRSP: '#60A5FA', FHSA: '#C8A96E',
  '401k': '#34D399', ISA: '#A78BFA', 'Non-Reg': '#888888',
  Pension: '#FB923C', Crypto: '#C084FC', Property: '#F59E0B', Other: '#6B7280',
}

export default function AccountsPage() {
  const { accounts } = useAccountStore()
  const { members, household } = useHouseholdStore()
  const { openAccountModal } = useUIStore()
  const baseCurrency = household?.base_currency ?? 'CAD'

  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((s, a) => s + a.current_balance, 0)
    const tfsaRoom = accounts.filter(a => a.account_type === 'TFSA').reduce((s, a) => s + (a.contribution_room ?? 0), 0)
    const fhsaRoom = accounts.filter(a => a.account_type === 'FHSA').reduce((s, a) => s + (a.contribution_room ?? 0), 0)
    const rrspRoom = accounts.filter(a => a.account_type === 'RRSP').reduce((s, a) => s + (a.contribution_room ?? 0), 0)
    return { totalBalance, tfsaRoom, fhsaRoom, rrspRoom }
  }, [accounts])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, color: '#C084FC' }}>▣</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>Registered Accounts</h2>
          <p style={{ color: '#888888', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
            Track TFSA, RRSP, FHSA, and investment accounts across household members. Monitor contribution room and tax efficiency.
          </p>
        </div>
        <button onClick={() => openAccountModal('add')} style={{ background: '#C084FC', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', flexShrink: 0 }}>+ Add Account</button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <KPICard label="Total Balance" value={formatAmount(stats.totalBalance, baseCurrency, true)} subvalue={`Across ${accounts.length} accounts`} color="#C084FC" />
        <KPICard label="TFSA Room" value={formatAmount(stats.tfsaRoom, baseCurrency)} subvalue="Remaining 2026 room" color="#4ADE80" />
        <KPICard label="FHSA Room" value={formatAmount(stats.fhsaRoom, baseCurrency)} subvalue="Annual room remaining" color="#C8A96E" />
        <KPICard label="RRSP Room" value={formatAmount(stats.rrspRoom, baseCurrency)} subvalue="Unused contribution room" color="#60A5FA" />
      </div>

      {/* Account cards per member */}
      {members.map(member => {
        const memberAccounts = accounts.filter(a => a.member_id === member.id)
        if (memberAccounts.length === 0) return null
        return (
          <div key={member.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${member.color}20`, border: `2px solid ${member.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: member.color }}>
                {member.avatar_initials ?? member.name.charAt(0)}
              </div>
              <span style={{ color: '#E8E8E8', fontSize: '0.9375rem', fontWeight: 600 }}>{member.name}</span>
              <span style={{ color: '#888888', fontSize: '0.8125rem' }}>— {memberAccounts.length} accounts, {formatAmount(memberAccounts.reduce((s, a) => s + a.current_balance, 0), baseCurrency)} total</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {memberAccounts.map(acc => {
                const typeColor = TYPE_COLORS[acc.account_type] ?? '#888888'
                const hasRoom = acc.annual_limit !== null && acc.annual_limit > 0
                const roomPct = hasRoom ? Math.max(0, Math.min(100, ((acc.annual_limit! - (acc.contribution_room ?? 0)) / acc.annual_limit!) * 100)) : 0
                return (
                  <div key={acc.id} style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ color: '#E8E8E8', fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{acc.account_name}</p>
                        {acc.institution && <p style={{ color: '#888888', fontSize: '0.75rem', margin: 0 }}>{acc.institution}</p>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', marginLeft: '0.5rem' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: '100px', background: `${typeColor}18`, color: typeColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {acc.account_type}
                        </span>
                        <button onClick={() => openAccountModal('edit', acc.id)} style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '6px', color: '#888888', padding: '0.25rem 0.5rem', fontSize: '0.6875rem', cursor: 'pointer' }}>Edit</button>
                      </div>
                    </div>

                    <p style={{ color: typeColor, fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>
                      {formatAmount(acc.current_balance, acc.currency)}
                    </p>
                    {acc.all_time_return !== null && (
                      <p style={{ color: '#888888', fontSize: '0.75rem', margin: '0 0 1rem' }}>
                        All-time return: <span style={{ color: acc.all_time_return >= 0 ? '#4ADE80' : '#F87171', fontWeight: 600 }}>{acc.all_time_return > 0 ? '+' : ''}{acc.all_time_return.toFixed(1)}%</span>
                      </p>
                    )}

                    {/* Contribution room bar */}
                    {hasRoom && (
                      <div style={{ marginBottom: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                          <span style={{ color: '#888888', fontSize: '0.75rem' }}>Annual room used</span>
                          <span style={{ color: '#E8E8E8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            {formatAmount((acc.annual_limit! - (acc.contribution_room ?? 0)), baseCurrency)} / {formatAmount(acc.annual_limit!, baseCurrency)}
                          </span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '100px', background: '#1E1E1E', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '100px', background: typeColor, width: `${roomPct}%`, transition: 'width 0.3s' }} />
                        </div>
                        {acc.contribution_room !== null && acc.contribution_room > 0 && (
                          <p style={{ color: typeColor, fontSize: '0.6875rem', margin: '0.25rem 0 0', fontWeight: 600 }}>
                            {formatAmount(acc.contribution_room, baseCurrency)} remaining room
                          </p>
                        )}
                      </div>
                    )}

                    {/* Lifetime limit for FHSA */}
                    {acc.lifetime_limit !== null && (
                      <div style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.15)', borderRadius: '6px', padding: '0.5rem 0.75rem', marginBottom: '0.875rem' }}>
                        <p style={{ color: '#C8A96E', fontSize: '0.75rem', margin: 0 }}>
                          Lifetime used: {formatAmount(acc.lifetime_limit - (acc.lifetime_limit - acc.current_balance > 0 ? 0 : 0) - 0, baseCurrency)} of {formatAmount(acc.lifetime_limit, baseCurrency)}
                        </p>
                      </div>
                    )}

                    {/* Holdings */}
                    {acc.holdings.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {acc.holdings.map(h => (
                          <span key={h.symbol} style={{ fontSize: '0.6875rem', padding: '0.1875rem 0.5rem', borderRadius: '4px', background: '#1A1A1A', color: '#888888', border: '1px solid #1E1E1E' }} title={h.assessment}>
                            {h.symbol} {h.pct}%
                          </span>
                        ))}
                      </div>
                    )}

                    {acc.notes && <p style={{ color: '#444444', fontSize: '0.75rem', margin: '0.75rem 0 0' }}>{acc.notes}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Tax efficiency tip */}
      <div style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <span style={{ color: '#C8A96E', fontSize: '1rem', flexShrink: 0 }}>◈</span>
        <div>
          <p style={{ color: '#C8A96E', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.25rem' }}>Account Priority: {household?.country ?? 'CA'}</p>
          <p style={{ color: '#888888', fontSize: '0.8125rem', margin: 0 }}>
            Optimal contribution order: FHSA → TFSA → RRSP → Non-Reg.
            FHSA gives both deductibility and tax-free growth — fill it first.
          </p>
        </div>
      </div>
      <AccountModal />
    </div>
  )
}
