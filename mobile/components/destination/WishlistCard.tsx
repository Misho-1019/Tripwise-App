import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Destination } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  surface: "#FFFFFF",
  text: "#1A1C1C",
  textSecondary: "#717786",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontLabel: "PlusJakartaSans-Bold",
}

interface WishlistCardProps {
  destination: Destination
  onPress?: (id: string) => void
  onRemove?: (id: string) => void
}

export function WishlistCard({ destination, onPress, onRemove }: WishlistCardProps) {
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
          style={styles.gradient}
        />
        {destination.rating != null && (
          <View style={styles.ratingBadge}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>{Number(destination.rating).toFixed(1)}</Text>
          </View>
        )}
        <View style={styles.titleOverlay}>
          <Text style={styles.cardTitle}>{destination.name}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.country}>{destination.country}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove?.(destination.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.heartIcon}>❤</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    height: 224,
    position: "relative",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ratingBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  starIcon: {
    fontSize: 16,
    color: "#F59E0B",
  },
  ratingText: {
    fontFamily: tokens.fontLabel,
    fontSize: 12,
    color: tokens.text,
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
    letterSpacing: -0.3,
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
    color: "rgba(255,255,255,0.9)",
  },
  removeButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: tokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  heartIcon: {
    fontSize: 20,
    color: "#fff",
  },
})
