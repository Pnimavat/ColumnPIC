'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/',            label: 'Dashboard',   icon: '◈' },
  { href: '/household',   label: 'Household',   icon: '⌂' },
  { href: '/income',      label: 'Income',      icon: '↑' },
  { href: '/expenses',    label: 'Expenses',    icon: '↓' },
  { href: '/investments', label: 'Investments', icon: '◎' },
  { href: '/accounts',    label: 'Accounts',    icon: '▣' },
  { href: '/overseas',    label: 'Overseas',    icon: '◉' },
  { href: '/projections', label: 'Projections', icon: '◫' },
  { href: '/tax',         label: 'Tax Center',  icon: '▧' },
  { href: '/actions',     label: 'Actions',     icon: '◈' },
  { href: '/members',     label: 'Members',     icon: '◑' },
  { href: '/settings',    label: 'Settings',    icon: '◎' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const currentNav = NAV.find(n => n.href === pathname) || NAV.find(n => pathname.startsWith(n.href) && n.href !== '/') || NAV[0]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <aside style={{ width: collapsed ? '60px' : '260px', background: '#111111', borderRight: '1px solid #1E1E1E', display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'width 0.2s ease', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ padding: collapsed ? '1rem 0.75rem' : '1.25rem 1.5rem', borderBottom: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', minHeight: '64px' }}>
          {!collapsed && <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#C8A96E', letterSpacing: '-0.02em' }}>Rupiyo</span>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', width: '28px', height: '28px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} title={collapsed ? 'Expand' : 'Collapse'}>
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(item => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: collapsed ? '0.75rem' : '0.6rem 1rem', borderLeft: active ? '2px solid #C8A96E' : '2px solid transparent', color: active ? '#C8A96E' : '#888888', background: active ? 'rgba(200,169,110,0.06)' : 'transparent', textDecoration: 'none', fontSize: '0.875rem', fontWeight: active ? 600 : 400, justifyContent: collapsed ? 'center' : 'flex-start', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
        {!collapsed && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1E1E1E' }}>
            <button onClick={signOut} style={{ width: '100%', background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', color: '#888888', padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>Sign Out</button>
          </div>
        )}
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: '#111111', borderBottom: '1px solid #1E1E1E', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, height: '64px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#E8E8E8', margin: 0 }}>{currentNav?.label ?? 'Dashboard'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#888888', fontFamily: 'monospace' }}>{new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#C8A96E', fontWeight: 600 }}>R</div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  )
}
