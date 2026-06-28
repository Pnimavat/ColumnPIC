import { PageShell } from './_components'

export default function TaxPage() {
  return <PageShell icon="▧" title="Tax Center" description="Calculate marginal and effective tax rates. Estimate RRSP and FHSA refunds. 2026 CA/ON federal + provincial brackets built in." accentColor="#FB923C" stats={[{label:'Marginal Rate',hint:'Federal + ON combined'},{label:'Effective Rate',hint:'Average across income'},{label:'RRSP Refund Est.',hint:'At marginal rate'},{label:'FHSA Refund Est.',hint:'At marginal rate'}]} />
}
