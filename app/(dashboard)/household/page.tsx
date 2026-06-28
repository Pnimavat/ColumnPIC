import { PageShell } from './_components'

export default function HouseholdPage() {
  return <PageShell icon="⌂" title="Household Overview" description="Complete financial snapshot across all household members — combined income, expenses, investments, accounts, and net worth." accentColor="#C8A96E" stats={[{label:'Combined Income',hint:'All earners'},{label:'Total Expenses',hint:'Fixed + variable'},{label:'Total Invested',hint:'Cash + pre-deducted'},{label:'Net Worth',hint:'Assets − liabilities'}]} />
}
