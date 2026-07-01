import { create } from 'zustand'

interface UIStore {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void

  // Transaction modal
  transactionModalOpen: boolean
  transactionModalMode: 'add' | 'edit'
  transactionModalId: string | null
  openTransactionModal: (mode: 'add' | 'edit', id?: string) => void
  closeTransactionModal: () => void

  // Account modal
  accountModalOpen: boolean
  accountModalMode: 'add' | 'edit'
  accountModalId: string | null
  openAccountModal: (mode: 'add' | 'edit', id?: string) => void
  closeAccountModal: () => void

  // Foreign asset modal
  foreignAssetModalOpen: boolean
  foreignAssetModalMode: 'add' | 'edit'
  foreignAssetModalId: string | null
  openForeignAssetModal: (mode: 'add' | 'edit', id?: string) => void
  closeForeignAssetModal: () => void

  // Toast
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[]
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  transactionModalOpen: false,
  transactionModalMode: 'add',
  transactionModalId: null,
  openTransactionModal: (mode, id) => set({ transactionModalOpen: true, transactionModalMode: mode, transactionModalId: id ?? null }),
  closeTransactionModal: () => set({ transactionModalOpen: false, transactionModalId: null }),

  accountModalOpen: false,
  accountModalMode: 'add',
  accountModalId: null,
  openAccountModal: (mode, id) => set({ accountModalOpen: true, accountModalMode: mode, accountModalId: id ?? null }),
  closeAccountModal: () => set({ accountModalOpen: false, accountModalId: null }),

  foreignAssetModalOpen: false,
  foreignAssetModalMode: 'add',
  foreignAssetModalId: null,
  openForeignAssetModal: (mode, id) => set({ foreignAssetModalOpen: true, foreignAssetModalMode: mode, foreignAssetModalId: id ?? null }),
  closeForeignAssetModal: () => set({ foreignAssetModalOpen: false, foreignAssetModalId: null }),

  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).slice(2)
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4000)
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
