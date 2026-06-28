import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Rupiyo — Household Financial Engine',
  description: 'Track income, expenses, investments and wealth for your entire household.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`} style={{ background: '#0A0A0A', color: '#E8E8E8' }}>
        {children}
      </body>
    </html>
  )
}
