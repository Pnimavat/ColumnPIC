export const INCOME_CATEGORIES = [
  'Employment', 'Freelance', 'Rental', 'Investment', 'Business', 'Pension', 'Other Income',
]

export const EXPENSE_CATEGORIES = [
  'Housing', 'Groceries', 'Transport', 'Insurance', 'Utilities', 'Phone', 'Internet',
  'Subscriptions', 'Dining', 'Shopping', 'Health', 'Education', 'Travel', 'Personal Care',
  'Entertainment', 'Clothing', 'Gifts', 'Charity', 'Childcare', 'Pet', 'Other',
]

export const INVESTMENT_CATEGORIES = [
  'TFSA', 'RRSP', 'FHSA', '401k', 'ISA', 'Non-Reg', 'Pension', 'Crypto', 'Real Estate',
  'SIP', 'ETF', 'Stock', 'Bond', 'Gold', 'Other Investment',
]

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES, ...INVESTMENT_CATEGORIES]
