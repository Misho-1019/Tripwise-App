import { View, ActivityIndicator, StyleSheet } from "react-native"
import { Redirect } from "expo-router"
import { useAuthStore } from "../store/authStore"
import { useUiStore } from "../store/uiStore"

export default function SplashScreen() {
  const token = useAuthStore((s) => s.token)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isOnboarded = useUiStore((s) => s.isOnboarded)

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0D7CFF" />
      </View>
    )
  }

  if (token) return <Redirect href="/(tabs)" />
  if (!isOnboarded) return <Redirect href="/onboarding" />
  return <Redirect href="/(auth)/login" />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
})
