import { ProjectionPoint } from '@/types'

export function projectWealth(
  monthlyInvest: number,
  annualReturn: number,
  years: number,
  currentBalance = 0
): number {
  const monthlyRate = annualReturn / 100 / 12
  const months = years * 12
  if (monthlyRate === 0) return currentBalance + monthlyInvest * months
  return (
    monthlyInvest * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) +
    currentBalance * Math.pow(1 + monthlyRate, months)
  )
}

export function buildProjectionSeries(
  startAge: number,
  targetAge: number,
  monthlyInvest: number,
  annualReturn: number,
  currentBalance = 0
): ProjectionPoint[] {
  const currentYear = new Date().getFullYear()
  const points: ProjectionPoint[] = []
  for (let age = startAge; age <= targetAge; age++) {
    const years = age - startAge
    points.push({
      age,
      year: currentYear + years,
      contributed: currentBalance + monthlyInvest * 12 * years,
      projected: projectWealth(monthlyInvest, annualReturn, years, currentBalance),
    })
  }
  return points
}

export function findMilestoneAge(
  target: number,
  startAge: number,
  monthlyInvest: number,
  annualReturn: number,
  currentBalance = 0
): number | null {
  for (let years = 0; years <= 60; years++) {
    if (projectWealth(monthlyInvest, annualReturn, years, currentBalance) >= target)
      return startAge + years
  }
  return null
}
