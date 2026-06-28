import { PageShell } from './_components'

export default function OverseasPage() {
  return <PageShell icon="◉" title="Overseas Assets" description="Track foreign assets: Indian SIPs, property, gold, FDs, stocks. Monitor global wealth with automatic currency conversion." accentColor="#FB923C" stats={[{label:'Total Value (CAD)',hint:'All foreign assets converted'},{label:'Monthly Commitment',hint:'SIPs + ongoing contributions'},{label:'Countries',hint:'Active jurisdictions'},{label:'Asset Types',hint:'Unique categories'}]} />
}
