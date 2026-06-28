import { PageShell } from './_components'

export default function ExpensesPage() {
  return <PageShell icon="↓" title="Expenses" description="Track fixed and variable household expenses. Categorize spending to find optimization opportunities." accentColor="#F87171" stats={[{label:'Fixed Expenses',hint:'Rent, insurance, subs'},{label:'Variable Expenses',hint:'Groceries, dining, shopping'},{label:'Total Monthly',hint:'Fixed + variable'},{label:'Largest Category',hint:'Biggest spending bucket'}]} />
}
