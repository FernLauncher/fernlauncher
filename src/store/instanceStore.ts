import { create } from 'zustand'

interface InstanceStore {
  instances: Instance[]
  selectedId: string | null
  isLoading: boolean
  notes?: string
  load: () => Promise<void>
  select: (id: string) => void
  add: (instance: Instance) => void
  remove: (id: string) => void
  update: (instance: Instance) => void
}

export const useInstanceStore = create<InstanceStore>((setState, getState) => ({
  instances: [],
  selectedId: null,
  isLoading: false,

  load: async () => {
    setState({ isLoading: true })
    const instances = await window.electron.getInstances()
    setState({ instances, isLoading: false })
  },

  select: (id) => {
    setState({ selectedId: id })
  },

  add: (instance) => {
    setState(state => ({
      instances: [...state.instances, instance]
    }))
  },

  remove: (id) => {
    setState(state => ({
      instances: state.instances.filter(i => i.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }))
  },

  update: (instance) => {
    setState(state => ({
      instances: state.instances.map(i => i.id === instance.id ? instance : i)
    }))
  },
}))