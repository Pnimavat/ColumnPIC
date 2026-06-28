import { PageShell } from './_components'

export default function AccountsPage() {
  return <PageShell icon="▣" title="Accounts" description="Manage TFSA, RRSP, FHSA, 401k balances, contribution room, and tax efficiency across household members." accentColor="#C084FC" stats={[{label:'Total Balance',hint:'All accounts in base currency'},{label:'TFSA Room',hint:'Remaining 2026 room'},{label:'FHSA Room',hint:'Annual + lifetime remaining'},{label:'All-time Return',hint:'Weighted across accounts'}]} />
}
