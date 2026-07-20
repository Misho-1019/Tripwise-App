import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Attraction } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  surface: "#FFFFFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Iconic: { bg: "#DBE2F9", text: "#4A5264" },
  Museum: { bg: "#E4CEFF", text: "#54436B" },
  Art: { bg: "#D8E2FF", text: "#004493" },
  History: { bg: "#E4CEFF", text: "#54436B" },
  Landmark: { bg: "#DBE2F9", text: "#4A5264" },
  Park: { bg: "#D1F2EB", text: "#1B5E20" },
  Nature: { bg: "#D1F2EB", text: "#1B5E20" },
  Temple: { bg: "#FFF3E0", text: "#E65100" },
  Market: { bg: "#FFF3E0", text: "#E65100" },
  Tour: { bg: "#E3F2FD", text: "#0D47A1" },
  Shopping: { bg: "#FCE4EC", text: "#880E4F" },
  Adventure: { bg: "#FFF3E0", text: "#E65100" },
  Neighborhood: { bg: "#F3E5F5", text: "#6A1B9A" },
}

interface AttractionCardProps {
  attraction: Attraction
  onPress?: () => void
}

export function AttractionCard({ attraction, onPress }: AttractionCardProps) {
  const colors = categoryColors[attraction.category || ""] || { bg: "#EDEDF6", text: "#5C5F68" }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: attraction.image_url }} style={styles.image} />
      <View style={styles.body}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{attraction.name}</Text>
            {attraction.category && (
              <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                <Text style={[styles.badgeText, { color: colors.text }]}>{attraction.category}</Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            {attraction.rating != null && (
              <Text style={styles.metaText}>★ {Number(attraction.rating).toFixed(1)}</Text>
            )}
            {attraction.duration && (
              <Text style={styles.metaText}>🕐 {attraction.duration}</Text>
            )}
          </View>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            {attraction.price != null && attraction.price > 0
              ? `$${attraction.price}`
              : "Free"}
          </Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: tokens.surface,
    padding: 12,
    borderRadius: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    fontFamily: tokens.fontHeadline,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  metaText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 12,
    color: tokens.textSecondary,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontFamily: tokens.fontHeadline,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.primary,
  },
  arrow: {
    fontSize: 18,
    color: tokens.textSecondary,
  },
})
