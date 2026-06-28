import { PageShell } from './_components'

export default function IncomePage() {
  return <PageShell icon="↑" title="Income" description="Track all income sources across household members — employment, freelance, rental, and investment." accentColor="#4ADE80" stats={[{label:'Monthly Income',hint:'All sources'},{label:'Annual Income',hint:'Monthly × 12'},{label:'Members',hint:'Contributing earners'},{label:'Sources',hint:'Active income lines'}]} />
}
