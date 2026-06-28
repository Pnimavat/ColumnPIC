import { PageShell } from './_components'

export default function ProjectionsPage() {
  return <PageShell icon="◫" title="Projections" description="Project household wealth to retirement using compound growth models. Compare conservative, moderate, and aggressive scenarios." accentColor="#C8A96E" stats={[{label:'At 7% Return',hint:'Projected at 65'},{label:'Monthly Required',hint:'To hit target'},{label:'Years to $1M',hint:'At current rate'},{label:'Savings Rate',hint:'% of income invested'}]} />
}
