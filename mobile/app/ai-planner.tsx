import { View, Text, StyleSheet } from "react-native"
import { Stack } from "expo-router"

export default function AiPlannerScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "AI Trip Planner" }} />
      <Text style={styles.title}>AI Trip Planner</Text>
      <Text style={styles.subtitle}>Describe your dream trip and let AI plan it</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#1A1A1A", marginTop: 60 },
  subtitle: { fontSize: 16, color: "#666", marginTop: 8 },
})
