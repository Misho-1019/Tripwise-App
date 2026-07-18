import { useEffect } from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
})

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="destination/[id]" />
        <Stack.Screen name="trip/[id]" />
        <Stack.Screen name="trip/new" />
        <Stack.Screen name="ai-planner" />
      </Stack>
    </QueryClientProvider>
  )
}
