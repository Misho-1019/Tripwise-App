import { View, Text, StyleSheet } from "react-native"

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Your next adventure awaits</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 60, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#1A1A1A" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 4 },
})
