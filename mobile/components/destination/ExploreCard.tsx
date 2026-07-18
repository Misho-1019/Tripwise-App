import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
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

interface ExploreCardProps {
  destination: Destination
  onPress?: (id: string) => void
  variant?: "grid" | "list"
}

export function ExploreCard({ destination, onPress, variant = "grid" }: ExploreCardProps) {
  if (variant === "list") {
    return (
      <TouchableOpacity
        style={styles.listCard}
        onPress={() => onPress?.(destination.id)}
        activeOpacity={0.7}
      >
        <View style={styles.listImageWrapper}>
          <Image source={{ uri: destination.image_url }} style={styles.listImage} resizeMode="cover" />
          {destination.rating != null && (
            <View style={styles.ratingBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.ratingText}>{Number(destination.rating).toFixed(1)}</Text>
            </View>
          )}
        </View>
        <View style={styles.listBody}>
          <View style={styles.listTitleRow}>
            <Text style={styles.title} numberOfLines={1}>{destination.name}</Text>
            <Text style={styles.country}>{destination.country}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.fromLabel}>from </Text>
            <Text style={styles.price}>$299</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(destination.id)}
      activeOpacity={0.7}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: destination.image_url }} style={styles.image} resizeMode="cover" />
        {destination.rating != null && (
          <View style={styles.ratingBadge}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>{Number(destination.rating).toFixed(1)}</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {destination.name}
        </Text>
        <Text style={styles.country}>{destination.country}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.fromLabel}>from </Text>
          <Text style={styles.price}>$299</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: tokens.surface,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
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
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  starIcon: {
    fontSize: 14,
    color: "#F59E0B",
  },
  ratingText: {
    fontFamily: tokens.fontLabel,
    fontSize: 11,
    color: tokens.text,
  },
  body: {
    padding: 12,
    gap: 2,
  },
  title: {
    fontFamily: tokens.fontHeadline,
    fontSize: 14,
    fontWeight: "600",
    color: tokens.text,
  },
  country: {
    fontFamily: tokens.fontBody,
    fontSize: 12,
    color: tokens.textSecondary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  fromLabel: {
    fontFamily: tokens.fontBody,
    fontSize: 11,
    color: tokens.textSecondary,
  },
  price: {
    fontFamily: tokens.fontHeadline,
    fontSize: 14,
    color: tokens.primary,
  },
  listCard: {
    backgroundColor: tokens.surface,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    marginBottom: 16,
  },
  listImageWrapper: {
    height: 140,
    position: "relative",
  },
  listImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  listBody: {
    padding: 12,
    gap: 8,
  },
  listTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})
