import { create } from 'zustand'
import { ForeignAsset } from '@/types'

const now = new Date().toISOString()

const SAMPLE_FOREIGN_ASSETS: ForeignAsset[] = [
  {
    id: 'fa-001', household_id: 'hh-001', member_id: 'mem-001',
    asset_name: 'Parag Parikh Flexi Cap SIP', asset_type: 'SIP',
    country: 'IN', currency: 'INR',
    current_value: 520000, monthly_commitment: 25000, purchase_value: 350000,
    notes: 'PPFCF — long-term equity, 3-year track record',
    is_active: true, created_at: now, updated_at: now,
  },
  {
    id: 'fa-002', household_id: 'hh-001', member_id: 'mem-001',
    asset_name: 'Mumbai Flat (Andheri West)', asset_type: 'Property',
    country: 'IN', currency: 'INR',
    current_value: 8500000, monthly_commitment: 0, purchase_value: 5800000,
    notes: 'Rental income tracked separately under Income',
    is_active: true, created_at: now, updated_at: now,
  },
  {
    id: 'fa-003', household_id: 'hh-001', member_id: 'mem-001',
    asset_name: 'HDFC Fixed Deposit', asset_type: 'FD',
    country: 'IN', currency: 'INR',
    current_value: 350000, monthly_commitment: 0, purchase_value: 300000,
    notes: '7.25% 2-year term, matures Dec 2026',
    is_active: true, created_at: now, updated_at: now,
  },
  {
    id: 'fa-004', household_id: 'hh-001', member_id: 'mem-001',
    asset_name: 'PPF Account (SBI)', asset_type: 'Other',
    country: 'IN', currency: 'INR',
    current_value: 185000, monthly_commitment: 5000, purchase_value: 130000,
    notes: '7.1% tax-free, long-term lock-in',
    is_active: true, created_at: now, updated_at: now,
  },
]

interface ForeignAssetStore {
  foreignAssets: ForeignAsset[]
  addForeignAsset: (a: ForeignAsset) => void
  updateForeignAsset: (id: string, updates: Partial<ForeignAsset>) => void
  deleteForeignAsset: (id: string) => void
}

export const useForeignAssetStore = create<ForeignAssetStore>((set) => ({
  foreignAssets: SAMPLE_FOREIGN_ASSETS,
  addForeignAsset: (a) => set(s => ({ foreignAssets: [...s.foreignAssets, a] })),
  updateForeignAsset: (id, updates) => set(s => ({ foreignAssets: s.foreignAssets.map(a => a.id === id ? { ...a, ...updates } : a) })),
  deleteForeignAsset: (id) => set(s => ({ foreignAssets: s.foreignAssets.filter(a => a.id !== id) })),
}))
