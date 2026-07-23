import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { AiTripPlan } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

interface ItineraryPreviewCardProps {
  plan: AiTripPlan
  destinationName: string
  onViewDetails: () => void
}

export function ItineraryPreviewCard({ plan, destinationName, onViewDetails }: ItineraryPreviewCardProps) {
  const dayCount = plan.days.length
  const totalCost = plan.days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (a.estimated_cost || 0), 0), 0)

  return (
    <TouchableOpacity style={styles.card} onPress={onViewDetails} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingBadge}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.ratingText}>4.9</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{destinationName} {dayCount}-Day Itinerary</Text>
        <Text style={styles.description} numberOfLines={2}>
          A curated {dayCount}-day experience with {plan.days.reduce((s, d) => s + d.activities.length, 0)} activities across {destinationName}.
        </Text>
        <View style={styles.footer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Planning</Text>
          </View>
          <View style={styles.viewRow}>
            <Text style={styles.viewText}>View Details</Text>
            <Text style={styles.viewArrow}>→</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    maxWidth: "95%",
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
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  starIcon: {
    fontSize: 14,
    color: "#F59E0B",
  },
  ratingText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 12,
    color: tokens.text,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontFamily: tokens.fontHeadline,
    fontSize: 16,
    fontWeight: "700",
    color: tokens.text,
  },
  description: {
    fontFamily: tokens.fontBody,
    fontSize: 13,
    color: tokens.textSecondary,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(175,177,188,0.2)",
  },
  statusBadge: {
    backgroundColor: tokens.primary + "15",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  statusText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 10,
    color: tokens.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  viewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 13,
    color: tokens.primary,
  },
  viewArrow: {
    fontSize: 16,
    color: tokens.primary,
  },
})
