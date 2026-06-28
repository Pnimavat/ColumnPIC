import { PageShell } from './_components'

export default function MembersPage() {
  return <PageShell icon="◑" title="Members" description="Manage household members, roles, income, and tax rates. Assign transactions and accounts for per-person financial analysis." accentColor="#60A5FA" stats={[{label:'Total Members',hint:'Active in household'},{label:'Combined Income',hint:'All earners'},{label:'Avg Savings Rate',hint:'Across members'},{label:'Tax Optimization',hint:'Potential refund'}]} />
}
