interface Bracket {
  min: number
  max: number
  federal: number
  provincial: number
}

const CA_ON_BRACKETS_2026: Bracket[] = [
  { min: 0,       max: 16129,   federal: 0.15,  provincial: 0.0505 },
  { min: 16129,   max: 57375,   federal: 0.205, provincial: 0.0915 },
  { min: 57375,   max: 102000,  federal: 0.26,  provincial: 0.1116 },
  { min: 102000,  max: 111733,  federal: 0.29,  provincial: 0.1216 },
  { min: 111733,  max: 154906,  federal: 0.29,  provincial: 0.1316 },
  { min: 154906,  max: 220000,  federal: 0.33,  provincial: 0.1316 },
  { min: 220000,  max: Infinity, federal: 0.33, provincial: 0.1316 },
]

export function getMarginalRate(grossIncome: number, country = 'CA'): number {
  if (country === 'CA') {
    for (let i = CA_ON_BRACKETS_2026.length - 1; i >= 0; i--) {
      const b = CA_ON_BRACKETS_2026[i]
      if (grossIncome > b.min) return (b.federal + b.provincial) * 100
    }
    return 20
  }
  if (country === 'US') {
    if (grossIncome > 609350) return 37
    if (grossIncome > 243725) return 35
    if (grossIncome > 191950) return 32
    if (grossIncome > 100525) return 24
    if (grossIncome > 47150) return 22
    if (grossIncome > 11600) return 12
    return 10
  }
  return 30
}

export function getEffectiveTaxRate(grossIncome: number, country = 'CA'): number {
  if (grossIncome <= 0) return 0
  let totalTax = 0
  if (country === 'CA') {
    for (const b of CA_ON_BRACKETS_2026) {
      if (grossIncome <= b.min) break
      const taxable = Math.min(grossIncome, b.max) - b.min
      totalTax += taxable * (b.federal + b.provincial)
    }
  }
  return (totalTax / grossIncome) * 100
}

export function getRefundEstimate(rrspContrib: number, fhsaContrib: number, marginalRate: number): number {
  return (rrspContrib + fhsaContrib) * (marginalRate / 100)
}

export function getTaxSavings(grossIncome: number, deductions: number, country = 'CA'): number {
  return deductions * (getMarginalRate(grossIncome, country) / 100)
}
