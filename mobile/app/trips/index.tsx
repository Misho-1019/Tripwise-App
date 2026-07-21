import { useCallback } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useTrips } from "../../hooks/useTrips"
import { Trip } from "../../types"
import { formatCurrency, formatDate } from "../../lib/utils"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainerHigh: "#E7E8F1",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  success: "#34C759",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

const statusConfig: Record<string, { label: string; color: string }> = {
  planning: { label: "Planning", color: tokens.primary },
  ongoing: { label: "Ongoing", color: tokens.success },
  completed: { label: "Completed", color: tokens.textSecondary },
}

export default function TripsListScreen() {
  const { data, isLoading, error } = useTrips()
  const trips = data?.trips || []

  const handleTripPress = useCallback((id: string) => {
    router.push(`/trip/${id}`)
  }, [])

  const handleNewTrip = useCallback(() => {
    router.push("/trip/new")
  }, [])

  const renderTrip = useCallback(
    ({ item }: { item: Trip }) => {
      const statusInfo = statusConfig[item.status] || statusConfig.planning
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleTripPress(item.id)}
          activeOpacity={0.85}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: item.destination_image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
              }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              locations={[0.3, 1]}
              style={styles.imageOverlay}
            />
            <View style={[styles.badge, { backgroundColor: statusInfo.color }]}>
              <Text style={styles.badgeText}>{statusInfo.label}</Text>
            </View>
            <View style={styles.cardTitleOverlay}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>📍</Text>
              <Text style={styles.cardDest}>{item.destination_name || "Destination"}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>📅</Text>
              <Text style={styles.cardDate}>{formatDate(item.start_date)} – {formatDate(item.end_date)}</Text>
            </View>
            {item.budget != null && (
              <View style={styles.cardRow}>
                <Text style={styles.cardIcon}>💰</Text>
                <Text style={styles.cardDate}>{formatCurrency(item.budget)}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )
    },
    [handleTripPress],
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Trips</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={tokens.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load trips</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={renderTrip}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✈️</Text>
              <Text style={styles.emptyTitle}>No trips yet</Text>
              <Text style={styles.emptySubtext}>Plan your first adventure</Text>
            </View>
          }
          ListFooterComponent={
            trips.length > 0 ? (
              <TouchableOpacity style={styles.newTripButton} onPress={handleNewTrip} activeOpacity={0.8}>
                <Text style={styles.newTripIcon}>+</Text>
                <Text style={styles.newTripText}>Plan New Trip</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 22,
    color: tokens.primary,
  },
  headerTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 22,
    fontWeight: "700",
    color: tokens.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 20,
  },
  card: {
    backgroundColor: tokens.surface,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    height: 160,
    position: "relative",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  badgeText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 10,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardTitleOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  cardTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardIcon: {
    fontSize: 14,
    width: 20,
  },
  cardDest: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.text,
  },
  cardDate: {
    fontFamily: tokens.fontBody,
    fontSize: 14,
    color: tokens.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 20,
    fontWeight: "700",
    color: tokens.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: tokens.fontBody,
    fontSize: 14,
    color: tokens.textSecondary,
  },
  newTripButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: tokens.primary,
    paddingVertical: 16,
    borderRadius: 9999,
    marginTop: 8,
  },
  newTripIcon: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "300",
  },
  newTripText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 16,
    color: "#fff",
  },
})
