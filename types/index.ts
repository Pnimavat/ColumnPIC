export type FlowType = 'In' | 'Out' | 'Invest'
export type TreatmentType = 'Income' | 'Fixed' | 'Variable' | 'Wealth'
export type FrequencyType = 'Monthly' | 'Weekly' | 'Biweekly' | 'Annual' | 'One-time'
export type MemberRole = 'primary' | 'spouse' | 'contributor' | 'dependant'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type ActionStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type AccountType = 'TFSA' | 'RRSP' | 'FHSA' | '401k' | 'ISA' | 'Non-Reg' | 'Pension' | 'Crypto' | 'Property' | 'Other'

export interface Household {
  id: string
  owner_id: string
  name: string
  base_currency: string
  country: string
  fx_rates: Record<string, number>
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  household_id: string
  name: string
  role: MemberRole
  color: string
  avatar_initials: string | null
  gross_annual: number | null
  tax_rate: number | null
  employer: string | null
  notes: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Transaction {
  id: string
  household_id: string
  member_id: string | null
  item: string
  category: string
  subcategory: string | null
  flow: FlowType
  treatment: TreatmentType
  frequency: FrequencyType
  currency: string
  native_amount: number
  monthly_base: number
  is_pre_deducted: boolean
  is_shared: boolean
  country_flag: string
  notes: string | null
  tags: string[]
  is_active: boolean
  effective_from: string
  effective_to: string | null
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  household_id: string
  member_id: string | null
  account_name: string
  account_type: AccountType
  institution: string | null
  current_balance: number
  currency: string
  all_time_return: number | null
  contribution_room: number | null
  annual_limit: number | null
  lifetime_limit: number | null
  is_tax_deductible: boolean
  is_tax_free_growth: boolean
  is_tax_free_withdrawal: boolean
  country: string
  notes: string | null
  holdings: Holding[]
  last_updated: string | null
  created_at: string
  updated_at: string
}

export interface Holding {
  symbol: string
  pct: number
  assessment: string
}

export interface ForeignAsset {
  id: string
  household_id: string
  member_id: string | null
  asset_name: string
  asset_type: 'Property' | 'SIP' | 'Gold' | 'Vehicle' | 'FD' | 'Stock' | 'Business' | 'Other'
  country: string
  currency: string
  current_value: number | null
  monthly_commitment: number
  purchase_value: number | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ActionItem {
  id: string
  household_id: string
  title: string
  description: string | null
  priority: Priority
  status: ActionStatus
  category: string | null
  potential_saving: number | null
  due_date: string | null
  completed_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProjectionScenario {
  id: string
  household_id: string
  name: string
  annual_return: number
  monthly_invest: number | null
  start_age: number | null
  target_age: number
  target_amount: number | null
  is_default: boolean
  created_at: string
}

export interface HouseholdCalculations {
  income: number
  fixedExpense: number
  variableExpense: number
  totalExpense: number
  cashInvest: number
  preDeducted: number
  totalWealth: number
  fcf: number
  savingsRate: number
  annualWealth: number
}

export interface ProjectionPoint {
  age: number
  year: number
  contributed: number
  projected: number
}
