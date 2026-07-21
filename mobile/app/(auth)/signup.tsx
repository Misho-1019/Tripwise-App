import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Image as ExpoImage } from "expo-image"
import { useRegister } from "../../hooks/useAuth"
import { QuoteCard } from "../../components/ui/QuoteCard"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainerLow: "#F3F3FA",
  surfaceContainer: "#EDEDF6",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  outline: "#787A84",
  outlineVariant: "#AFB1BC",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
  radius: 12,
}

export default function SignupScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [validationError, setValidationError] = useState("")
  const { mutate: register, isPending, error } = useRegister()

  const handleSignup = () => {
    setValidationError("")
    if (!name || !email || !password || !confirmPassword) {
      setValidationError("All fields are required")
      return
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters")
      return
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match")
      return
    }
    register(
      { name, email, password },
      {
        onSuccess: () => {
          router.replace("/(tabs)")
        },
      },
    )
  }

  const displayError = validationError || (error ? (error instanceof Error ? error.message : "Registration failed") : null)

  const QUOTE_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD65xUOiaYXTzk8Q4TA7eRt-BwfGyQxe_FpT_hzIQoZhOhBDL9awLkuDMJpoS7CHw5mxZ11gTqqGt7miwOv02ykv25C-YrMIi4WrHOY_JAhQcWASngWrh0qVspwO6zbTyD4oWcrpwFxPSC9PxfGqyJN8CXVtExD6MmyXEEOS-Nbae5FIg32tRir-8UtJ94bA8Xsjxo4XKeBKu5aN8IEbuYzxu4v5G7kwKp3rng0ulv-FDS4Eix_o5W8GIIfYa02E4fonojDaV66HpY"

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.screenContainer}>
        {/* Header - fixed over hero */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>✈</Text>
          <Text style={styles.headerTitle}>TripWise</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.hero}>
          <ExpoImage
            source={{
              uri: "https://lh3.googleusercontent.com/aida/AP1WRLs6mYQ-MJJ9cJfnAqqTg2hhSCeE8Ar23deCDdhLPEkDgSzfwYCyGvjnnR9BFqssiFS1lAqo6au8gxsNQ5_5c1oCW4Q8sKFj8CytP6_uHfMuJ6ob5tGE7kuy7S7af8jxMj_34Z8h8q2PDpJyFKokuW6JJ4n3dui6GFDT5pVEClddnunbPLB120oVOes1bGsCxz4r7KiGkiHjcAsRbM2DFUtuA-Q3DQF724msOD5zYKOi8HBHKnUngGQGmg",
            }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)", tokens.background]}
            locations={[0, 0.5, 1]}
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.heroSubtitle}>Join the TripWise community</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={tokens.outlineVariant}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="hello@tripwise.com"
                placeholderTextColor={tokens.outlineVariant}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={tokens.outlineVariant}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={tokens.outlineVariant}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text style={styles.eyeIcon}>{showConfirm ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Error */}
          {displayError && (
            <Text style={styles.errorText}>{displayError}</Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, isPending && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isPending}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialLabel}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialLabel}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.footerRow}
          >
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.footerLink}>Log In</Text>
            </Text>
          </TouchableOpacity>

          <QuoteCard imageUrl={QUOTE_IMAGE} />
        </View>
      </ScrollView>
    </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.background },
  screenContainer: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 8,
  },
  headerIcon: {
    fontSize: 24,
    color: tokens.primary,
  },
  headerTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 24,
    fontWeight: "700",
    color: tokens.primary,
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 16, color: tokens.text, fontWeight: "600" },
  hero: {
    height: 320,
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    position: "absolute",
    bottom: 64,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  formCard: {
    flex: 1,
    backgroundColor: tokens.surface,
    marginTop: -40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 11,
    color: tokens.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
    paddingHorizontal: 4,
    textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.surfaceContainerLow,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputIcon: { fontSize: 18, marginRight: 12 },
  input: {
    flex: 1,
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: tokens.text,
    height: "100%",
  },
  eyeIcon: { fontSize: 18 },
  errorText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 12,
  },
  signupButton: {
    backgroundColor: tokens.primary,
    height: 56,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: tokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonDisabled: { opacity: 0.7 },
  signupButtonText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 16,
    color: "#fff",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 32,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: tokens.outlineVariant, opacity: 0.3 },
  dividerText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 10,
    color: tokens.textSecondary,
    letterSpacing: 2,
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(175,177,188,0.3)",
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.text,
  },
  socialLabel: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 14,
    color: tokens.text,
  },
  socialText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.text,
  },
  footerRow: { alignItems: "center" },
  footerText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
  },
  footerLink: {
    fontFamily: tokens.fontBodyBold,
    color: tokens.primary,
  },
})
