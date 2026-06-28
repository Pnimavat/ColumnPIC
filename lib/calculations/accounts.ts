import { Account, AccountType } from '@/types'

export const ACCOUNT_CONFIGS: Record<AccountType, {
  label: string
  annualLimit: number | null
  lifetimeLimit: number | null
  isTaxDeductible: boolean
  isTaxFreeGrowth: boolean
  isTaxFreeWithdrawal: boolean
  country: string
}> = {
  TFSA:      { label: 'TFSA',    annualLimit: 7000,  lifetimeLimit: null,  isTaxDeductible: false, isTaxFreeGrowth: true,  isTaxFreeWithdrawal: true,  country: 'CA' },
  RRSP:      { label: 'RRSP',    annualLimit: null,  lifetimeLimit: null,  isTaxDeductible: true,  isTaxFreeGrowth: true,  isTaxFreeWithdrawal: false, country: 'CA' },
  FHSA:      { label: 'FHSA',    annualLimit: 8000,  lifetimeLimit: 40000, isTaxDeductible: true,  isTaxFreeGrowth: true,  isTaxFreeWithdrawal: true,  country: 'CA' },
  '401k':    { label: '401(k)',  annualLimit: 23000, lifetimeLimit: null,  isTaxDeductible: true,  isTaxFreeGrowth: true,  isTaxFreeWithdrawal: false, country: 'US' },
  ISA:       { label: 'ISA',     annualLimit: 20000, lifetimeLimit: null,  isTaxDeductible: false, isTaxFreeGrowth: true,  isTaxFreeWithdrawal: true,  country: 'UK' },
  'Non-Reg': { label: 'Non-Reg', annualLimit: null,  lifetimeLimit: null,  isTaxDeductible: false, isTaxFreeGrowth: false, isTaxFreeWithdrawal: false, country: 'CA' },
  Pension:   { label: 'Pension', annualLimit: null,  lifetimeLimit: null,  isTaxDeductible: true,  isTaxFreeGrowth: true,  isTaxFreeWithdrawal: false, country: 'CA' },
  Crypto:    { label: 'Crypto',  annualLimit: null,  lifetimeLimit: null,  isTaxDeductible: false, isTaxFreeGrowth: false, isTaxFreeWithdrawal: false, country: 'CA' },
  Property:  { label: 'Property',annualLimit: null,  lifetimeLimit: null,  isTaxDeductible: false, isTaxFreeGrowth: false, isTaxFreeWithdrawal: false, country: 'CA' },
  Other:     { label: 'Other',   annualLimit: null,  lifetimeLimit: null,  isTaxDeductible: false, isTaxFreeGrowth: false, isTaxFreeWithdrawal: false, country: 'CA' },
}

export function getRoomUsedPct(account: Account): number {
  if (!account.annual_limit || account.annual_limit === 0) return 0
  const used = account.annual_limit - (account.contribution_room ?? 0)
  return Math.min(100, Math.max(0, (used / account.annual_limit) * 100))
}

export function getTotalAccountBalance(accounts: Account[], baseCurrency: string, fxRates: Record<string, number>): number {
  return accounts.reduce((sum, acc) => {
    if (acc.currency === baseCurrency) return sum + acc.current_balance
    const rate = fxRates[acc.currency]
    if (!rate) return sum + acc.current_balance
    return sum + acc.current_balance / rate
  }, 0)
}

export const ACCOUNT_PRIORITY: Record<string, string[]> = {
  CA: ['FHSA', 'TFSA', 'RRSP', 'Non-Reg'],
  US: ['HSA', '401k', 'IRA', 'Taxable'],
  UK: ['ISA', 'Pension', 'General'],
  IN: ['PPF', 'ELSS', 'NPS', 'FD'],
}
