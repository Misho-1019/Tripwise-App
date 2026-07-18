import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { useForgotPassword } from "../../hooks/useAuth"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  const { mutate: sendReset, isPending, isSuccess, error } = useForgotPassword()

  const handleSubmit = () => {
    if (!email) return
    sendReset(email)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error && (
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : "Something went wrong"}
          </Text>
        )}

        {isSuccess ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              If that email exists, a reset link has been sent. Check your inbox.
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, isPending && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isPending}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        )}

        {isSuccess && (
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")} style={styles.backToLogin}>
            <Text style={styles.backToLoginText}>Back to Log In</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  content: { flex: 1, padding: 24, paddingTop: 80 },
  backButton: { marginBottom: 32 },
  backText: { fontSize: 16, color: "#0D7CFF", fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  subtitle: { fontSize: 16, color: "#666", lineHeight: 22, marginBottom: 32 },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
  },
  errorText: { fontSize: 14, color: "#FF3B30", textAlign: "center", marginBottom: 12 },
  successBox: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  successText: { fontSize: 14, color: "#2E7D32", textAlign: "center", lineHeight: 20 },
  button: {
    backgroundColor: "#0D7CFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  backToLogin: { alignItems: "center", marginTop: 16 },
  backToLoginText: { fontSize: 14, color: "#0D7CFF", fontWeight: "600" },
})
