'use client'
import { useUIStore } from '@/stores/uiStore'

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()
  if (toasts.length === 0) return null
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? '#1a0a0a' : t.type === 'info' ? '#0a0f1a' : '#0a1a0f',
          border: `1px solid ${t.type === 'error' ? '#F87171' : t.type === 'info' ? '#60A5FA' : '#4ADE80'}`,
          borderRadius: '10px',
          padding: '0.75rem 1.25rem',
          color: '#E8E8E8',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          minWidth: '240px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <span style={{ color: t.type === 'error' ? '#F87171' : t.type === 'info' ? '#60A5FA' : '#4ADE80', flexShrink: 0 }}>
            {t.type === 'error' ? '✕' : t.type === 'info' ? 'ℹ' : '✓'}
          </span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: '#444444', cursor: 'pointer', fontSize: '1rem', padding: 0, lineHeight: 1 }}>✕</button>
        </div>
      ))}
    </div>
  )
}
