import { create } from 'zustand'
import { Transaction } from '@/types'

const today = new Date().toISOString().split('T')[0]

const SAMPLE_TRANSACTIONS: Transaction[] = [
  // Income
  { id: 't-001', household_id: 'hh-001', member_id: 'mem-001', item: 'Tech Corp Salary', category: 'Employment', subcategory: null, flow: 'In', treatment: 'Income', frequency: 'Biweekly', currency: 'CAD', native_amount: 4000, monthly_base: 8666.67, is_pre_deducted: false, is_shared: false, country_flag: 'CA', notes: 'Net after tax', tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-002', household_id: 'hh-001', member_id: 'mem-002', item: 'Health Services Salary', category: 'Employment', subcategory: null, flow: 'In', treatment: 'Income', frequency: 'Biweekly', currency: 'CAD', native_amount: 2800, monthly_base: 6066.67, is_pre_deducted: false, is_shared: false, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-003', household_id: 'hh-001', member_id: 'mem-001', item: 'Family Rental Income', category: 'Rental', subcategory: null, flow: 'In', treatment: 'Income', frequency: 'Monthly', currency: 'INR', native_amount: 35000, monthly_base: 505.78, is_pre_deducted: false, is_shared: true, country_flag: 'IN', notes: 'Mumbai property', tags: ['overseas'], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Fixed Expenses
  { id: 't-004', household_id: 'hh-001', member_id: null, item: 'Rent', category: 'Housing', subcategory: null, flow: 'Out', treatment: 'Fixed', frequency: 'Monthly', currency: 'CAD', native_amount: 2800, monthly_base: 2800, is_pre_deducted: false, is_shared: true, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-005', household_id: 'hh-001', member_id: 'mem-001', item: 'Car Insurance', category: 'Insurance', subcategory: null, flow: 'Out', treatment: 'Fixed', frequency: 'Monthly', currency: 'CAD', native_amount: 280, monthly_base: 280, is_pre_deducted: false, is_shared: false, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-006', household_id: 'hh-001', member_id: null, item: 'Internet + Phone', category: 'Utilities', subcategory: null, flow: 'Out', treatment: 'Fixed', frequency: 'Monthly', currency: 'CAD', native_amount: 180, monthly_base: 180, is_pre_deducted: false, is_shared: true, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-007', household_id: 'hh-001', member_id: null, item: 'Netflix + Spotify', category: 'Subscriptions', subcategory: null, flow: 'Out', treatment: 'Fixed', frequency: 'Monthly', currency: 'CAD', native_amount: 42, monthly_base: 42, is_pre_deducted: false, is_shared: true, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Variable Expenses
  { id: 't-008', household_id: 'hh-001', member_id: null, item: 'Groceries', category: 'Groceries', subcategory: null, flow: 'Out', treatment: 'Variable', frequency: 'Monthly', currency: 'CAD', native_amount: 900, monthly_base: 900, is_pre_deducted: false, is_shared: true, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-009', household_id: 'hh-001', member_id: null, item: 'Dining Out', category: 'Dining', subcategory: null, flow: 'Out', treatment: 'Variable', frequency: 'Monthly', currency: 'CAD', native_amount: 400, monthly_base: 400, is_pre_deducted: false, is_shared: true, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-010', household_id: 'hh-001', member_id: null, item: 'Transport / Gas', category: 'Transport', subcategory: null, flow: 'Out', treatment: 'Variable', frequency: 'Monthly', currency: 'CAD', native_amount: 250, monthly_base: 250, is_pre_deducted: false, is_shared: true, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  // Investments
  { id: 't-011', household_id: 'hh-001', member_id: 'mem-001', item: 'Wealthsimple TFSA', category: 'TFSA', subcategory: null, flow: 'Invest', treatment: 'Wealth', frequency: 'Monthly', currency: 'CAD', native_amount: 583, monthly_base: 583, is_pre_deducted: false, is_shared: false, country_flag: 'CA', notes: '~$7K/yr', tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-012', household_id: 'hh-001', member_id: 'mem-001', item: 'Wealthsimple FHSA', category: 'FHSA', subcategory: null, flow: 'Invest', treatment: 'Wealth', frequency: 'Monthly', currency: 'CAD', native_amount: 666, monthly_base: 666, is_pre_deducted: false, is_shared: false, country_flag: 'CA', notes: '~$8K/yr', tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-013', household_id: 'hh-001', member_id: 'mem-001', item: 'Employer RRSP Match', category: 'RRSP', subcategory: null, flow: 'Invest', treatment: 'Wealth', frequency: 'Monthly', currency: 'CAD', native_amount: 400, monthly_base: 400, is_pre_deducted: true, is_shared: false, country_flag: 'CA', notes: 'Pre-payroll deduction', tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-014', household_id: 'hh-001', member_id: 'mem-002', item: 'Wealthsimple TFSA', category: 'TFSA', subcategory: null, flow: 'Invest', treatment: 'Wealth', frequency: 'Monthly', currency: 'CAD', native_amount: 400, monthly_base: 400, is_pre_deducted: false, is_shared: false, country_flag: 'CA', notes: null, tags: [], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 't-015', household_id: 'hh-001', member_id: 'mem-001', item: 'India SIP (Parag Parikh)', category: 'SIP', subcategory: null, flow: 'Invest', treatment: 'Wealth', frequency: 'Monthly', currency: 'INR', native_amount: 25000, monthly_base: 361.27, is_pre_deducted: false, is_shared: false, country_flag: 'IN', notes: null, tags: ['overseas'], is_active: true, effective_from: today, effective_to: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

interface TransactionStore {
  transactions: Transaction[]
  addTransaction: (t: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  toggleActive: (id: string) => void
  bulkDelete: (ids: string[]) => void
  bulkToggleActive: (ids: string[], active: boolean) => void
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: SAMPLE_TRANSACTIONS,
  addTransaction: (t) => set(s => ({ transactions: [t, ...s.transactions] })),
  updateTransaction: (id, updates) => set(s => ({ transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t) })),
  deleteTransaction: (id) => set(s => ({ transactions: s.transactions.filter(t => t.id !== id) })),
  toggleActive: (id) => set(s => ({ transactions: s.transactions.map(t => t.id === id ? { ...t, is_active: !t.is_active } : t) })),
  bulkDelete: (ids) => set(s => ({ transactions: s.transactions.filter(t => !ids.includes(t.id)) })),
  bulkToggleActive: (ids, active) => set(s => ({ transactions: s.transactions.map(t => ids.includes(t.id) ? { ...t, is_active: active } : t) })),
}))
