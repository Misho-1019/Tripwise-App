import { create } from "zustand"

interface UiState {
  isOnboarded: boolean
  theme: "light" | "dark"
  setOnboarded: (value: boolean) => void
  toggleTheme: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isOnboarded: false,
  theme: "light",
  setOnboarded: (isOnboarded) => set({ isOnboarded }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}))
