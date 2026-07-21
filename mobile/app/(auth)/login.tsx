import { useState, useEffect } from "react"
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
import { useLogin, useGoogleAuth } from "../../hooks/useAuth"
import { QuoteCard } from "../../components/ui/QuoteCard"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainer: "#EDEDF6",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  outline: "#787A84",
  border: "#AFB1BC",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
  radius: 12,
}

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending, error } = useLogin()
  const { request: googleRequest, response: googleResponse, promptAsync: googlePrompt, mutation: googleMutation } = useGoogleAuth()

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const idToken = googleResponse.params.id_token
      if (idToken) {
        googleMutation.mutate(idToken, {
          onSuccess: () => {
            router.replace("/(tabs)")
          },
        })
      }
    }
  }, [googleResponse])

  const handleLogin = () => {
    if (!email || !password) return
    login(
      { email, password },
      {
        onSuccess: () => {
          router.replace("/(tabs)")
        },
      },
    )
  }

  const handleGoogleLogin = () => {
    googlePrompt()
  }

  const handleForgotPassword = () => {
    router.push("forgot-password" as any)
  }

  const QUOTE_IMAGE =
    "https://lh3.googleusercontent.com/aida/AP1WRLs6mYQ-MJJ9cJfnAqqTg2hhSCeE8Ar23deCDdhLPEkDgSzfwYCyGvjnnR9BFqssiFS1lAqo6au8gxsNQ5_5c1oCW4Q8sKFj8CytP6_uHfMuJ6ob5tGE7kuy7S7af8jxMj_34Z8h8q2PDpJyFKokuW6JJ4n3dui6GFDT5pVEClddnunbPLB120oVOes1bGsCxz4r7KiGkiHjcAsRbM2DFUtuA-Q3DQF724msOD5zYKOi8HBHKnUngGQGmg"

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
        </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.hero}>
          <ExpoImage
            source={{
              uri: "https://lh3.googleusercontent.com/aida/AP1WRLs02kjS35AHFvpyP9HmpJsvdPxqGj1gUXKtaqEmKMYDbYDoCD4Km7WA9gs1qlZth3XabUWRZtKGI407QAQhOqJIwjyPPfaq_DB5D2NKzQTpbVAQXjLkf7rPaR1bZsAyxCnI4UeAL-xHnOsNVEP184O_ZgEo-dynBow5_PkhluIdxmSgnyIvJ5gYQ9mdU3JbHC2b440_UeYEfP65tcdAoYo3TAlKH455TiylCSdpfdwgJ2Agv2fse5TUyHQ",
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
            <Text style={styles.heroTitle}>Welcome Back</Text>
            <Text style={styles.heroSubtitle}>Sign in to continue your journey</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={tokens.textSecondary}
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
                placeholder="Password"
                placeholderTextColor={tokens.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? "🙈" : "👁"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Error */}
          {error && (
            <Text style={styles.errorText}>
              {error instanceof Error ? error.message : "Login failed"}
            </Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isPending && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isPending}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
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
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin} disabled={!googleRequest}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            style={styles.signupRow}
          >
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text style={styles.signupLink}>Sign Up</Text>
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
  container: {
    flex: 1,
    backgroundColor: tokens.background,
  },
  screenContainer: {
    flex: 1,
  },
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
  },
  scrollContent: {
    flexGrow: 1,
  },
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
    bottom: 48,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  formCard: {
    flex: 1,
    backgroundColor: tokens.background,
    marginTop: -40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 11,
    color: tokens.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.surfaceContainer,
    borderRadius: tokens.radius,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: tokens.text,
    height: "100%",
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  forgotRow: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 14,
    color: tokens.primary,
  },
  errorText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: tokens.primary,
    height: 56,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: tokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 16,
    color: "#fff",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: tokens.border,
    opacity: 0.3,
  },
  dividerText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 11,
    color: tokens.textSecondary,
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: "rgba(175,177,188,0.2)",
    borderRadius: tokens.radius,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.text,
  },
  socialText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 14,
    color: tokens.text,
  },
  signupRow: {
    alignItems: "center",
  },
  signupText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
  },
  signupLink: {
    fontFamily: tokens.fontBodyBold,
    color: tokens.primary,
  },
})
