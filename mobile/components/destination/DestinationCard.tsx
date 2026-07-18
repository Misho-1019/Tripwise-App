import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Destination } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  surface: "#FFFFFF",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

interface DestinationCardProps {
  destination: Destination
  onPress?: (id: string) => void
  onSave?: (id: string) => void
  isSaved?: boolean
}

export function DestinationCard({ destination, onPress, onSave, isSaved }: DestinationCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(destination.id)}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: destination.image_url }} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          locations={[0.3, 1]}
          style={styles.imageOverlay}
        />
        <View style={styles.titleOverlay}>
          <Text style={styles.cardTitle}>{destination.name}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.country}>{destination.country}</Text>
          </View>
        </View>
        {destination.rating != null && (
          <View style={styles.ratingBadge}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>{Number(destination.rating).toFixed(1)}</Text>
          </View>
        )}
      </View>
      <View style={styles.bottomSection}>
        <View>
          <Text style={styles.startingFrom}>Starting from</Text>
          <Text style={styles.price}>
            $499{" "}
            <Text style={styles.perPerson}>/ person</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => onSave?.(destination.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.heartIcon, isSaved && styles.heartIconActive]}>
            {isSaved ? "❤" : "🤍"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: tokens.surface,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    height: 256,
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
  titleOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  cardTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationIcon: {
    fontSize: 14,
  },
  country: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  ratingBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  starIcon: {
    fontSize: 14,
    color: "#FFD700",
  },
  ratingText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 12,
    color: "#fff",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  startingFrom: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 11,
    color: tokens.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  price: {
    fontFamily: tokens.fontHeadline,
    fontSize: 20,
    fontWeight: "700",
    color: tokens.primary,
  },
  perPerson: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 12,
    color: tokens.textSecondary,
    fontWeight: "400",
  },
  heartButton: {
    backgroundColor: "rgba(4,122,253,0.1)",
    padding: 12,
    borderRadius: 12,
  },
  heartIcon: {
    fontSize: 20,
    color: tokens.primary,
  },
  heartIconActive: {
    color: "#FF3B30",
  },
})
