import { View, Text, TextInput, StyleSheet } from "react-native"

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <TextInput style={styles.searchBar} placeholder="Search destinations..." placeholderTextColor="#999" />
      <Text style={styles.title}>Explore</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 60, paddingHorizontal: 16 },
  searchBar: { backgroundColor: "#fff", padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: "#E0E0E0", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#1A1A1A" },
})
