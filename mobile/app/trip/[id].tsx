import { useState, useCallback, useMemo } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, router } from "expo-router"
import { useTrip } from "../../hooks/useTrips"
import { TimelineActivity } from "../../components/trip/TimelineActivity"
import { AddActivitySheet } from "../../components/trip/AddActivitySheet"
import { TripActivity, TripDay } from "../../types"
import { formatCurrency, getDurationDays } from "../../lib/utils"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainerLow: "#F3F3FA",
  surfaceContainer: "#EDEDF6",
  surfaceContainerHigh: "#E7E8F1",
  surfaceContainerHighest: "#E0E2ED",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  outline: "#787A84",
  outlineVariant: "#AFB1BC",
  success: "#34C759",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  const sameMonth = s.getMonth() === e.getMonth()
  if (sameMonth) {
    return `${s.toLocaleDateString("en-US", { month: "short" })} ${s.getDate()}-${e.getDate()}, ${e.getFullYear()}`
  }
  return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", opts)}, ${e.getFullYear()}`
}

const statusConfig: Record<string, { label: string; color: string }> = {
  planning: { label: "Planning", color: tokens.primary },
  ongoing: { label: "Ongoing", color: tokens.success },
  completed: { label: "Completed", color: tokens.outline },
}

export default function TripBuilderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [showAddSheet, setShowAddSheet] = useState(false)

  const { data, isLoading, error } = useTrip(id || "")

  const trip = data?.trip
  const days: TripDay[] = data?.days || []

  const activeDay = days[activeDayIndex]
  const activities: TripActivity[] = activeDay?.activities || []

  const dayCount = days.length
  const daysLabel = `${getDurationDays(trip?.start_date || "", trip?.end_date || "")} days`

  const handleDayPress = useCallback((index: number) => {
    setActiveDayIndex(index)
  }, [])

  const handleBack = useCallback(() => {
    router.back()
  }, [])

  const statusInfo = trip ? statusConfig[trip.status] || statusConfig.planning : statusConfig.planning

  const renderActivity = useCallback(
    ({ item, index }: { item: TripActivity; index: number }) => (
      <TimelineActivity
        activity={item}
        isLast={index === activities.length - 1}
        onPress={() => {}}
      />
    ),
    [activities.length],
  )

  const keyExtractor = useCallback((item: TripActivity) => item.id, [])

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={tokens.primary} />
      </View>
    )
  }

  if (error || !trip) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load trip</Text>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}>✈</Text>
          <View>
            <Text style={styles.headerTitle}>TripWise</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>{trip.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroImageWrapper}>
          <Image
            source={{
              uri: trip.destination_image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            locations={[0.3, 1]}
            style={styles.heroOverlay}
          />
          <View style={[styles.heroBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.heroBadgeText}>{statusInfo.label}</Text>
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>{trip.destination_name || "Destination"}</Text>
            <Text style={styles.heroSubtitle}>
              {formatDateRange(trip.start_date, trip.end_date)}
              {trip.budget != null ? ` • ${formatCurrency(trip.budget)}` : ""}
            </Text>
          </View>
        </View>

        {/* Day Selector */}
        {days.length > 0 && (
          <View style={styles.daySelectorWrapper}>
            <FlatList
              data={days}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.dayTab,
                    index === activeDayIndex
                      ? styles.dayTabActive
                      : styles.dayTabInactive,
                  ]}
                  onPress={() => handleDayPress(index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayTabText,
                      index === activeDayIndex
                        ? styles.dayTabTextActive
                        : styles.dayTabTextInactive,
                    ]}
                  >
                    Day {item.day_number}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayTabList}
            />
          </View>
        )}

        {/* Timeline */}
        {activities.length > 0 ? (
          <View style={styles.timeline}>
            <FlatList
              data={activities}
              renderItem={renderActivity}
              keyExtractor={keyExtractor}
              scrollEnabled={false}
            />
          </View>
        ) : days.length > 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No activities yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first activity</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No trip days yet</Text>
            <Text style={styles.emptySubtext}>Start planning your trip</Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddSheet(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <AddActivitySheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        destinationId={trip.destination_id}
        tripId={trip.id}
        dayId={activeDay?.id || ""}
        nextOrderIndex={activities.length}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tokens.background,
  },
  errorText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
    marginBottom: 12,
  },
  retryText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 14,
    color: tokens.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroImageWrapper: {
    height: 220,
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
  heroBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    zIndex: 10,
  },
  heroBadgeText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 10,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTextBlock: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  heroSubtitle: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonText: {
    fontSize: 22,
    color: "#fff",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    fontSize: 22,
    color: "#fff",
  },
  headerTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    maxWidth: 160,
  },

  daySelectorWrapper: {
    paddingVertical: 16,
  },
  dayTabList: {
    gap: 8,
    paddingHorizontal: 16,
  },
  dayTab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dayTabActive: {
    backgroundColor: tokens.primary,
    shadowColor: tokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  dayTabInactive: {
    backgroundColor: tokens.surfaceContainerHigh,
  },
  dayTabText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 13,
  },
  dayTabTextActive: {
    color: "#fff",
  },
  dayTabTextInactive: {
    color: tokens.textSecondary,
  },
  timeline: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 18,
    fontWeight: "700",
    color: tokens.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: tokens.fontBody,
    fontSize: 14,
    color: tokens.textSecondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 96,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: tokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
    marginTop: -2,
  },

})
