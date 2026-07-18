import { View, Text, StyleSheet } from "react-native"

export default function WishlistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Destinations</Text>
      <Text style={styles.empty}>No saved destinations yet</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 60, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#1A1A1A" },
  empty: { fontSize: 16, color: "#999", textAlign: "center", marginTop: 40 },
})
