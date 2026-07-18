import { View, Text, StyleSheet } from "react-native"
import { Stack } from "expo-router"

export default function NewTripScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "New Trip" }} />
      <Text style={styles.title}>Create New Trip</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  title: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", padding: 16 },
})
