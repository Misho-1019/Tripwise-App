import { useState, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { useAuthStore } from "../../store/authStore"
import { useUiStore } from "../../store/uiStore"
import { useTrips } from "../../hooks/useTrips"
import { useSavedDestinations } from "../../hooks/useSaved"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainerLow: "#F3F3FA",
  surfaceContainer: "#EDEDF6",
  surfaceContainerHigh: "#E7E8F1",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  outlineVariant: "#AFB1BC",
  success: "#34C759",
  error: "#FF3B30",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

const settingsItems = [
  { id: "account", icon: "👤", label: "Account Settings" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "darkMode", icon: "🌙", label: "Dark Mode" },
  { id: "help", icon: "❓", label: "Help and Support" },
]

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)

  const { data: tripsData, isLoading: tripsLoading } = useTrips()
  const { data: savedData } = useSavedDestinations()

  const trips = tripsData?.trips || []
  const savedCount = savedData?.destinations?.length || 0

  const handleLogout = useCallback(() => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          logout()
          router.replace("/(auth)/login")
        },
      },
    ])
  }, [logout])

  const handleSettingsPress = useCallback((id: string) => {
    if (id === "darkMode") return
    if (id === "logout") {
      handleLogout()
      return
    }
    Alert.alert("Coming Soon", "This feature will be available soon.")
  }, [handleLogout])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerIcon}>✈</Text>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri:
                  user?.avatar_url ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuACeLJvj-m1BvFvBa1pfuDbGZPwea2MW7TAvG7LvC6VWuOnoyCT1HSZpfrx5g1LAJc5Ggg-UkpXecK9JaCqx8TndgBw2bMVROyJtcMASdzhM3L8lYWXzJW6u_A_KfLhLCCb8igszi8wRuk_R1aTtwF4JV5Msrv3ic2wPHHAtj_QH2TML-bwV-5zZa59JzBAHZzZxy0AMYCuNkHyVA9BinQFR7MGZrxO4h0wU2NtCSoLoIXaCXOqEHJVZacTCYR9a56vrDloRZQRzxk",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || "Traveler"}</Text>
          <Text style={styles.userEmail}>{user?.email || "your@email.com"}</Text>
          <TouchableOpacity style={styles.editProfile}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{trips.length}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statNumber}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Your Trips */}
        <View style={styles.tripsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Trips</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {tripsLoading ? (
            <View style={styles.tripsLoading}>
              <ActivityIndicator size="small" color={tokens.primary} />
            </View>
          ) : trips.length === 0 ? (
            <View style={styles.noTrips}>
              <Text style={styles.noTripsText}>No trips yet</Text>
              <Text style={styles.noTripsSubtext}>Plan your first adventure</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tripsCarousel}
            >
              {trips.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  style={styles.tripCard}
                  onPress={() => router.push(`/trip/${trip.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.tripImageWrapper}>
                    <Image
                      source={{ uri: trip.destination_image || "https://via.placeholder.com/200x112" }}
                      style={styles.tripImage}
                    />
                    <View style={[styles.tripBadge, trip.status === "completed" ? styles.badgeCompleted : styles.badgePlanning]}>
                      <Text style={styles.tripBadgeText}>
                        {trip.status === "completed" ? "Completed" : trip.status === "ongoing" ? "Ongoing" : "Planning"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripName} numberOfLines={1}>
                      {trip.name}
                    </Text>
                    <Text style={styles.tripDate}>
                      {trip.start_date} • {trip.destination_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingsRow}
              onPress={() => {
                if (item.id === "darkMode") return
                handleSettingsPress(item.id)
              }}
              activeOpacity={item.id === "darkMode" ? 1 : 0.7}
            >
              <View style={styles.settingsLeft}>
                <Text style={styles.settingsIconText}>{item.icon}</Text>
                <Text style={styles.settingsLabel}>{item.label}</Text>
              </View>
              {item.id === "darkMode" ? (
                <Switch
                  value={theme === "dark"}
                  onValueChange={toggleTheme}
                  trackColor={{ false: tokens.outlineVariant, true: tokens.primary }}
                  thumbColor={theme === "dark" ? "#fff" : "#fff"}
                />
              ) : (
                <Text style={styles.chevron}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.background },
  scrollContent: { paddingBottom: 100 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerIcon: { fontSize: 22, color: tokens.primary },
  headerTitle: { fontFamily: tokens.fontHeadline, fontSize: 18, fontWeight: "700", color: tokens.primary },
  settingsButton: { padding: 8 },
  settingsIcon: { fontSize: 22 },
  profileSection: { alignItems: "center", paddingVertical: 24 },
  avatarWrapper: { position: "relative", marginBottom: 16 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: tokens.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIcon: { fontSize: 14 },
  userName: { fontFamily: tokens.fontHeadline, fontSize: 24, fontWeight: "700", color: tokens.text },
  userEmail: { fontFamily: tokens.fontBody, fontSize: 14, color: tokens.textSecondary, marginTop: 4 },
  editProfile: { marginTop: 8 },
  editProfileText: { fontFamily: tokens.fontBodyBold, fontSize: 14, color: tokens.primary },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(175,177,188,0.3)",
    marginHorizontal: 16,
  },
  statItem: { flex: 1, alignItems: "center" },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(175,177,188,0.3)",
  },
  statNumber: { fontFamily: tokens.fontHeadline, fontSize: 20, fontWeight: "700", color: tokens.text },
  statLabel: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 11,
    color: tokens.textSecondary,
    letterSpacing: 1,
    marginTop: 4,
    textTransform: "uppercase",
  },
  tripsSection: { marginTop: 32, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontFamily: tokens.fontHeadline, fontSize: 18, fontWeight: "700", color: tokens.text },
  viewAll: { fontFamily: tokens.fontBodyBold, fontSize: 14, color: tokens.primary },
  tripsLoading: { height: 140, justifyContent: "center", alignItems: "center" },
  noTrips: { height: 140, justifyContent: "center", alignItems: "center" },
  noTripsText: { fontFamily: tokens.fontHeadline, fontSize: 16, fontWeight: "600", color: tokens.text },
  noTripsSubtext: { fontFamily: tokens.fontBody, fontSize: 14, color: tokens.textSecondary, marginTop: 4 },
  tripsCarousel: { gap: 16, paddingRight: 16 },
  tripCard: {
    width: 200,
    backgroundColor: tokens.surface,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tripImageWrapper: { height: 112, position: "relative" },
  tripImage: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  tripBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeCompleted: { backgroundColor: tokens.success },
  badgePlanning: { backgroundColor: tokens.primary },
  tripBadgeText: { fontFamily: tokens.fontBodyBold, fontSize: 10, color: "#fff", textTransform: "uppercase" },
  tripInfo: { padding: 12 },
  tripName: { fontFamily: tokens.fontHeadline, fontSize: 14, fontWeight: "700", color: tokens.text },
  tripDate: { fontFamily: tokens.fontBody, fontSize: 12, color: tokens.textSecondary, marginTop: 4 },
  settingsSection: { marginTop: 32, paddingHorizontal: 16, gap: 4 },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: tokens.surface,
    borderRadius: 12,
  },
  settingsLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingsIconText: { fontSize: 20 },
  settingsLabel: { fontFamily: tokens.fontBodyMedium, fontSize: 14, color: tokens.text },
  chevron: { fontSize: 20, color: tokens.textSecondary },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: tokens.surface,
    borderRadius: 12,
  },
  logoutIcon: { fontSize: 18 },
  logoutText: { fontFamily: tokens.fontBodyBold, fontSize: 14, color: tokens.error },
})
