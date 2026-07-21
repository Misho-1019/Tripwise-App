import { useState, useCallback } from "react"
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { useCreateTrip } from "../../hooks/useTrips"

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

function todayStr(): string {
  const d = new Date()
  return d.toISOString().split("T")[0]
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export default function NewTripScreen() {
  const { destinationId, name, imageUrl } = useLocalSearchParams<{
    destinationId: string
    name: string
    imageUrl: string
  }>()

  const [tripName, setTripName] = useState(`Trip to ${decodeURIComponent(name || "Destination")}`)
  const [startDate, setStartDate] = useState(todayStr())
  const [endDate, setEndDate] = useState(addDays(todayStr(), 3))
  const [budget, setBudget] = useState("")
  const [validationError, setValidationError] = useState("")

  const { mutate: createTrip, isPending, error: mutationError } = useCreateTrip()

  const handleCreate = useCallback(() => {
    setValidationError("")

    if (!tripName.trim()) {
      setValidationError("Trip name is required")
      return
    }

    if (!startDate.match(/^\d{4}-\d{2}-\d{2}$/) || !endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setValidationError("Dates must be in YYYY-MM-DD format")
      return
    }

    if (endDate < startDate) {
      setValidationError("End date must be after start date")
      return
    }

    if (budget && (isNaN(Number(budget)) || Number(budget) <= 0)) {
      setValidationError("Budget must be a positive number")
      return
    }

    createTrip(
      {
        name: tripName.trim(),
        destination_id: destinationId || "",
        start_date: startDate,
        end_date: endDate,
        budget: budget ? Number(budget) : undefined,
      },
      {
        onSuccess: (data) => {
          router.replace(`/trip/${data.trip.id}`)
        },
      },
    )
  }, [tripName, startDate, endDate, budget, destinationId, createTrip])

  const displayError = validationError || (mutationError ? (mutationError instanceof Error ? mutationError.message : "Failed to create trip") : null)

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.screenContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Trip</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Image
              source={{
                uri: imageUrl
                  ? decodeURIComponent(imageUrl)
                  : "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{decodeURIComponent(name || "Destination")}</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {/* Trip Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TRIP NAME</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Trip to..."
                  placeholderTextColor={tokens.outlineVariant}
                  value={tripName}
                  onChangeText={setTripName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Dates */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DATES</Text>
              <View style={styles.dateRow}>
                <View style={[styles.inputWrapper, styles.dateInput]}>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={tokens.outlineVariant}
                    value={startDate}
                    onChangeText={setStartDate}
                    autoCapitalize="none"
                    maxLength={10}
                  />
                </View>
                <Text style={styles.dateSeparator}>→</Text>
                <View style={[styles.inputWrapper, styles.dateInput]}>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={tokens.outlineVariant}
                    value={endDate}
                    onChangeText={setEndDate}
                    autoCapitalize="none"
                    maxLength={10}
                  />
                </View>
              </View>
            </View>

            {/* Budget */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>BUDGET (OPTIONAL)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={tokens.outlineVariant}
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Error */}
            {displayError && (
              <Text style={styles.errorText}>{displayError}</Text>
            )}

            {/* Create Button */}
            <TouchableOpacity
              style={[styles.createButton, isPending && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={isPending}
              activeOpacity={0.8}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.createButtonText}>✈ Create Trip</Text>
              )}
            </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 22,
    color: "#fff",
  },
  headerTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    height: 200,
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
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroContent: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  formCard: {
    flex: 1,
    backgroundColor: tokens.surface,
    marginTop: -24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
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
    backgroundColor: tokens.surfaceContainerLow,
    borderRadius: tokens.radius,
    height: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: tokens.text,
    height: "100%",
  },
  inputPrefix: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 18,
    color: tokens.textSecondary,
    marginRight: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateInput: {
    flex: 1,
  },
  dateSeparator: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 18,
    color: tokens.outline,
  },
  errorText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: tokens.primary,
    height: 56,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: tokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 16,
    color: "#fff",
  },
})
