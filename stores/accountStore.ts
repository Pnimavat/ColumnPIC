import { create } from 'zustand'
import { Account } from '@/types'

const now = new Date().toISOString()

const SAMPLE_ACCOUNTS: Account[] = [
  {
    id: 'acc-001', household_id: 'hh-001', member_id: 'mem-001',
    account_name: 'Wealthsimple TFSA', account_type: 'TFSA', institution: 'Wealthsimple',
    current_balance: 28400, currency: 'CAD', all_time_return: 14.2,
    contribution_room: 0, annual_limit: 7000, lifetime_limit: null,
    is_tax_deductible: false, is_tax_free_growth: true, is_tax_free_withdrawal: true,
    country: 'CA', notes: 'Maxed for 2026',
    holdings: [{ symbol: 'XEQT', pct: 80, assessment: 'Global equity' }, { symbol: 'CASH', pct: 20, assessment: 'HISA' }],
    last_updated: now, created_at: now, updated_at: now,
  },
  {
    id: 'acc-002', household_id: 'hh-001', member_id: 'mem-001',
    account_name: 'Wealthsimple FHSA', account_type: 'FHSA', institution: 'Wealthsimple',
    current_balance: 16000, currency: 'CAD', all_time_return: 9.8,
    contribution_room: 4000, annual_limit: 8000, lifetime_limit: 40000,
    is_tax_deductible: true, is_tax_free_growth: true, is_tax_free_withdrawal: true,
    country: 'CA', notes: 'Contributed $4K this year',
    holdings: [{ symbol: 'XEQT', pct: 100, assessment: 'Growth phase' }],
    last_updated: now, created_at: now, updated_at: now,
  },
  {
    id: 'acc-003', household_id: 'hh-001', member_id: 'mem-001',
    account_name: 'Employer RRSP (Sun Life)', account_type: 'RRSP', institution: 'Sun Life',
    current_balance: 47200, currency: 'CAD', all_time_return: 11.3,
    contribution_room: 9200, annual_limit: null, lifetime_limit: null,
    is_tax_deductible: true, is_tax_free_growth: true, is_tax_free_withdrawal: false,
    country: 'CA', notes: 'Employer match 3%',
    holdings: [{ symbol: 'Balanced', pct: 60, assessment: '60/40 portfolio' }, { symbol: 'Bonds', pct: 40, assessment: 'Fixed income' }],
    last_updated: now, created_at: now, updated_at: now,
  },
  {
    id: 'acc-004', household_id: 'hh-001', member_id: 'mem-002',
    account_name: 'Wealthsimple TFSA', account_type: 'TFSA', institution: 'Wealthsimple',
    current_balance: 15600, currency: 'CAD', all_time_return: 10.1,
    contribution_room: 1400, annual_limit: 7000, lifetime_limit: null,
    is_tax_deductible: false, is_tax_free_growth: true, is_tax_free_withdrawal: true,
    country: 'CA', notes: null,
    holdings: [{ symbol: 'XGRO', pct: 100, assessment: 'Growth ETF' }],
    last_updated: now, created_at: now, updated_at: now,
  },
  {
    id: 'acc-005', household_id: 'hh-001', member_id: 'mem-002',
    account_name: 'Wealthsimple FHSA', account_type: 'FHSA', institution: 'Wealthsimple',
    current_balance: 5000, currency: 'CAD', all_time_return: 6.5,
    contribution_room: 3000, annual_limit: 8000, lifetime_limit: 40000,
    is_tax_deductible: true, is_tax_free_growth: true, is_tax_free_withdrawal: true,
    country: 'CA', notes: 'Opened 2024',
    holdings: [{ symbol: 'XEQT', pct: 100, assessment: 'Global equity' }],
    last_updated: now, created_at: now, updated_at: now,
  },
]

interface AccountStore {
  accounts: Account[]
  addAccount: (a: Account) => void
  updateAccount: (id: string, updates: Partial<Account>) => void
  deleteAccount: (id: string) => void
}

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: SAMPLE_ACCOUNTS,
  addAccount: (a) => set(s => ({ accounts: [...s.accounts, a] })),
  updateAccount: (id, updates) => set(s => ({ accounts: s.accounts.map(a => a.id === id ? { ...a, ...updates } : a) })),
  deleteAccount: (id) => set(s => ({ accounts: s.accounts.filter(a => a.id !== id) })),
}))
