import { View, Text, StyleSheet } from "react-native"
import { Review } from "../../types"
import { StarRating } from "../ui/StarRating"

const tokens = {
  surface: "#FFFFFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  primary: "#0D7CFF",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

const avatarColors = ["#DBE2F9", "#E4CEFF", "#D1F2EB", "#FFF3E0", "#FCE4EC", "#E3F2FD"]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function timeAgo(date: string) {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const name = review.user_name || "Anonymous"
  const initials = getInitials(name)
  const avatarColor = getAvatarColor(name)

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.timeAgo}>{timeAgo(review.created_at)}</Text>
          </View>
        </View>
        <StarRating rating={review.rating} size={14} />
      </View>
      {review.comment && (
        <Text style={styles.comment}>"{review.comment}"</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.surface,
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 14,
    color: tokens.text,
  },
  userName: {
    fontFamily: tokens.fontHeadline,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.text,
  },
  timeAgo: {
    fontFamily: tokens.fontBody,
    fontSize: 12,
    color: tokens.textSecondary,
    marginTop: 1,
  },
  comment: {
    fontFamily: tokens.fontBody,
    fontSize: 14,
    color: tokens.textSecondary,
    lineHeight: 20,
    fontStyle: "italic",
  },
})
