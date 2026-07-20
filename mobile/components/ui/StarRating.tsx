import { View, Text, StyleSheet } from "react-native"

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
}

export function StarRating({ rating, max = 5, size = 16 }: StarRatingProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: max }, (_, i) => (
        <Text key={i} style={[styles.star, { fontSize: size, color: i < Math.round(rating) ? "#F59E0B" : "#D1D5DB" }]}>
          ★
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  star: {
    lineHeight: undefined,
  },
})
