import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { router } from "expo-router"

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#999" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FAFAFA" },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 32, color: "#0D7CFF", textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: "#E0E0E0" },
  button: { backgroundColor: "#0D7CFF", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: "#0D7CFF", textAlign: "center", marginTop: 16, fontSize: 14 },
})
