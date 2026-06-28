import { PageShell } from './_components'

export default function InvestmentsPage() {
  return <PageShell icon="◎" title="Investments" description="Track monthly cash investments into TFSAs, RRSPs, FHSAs, and other vehicles. Monitor wealth-building activity." accentColor="#60A5FA" stats={[{label:'Monthly Invest',hint:'Cash out-of-pocket'},{label:'Pre-deducted',hint:'Employer deductions'},{label:'Total Wealth Building',hint:'Cash + pre-deducted'},{label:'Annual Total',hint:'Monthly × 12'}]} />
}
