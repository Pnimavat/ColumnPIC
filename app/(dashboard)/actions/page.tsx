import { PageShell } from './_components'

export default function ActionsPage() {
  return <PageShell icon="◈" title="Actions" description="Prioritized financial action items. Track progress on tax efficiency, account maximization, and expense optimization." accentColor="#C8A96E" stats={[{label:'High Priority',hint:'Needs immediate attention'},{label:'In Progress',hint:'Currently working on'},{label:'Completed',hint:'Done this month'},{label:'Est. Monthly Saving',hint:'If all actions done'}]} />
}
