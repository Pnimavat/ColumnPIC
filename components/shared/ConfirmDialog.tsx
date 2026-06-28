'use client'
interface Props {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel, danger = false }: Props) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '16px', padding: '2rem', maxWidth: '420px', width: '100%' }}>
        <h3 style={{ color: '#E8E8E8', fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.75rem' }}>{title}</h3>
        <p style={{ color: '#888888', fontSize: '0.875rem', margin: '0 0 1.75rem', lineHeight: '1.6' }}>{description}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid #1E1E1E', borderRadius: '8px', color: '#888888', padding: '0.625rem 1.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ background: danger ? '#F87171' : '#C8A96E', color: '#0A0A0A', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            {danger ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
