import { View, Text, StyleSheet } from "react-native"
import { useLocalSearchParams, Stack } from "expo-router"

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams()

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Destination" }} />
      <Text style={styles.title}>Destination {id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  title: { fontSize: 24, fontWeight: "700", color: "#1A1A1A", padding: 16 },
})
