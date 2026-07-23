import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from "react-native"
import { TripActivity } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainerHigh: "#E7E8F1",
  surfaceContainerHighest: "#E0E2ED",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  outline: "#787A84",
  outlineVariant: "#AFB1BC",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

const categoryIcons: Record<string, string> = {
  Landmark: "🏛️",
  Museum: "🏛️",
  Food: "🍽️",
  Tour: "🚢",
  Sightseeing: "👁️",
  Nature: "🌿",
  Beach: "🏖️",
  Shopping: "🛍️",
  Temple: "⛩️",
  Shrine: "⛩️",
  Park: "🌳",
  Market: "🏪",
  Neighborhood: "🏘️",
  Nightlife: "🌃",
  Adventure: "🏔️",
  History: "📜",
  Restaurant: "🍽️",
  Cafe: "☕",
  Hotel: "🏨",
}

function formatTime(time?: string): string {
  if (!time) return ""
  const parts = time.split(":")
  if (parts.length < 2) return time
  let h = parseInt(parts[0], 10)
  const m = parts[1]
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

interface TimelineActivityProps {
  activity: TripActivity
  isLast: boolean
  onDrag?: () => void
  onPress?: () => void
  onDeletePress?: () => void
}

export function TimelineActivity({ activity, isLast, onDrag, onPress, onDeletePress }: TimelineActivityProps) {
  const icon = activity.attraction_name
    ? categoryIcons[activity.attraction_name] || "📍"
    : "📍"

  return (
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <View style={styles.dot}>
          <View style={styles.dotInner} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.rightCol}>
        {activity.start_time && (
          <Text style={styles.timeLabel}>{formatTime(activity.start_time)}</Text>
        )}
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          activeOpacity={0.7}
        >
          {(activity.attraction_image || activity.attraction_name) && (
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: activity.attraction_image || "https://via.placeholder.com/80",
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {activity.title}
            </Text>
            {activity.notes && (
              <Text style={styles.cardNotes} numberOfLines={2}>
                {activity.notes}
              </Text>
            )}
          </View>
          <View style={styles.cardActions}>
            {onDrag && (
              <TouchableOpacity onPress={onDrag} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.dragIcon}>⠿</Text>
              </TouchableOpacity>
            )}
            <View style={styles.iconStack}>
              <TouchableOpacity onPress={() => {
                const query = encodeURIComponent(`${activity.title}`)
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`)
              }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.categoryIcon}>📍</Text>
              </TouchableOpacity>
              {onDeletePress && (
                <TouchableOpacity onPress={onDeletePress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
    position: "relative",
  },
  leftCol: {
    width: 24,
    alignItems: "center",
    paddingTop: 6,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: tokens.background,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  line: {
    position: "absolute",
    top: 28,
    bottom: 0,
    width: 2,
    backgroundColor: tokens.surfaceContainerHighest,
  },
  rightCol: {
    flex: 1,
    paddingBottom: 32,
  },
  timeLabel: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 12,
    color: tokens.outline,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: tokens.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: tokens.surfaceContainerHigh,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.text,
  },
  cardNotes: {
    fontFamily: tokens.fontBody,
    fontSize: 13,
    color: tokens.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  cardActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  dragIcon: {
    fontSize: 20,
    color: tokens.outline,
  },
  categoryIcon: {
    fontSize: 16,
    opacity: 0.5,
  },
  iconStack: {
    alignItems: "center",
    gap: 8,
  },
  deleteIcon: {
    fontSize: 16,
    opacity: 0.5,
  },
})
