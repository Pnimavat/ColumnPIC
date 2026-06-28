'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError(''); setMessage('')
    const { error: err } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
    if (err) { setError(err.message); setLoading(false); return }
    setMessage('Check your email for a confirmation link.')
    setLoading(false)
    router.push('/onboarding')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
  }

  const input: React.CSSProperties = { width: '100%', background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.75rem', color: '#E8E8E8', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
  const label: React.CSSProperties = { display: 'block', fontSize: '0.875rem', color: '#888888', marginBottom: '0.5rem' }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#C8A96E', letterSpacing: '-0.02em', margin: 0 }}>Rupiyo</h1>
          <p style={{ color: '#888888', marginTop: '0.5rem', fontSize: '0.875rem' }}>Your household financial engine</p>
        </div>
        <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#E8E8E8', marginBottom: '1.5rem', marginTop: 0 }}>Create account</h2>
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label style={label}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={input} /></div>
            <div><label style={label}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters" style={input} /></div>
            <div><label style={label}>Confirm Password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat your password" style={input} /></div>
            {error && <p style={{ color: '#F87171', fontSize: '0.875rem', margin: 0, padding: '0.75rem', background: 'rgba(248,113,113,0.08)', borderRadius: '6px' }}>{error}</p>}
            {message && <p style={{ color: '#4ADE80', fontSize: '0.875rem', margin: 0, padding: '0.75rem', background: 'rgba(74,222,128,0.08)', borderRadius: '6px' }}>{message}</p>}
            <button type="submit" disabled={loading} style={{ background: '#C8A96E', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.875rem', fontWeight: 600, fontSize: '0.875rem', cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#1E1E1E' }} /><span style={{ color: '#444444', fontSize: '0.75rem' }}>OR</span><div style={{ flex: 1, height: '1px', background: '#1E1E1E' }} />
          </div>
          <button onClick={handleGoogle} style={{ width: '100%', background: 'transparent', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.875rem', color: '#E8E8E8', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/></svg>
            <span>Continue with Google</span>
          </button>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: 0, color: '#888888', fontSize: '0.875rem' }}>
            Already have an account?{' '}<Link href="/login" style={{ color: '#C8A96E', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
