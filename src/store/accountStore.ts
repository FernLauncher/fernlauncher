import { create } from 'zustand'

interface AccountStore {
  accounts: Account[]
  isLoading: boolean
  load: () => Promise<void>
  add: (account: Account) => void
  remove: (id: string) => void
  setActive: (id: string) => void
  updateStatus: (id: string, status: Account['status']) => void
  active: () => Account | undefined
}

export const useAccountStore = create<AccountStore>((setState, getState) => ({
  accounts: [],
  isLoading: false,

  load: async () => {
    setState({ isLoading: true })
    const accounts = await window.electron.getAccounts()
    setState({ accounts, isLoading: false })
  },

  add: (account) => {
    setState(state => ({
      accounts: [...state.accounts, account]
    }))
  },

  remove: (id) => {
    setState(state => ({
      accounts: state.accounts.filter(a => a.id !== id)
    }))
  },

  setActive: async (id) => {
    await window.electron.setActiveAccount(id)
    setState(state => ({
      accounts: state.accounts.map(a => ({ ...a, isActive: a.id === id }))
    }))
  },

  updateStatus: (id, status) => {
    setState(state => ({
      accounts: state.accounts.map(a => a.id === id ? { ...a, status } : a)
    }))
  },

  active: () => {
    return getState().accounts.find(a => a.isActive)
  },
}))