import { useMutation } from "@tanstack/react-query"
import * as WebBrowser from "expo-web-browser"
import { useIdTokenAuthRequest } from "expo-auth-session/providers/google"
import { makeRedirectUri } from "expo-auth-session"
import api from "../lib/api"
import { useAuthStore } from "../store/authStore"
import { User } from "../types"

WebBrowser.maybeCompleteAuthSession()

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

  return   useMutation({
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

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post("/auth/forgot-password", { email })
      return res.data as { message: string }
    },
  })
}

export function useGoogleAuth() {
  const setAuth = useAuthStore((s) => s.setAuth)

  const redirectUri = makeRedirectUri({ scheme: "tripwise" })
  const [request, response, promptAsync] = useIdTokenAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      redirectUri,
    },
  )

  const mutation = useMutation({
    mutationFn: async (idToken: string) => {
      const res = await api.post("/auth/google", { idToken })
      return res.data as { token: string; user: User }
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
    },
  })

  return { request, response, promptAsync, mutation }
}
