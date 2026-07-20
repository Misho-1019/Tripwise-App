import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Hotel } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  surface: "#FFFFFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  surfaceContainer: "#EDEDF6",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

interface HotelCardProps {
  hotel: Hotel
  onPress?: () => void
}

const amenityIcons: Record<string, string> = {
  wifi: "📶",
  spa: "💆",
  pool: "🏊",
  restaurant: "🍽",
  gym: "💪",
  bar: "🍸",
  breakfast: "🥐",
  "free wifi": "📶",
  "airport shuttle": "🚌",
  laundry: "👕",
  "river view": "👁",
  "beach access": "🏖",
  concierge: "🛎",
  "private beach": "🏝",
  yoga: "🧘",
  rooftop: "🌇",
  kitchen: "🍳",
  locker: "🔐",
  garden: "🌿",
}

export function HotelCard({ hotel, onPress }: HotelCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: hotel.image_url }} style={styles.image} />
        {hotel.rating != null && (
          <View style={styles.ratingBadge}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>{Number(hotel.rating).toFixed(1)}</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{hotel.name}</Text>
        {hotel.amenities && hotel.amenities.length > 0 && (
          <View style={styles.amenitiesRow}>
            {hotel.amenities.slice(0, 3).map((a, i) => (
              <Text key={i} style={styles.amenityIcon}>
                {amenityIcons[a.toLowerCase()] || "✅"}
              </Text>
            ))}
          </View>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.fromLabel}>Starting from</Text>
          <Text style={styles.price}>
            ${hotel.price_per_night}<Text style={styles.perNight}>/night</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 288,
    backgroundColor: tokens.surface,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: tokens.surfaceContainer,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  starIcon: { fontSize: 14, color: "#F59E0B" },
  ratingText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 12,
    color: tokens.text,
  },
  body: { padding: 16 },
  name: {
    fontFamily: tokens.fontHeadline,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.text,
  },
  amenitiesRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  amenityIcon: { fontSize: 18 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  fromLabel: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 12,
    color: tokens.textSecondary,
  },
  price: {
    fontFamily: tokens.fontHeadline,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.primary,
  },
  perNight: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 11,
    color: tokens.textSecondary,
    fontWeight: "400",
  },
})
