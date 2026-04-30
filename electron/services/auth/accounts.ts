import fs from 'fs'
import { Paths } from '../../utils/paths'
import { loginWithMicrosoft, refreshMicrosoftToken } from './microsoft'

function readAccounts(): Account[] {
  try {
    if (!fs.existsSync(Paths.accounts)) return []
    const raw = fs.readFileSync(Paths.accounts, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeAccounts(accounts: Account[]) {
  fs.writeFileSync(Paths.accounts, JSON.stringify(accounts, null, 2))
}

export const accountManager = {
  getAll(): Account[] {
    return readAccounts()
  },

  async addMicrosoft(): Promise<Account> {
    const account = await loginWithMicrosoft()
    const accounts = readAccounts()
    const existing = accounts.findIndex(a => a.id === account.id)
    if (existing >= 0) {
      accounts[existing] = account
    } else {
      if (accounts.length === 0) account.isActive = true
      accounts.push(account)
    }
    writeAccounts(accounts)
    return account
  },

  remove(id: string): void {
    const accounts = readAccounts().filter(a => a.id !== id)
    writeAccounts(accounts)
  },

  setActive(id: string): void {
    const accounts = readAccounts().map(a => ({ ...a, isActive: a.id === id }))
    writeAccounts(accounts)
  },

  getActive(): Account | null {
    return readAccounts().find(a => a.isActive) ?? null
  },

  async refresh(id: string): Promise<void> {
    const accounts = readAccounts()
    const account = accounts.find(a => a.id === id)
    if (!account) throw new Error('Account not found')
    try {
      const updated = await refreshMicrosoftToken(account.refreshToken)
      Object.assign(account, updated)
      writeAccounts(accounts)
    } catch {
      account.status = 'errored'
      writeAccounts(accounts)
    }
  },
}