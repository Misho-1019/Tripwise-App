import { useMutation } from "@tanstack/react-query"
import api from "../lib/api"
import { useAuthStore } from "../store/authStore"
import { User } from "../types"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/auth/login", data)
      return res.data as { token: string; user: User }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const res = await api.post("/auth/register", data)
      return res.data as { token: string; user: User }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
    },
  })
}

export function useMe() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const setLoading = useAuthStore((s) => s.setLoading)
  const token = useAuthStore((s) => s.token)

  return useMutation({
    mutationFn: async () => {
      const res = await api.get("/auth/me")
      return res.data.user as User
    },
    onSuccess: (user) => {
      if (token) setAuth(user, token)
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}
