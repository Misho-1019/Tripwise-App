import { useState, useCallback, useMemo } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import MapView, { Marker, Callout } from "react-native-maps"
import { router } from "expo-router"
import { useSavedDestinations, useUnsaveDestination } from "../../hooks/useSaved"
import { WishlistCard } from "../../components/destination/WishlistCard"
import { Destination } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainerHigh: "#E7E8F1",
  surfaceContainer: "#EDEDF6",
  text: "#1A1C1C",
  textSecondary: "#717786",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
}

export default function WishlistScreen() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const { data, isLoading, error } = useSavedDestinations()
  const unsaveMutation = useUnsaveDestination()

  const destinations = data?.destinations || []

  const handleRemove = useCallback(
    (id: string) => {
      unsaveMutation.mutate(id)
    },
    [unsaveMutation],
  )

  const handleCardPress = useCallback((id: string) => {
    router.push(`/destination/${id}`)
  }, [])

  const renderCard = useCallback(
    ({ item }: { item: Destination }) => (
      <WishlistCard
        destination={item}
        onPress={handleCardPress}
        onRemove={handleRemove}
      />
    ),
    [handleCardPress, handleRemove],
  )

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>✈</Text>
        <Text style={styles.headerTitle}>TripWise</Text>
        <Text style={styles.headerCenter}>Saved</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Toggle */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === "list" && styles.toggleActive]}
            onPress={() => setViewMode("list")}
          >
            <Text style={[styles.toggleText, viewMode === "list" && styles.toggleTextActive]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === "map" && styles.toggleActive]}
            onPress={() => setViewMode("map")}
          >
            <Text style={[styles.toggleText, viewMode === "map" && styles.toggleTextActive]}>
              Map
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💜</Text>
      <Text style={styles.emptyTitle}>No saved destinations yet</Text>
      <Text style={styles.emptySubtext}>
        Start exploring and save the places you love
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push("/(tabs)/explore")}
      >
        <Text style={styles.exploreButtonText}>Start Exploring</Text>
      </TouchableOpacity>
    </View>
  )

  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load saved destinations</Text>
        </View>
      </View>
    )
  }

  const initialRegion = useMemo(() => {
    if (destinations.length === 0) {
      return { latitude: 20, longitude: 0, latitudeDelta: 60, longitudeDelta: 60 }
    }
    const lats = destinations.map((d) => d.lat ?? 0)
    const lngs = destinations.map((d) => d.lng ?? 0)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(maxLat - minLat + 2, 10),
      longitudeDelta: Math.max(maxLng - minLng + 2, 10),
    }
  }, [destinations])

  if (viewMode === "map") {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <MapView style={styles.map} initialRegion={initialRegion}>
          {destinations.map(
            (d) =>
              d.lat != null &&
              d.lng != null && (
                <Marker
                  key={d.id}
                  coordinate={{ latitude: d.lat, longitude: d.lng }}
                  title={d.name}
                >
                  <Callout onPress={() => router.push(`/destination/${d.id}`)}>
                    <View style={styles.callout}>
                      <Text style={styles.calloutTitle}>{d.name}</Text>
                      {d.rating != null && (
                        <Text style={styles.calloutRating}>
                          ★ {Number(d.rating).toFixed(1)}
                        </Text>
                      )}
                      <Text style={styles.calloutAction}>View Details →</Text>
                    </View>
                  </Callout>
                </Marker>
              ),
          )}
        </MapView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={destinations}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tokens.primary} />
          </View>
        ) : renderEmpty()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 12,
    gap: 8,
  },
  headerIcon: { fontSize: 22, color: tokens.primary },
  headerTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 18,
    fontWeight: "700",
    color: tokens.primary,
  },
  headerCenter: {
    flex: 1,
    textAlign: "center",
    fontFamily: tokens.fontHeadline,
    fontSize: 18,
    fontWeight: "700",
    color: tokens.primary,
  },
  toggleRow: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: tokens.surfaceContainerHigh,
    borderRadius: 9999,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9999,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: tokens.primary,
  },
  toggleText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    paddingVertical: 80,
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
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
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: tokens.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 9999,
  },
  exploreButtonText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  map: {
    flex: 1,
  },
  callout: {
    padding: 8,
    minWidth: 140,
  },
  calloutTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.text,
  },
  calloutRating: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 12,
    color: "#F59E0B",
    marginTop: 2,
  },
  calloutAction: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 12,
    color: tokens.primary,
    fontWeight: "600",
    marginTop: 4,
  },
})
