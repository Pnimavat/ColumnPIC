import { create } from 'zustand'
import { Household, Member } from '@/types'
import { DEFAULT_FX_RATES } from '@/lib/constants/countries'

const SAMPLE_HOUSEHOLD: Household = {
  id: 'hh-001',
  owner_id: 'user-001',
  name: 'The Nimavat Family',
  base_currency: 'CAD',
  country: 'CA',
  fx_rates: DEFAULT_FX_RATES,
  settings: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const SAMPLE_MEMBERS: Member[] = [
  {
    id: 'mem-001',
    household_id: 'hh-001',
    name: 'Prakash',
    role: 'primary',
    color: '#C8A96E',
    avatar_initials: 'PN',
    gross_annual: 145000,
    tax_rate: 43.41,
    employer: 'Tech Corp',
    notes: null,
    is_active: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mem-002',
    household_id: 'hh-001',
    name: 'Manali',
    role: 'spouse',
    color: '#60A5FA',
    avatar_initials: 'MN',
    gross_annual: 98000,
    tax_rate: 37.16,
    employer: 'Health Services',
    notes: null,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
]

interface HouseholdStore {
  household: Household | null
  members: Member[]
  setHousehold: (h: Household) => void
  setMembers: (m: Member[]) => void
  addMember: (m: Member) => void
  updateMember: (id: string, updates: Partial<Member>) => void
  deleteMember: (id: string) => void
  updateFxRates: (rates: Record<string, number>) => void
}

export const useHouseholdStore = create<HouseholdStore>((set) => ({
  household: SAMPLE_HOUSEHOLD,
  members: SAMPLE_MEMBERS,
  setHousehold: (h) => set({ household: h }),
  setMembers: (m) => set({ members: m }),
  addMember: (m) => set(s => ({ members: [...s.members, m] })),
  updateMember: (id, updates) => set(s => ({ members: s.members.map(m => m.id === id ? { ...m, ...updates } : m) })),
  deleteMember: (id) => set(s => ({ members: s.members.filter(m => m.id !== id) })),
  updateFxRates: (rates) => set(s => ({
    household: s.household ? { ...s.household, fx_rates: rates } : null
  })),
}))
