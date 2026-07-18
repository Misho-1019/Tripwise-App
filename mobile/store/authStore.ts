import { create } from "zustand"
import { User } from "../types"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setAuth: (user, token) => set({ user, token, isLoading: false }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, token: null, isLoading: false }),
}))
