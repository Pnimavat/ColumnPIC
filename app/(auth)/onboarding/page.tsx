'use client'
import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '520px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#C8A96E', letterSpacing: '-0.03em', margin: 0 }}>Rupiyo</h1>
          <div style={{ width: '48px', height: '2px', background: '#C8A96E', margin: '1rem auto 0', borderRadius: '1px', opacity: 0.5 }} />
        </div>
        <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '20px', padding: '2.5rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(200,169,110,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>🏠</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E8E8E8', margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>Welcome to Rupiyo!</h2>
          <p style={{ color: '#888888', fontSize: '0.9375rem', lineHeight: '1.6', margin: '0 0 2rem' }}>
            Let&apos;s set up your household. You&apos;ll track income, expenses, investments, and wealth across multiple members and currencies.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', textAlign: 'left' }}>
            {[['01','Name your household'],['02','Add household members'],['03','Set your base currency'],['04','Enter your first transactions']].map(([step, label]) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#0A0A0A', borderRadius: '8px', border: '1px solid #1E1E1E' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8A96E', fontFamily: 'monospace', minWidth: '24px' }}>{step}</span>
                <span style={{ fontSize: '0.875rem', color: '#E8E8E8' }}>{label}</span>
              </div>
            ))}
          </div>
          <Link href="/" style={{ display: 'block', background: '#C8A96E', color: '#0A0A0A', borderRadius: '10px', padding: '0.9375rem', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none' }}>Get Started</Link>
          <p style={{ marginTop: '1rem', marginBottom: 0, color: '#444444', fontSize: '0.8125rem' }}>You can always update these settings later</p>
        </div>
      </div>
    </div>
  )
}
