import { View, Text, StyleSheet, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const tokens = {
  fontHeadline: "PlusJakartaSans-Bold",
  fontBodyBold: "Inter-Bold",
}

interface QuoteCardProps {
  imageUrl: string
}

export function QuoteCard({ imageUrl }: QuoteCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        locations={[0.6, 1]}
        style={styles.overlay}
      />
      <View style={styles.content}>
        <Text style={styles.quoteIcon}>❝</Text>
        <Text style={styles.quote}>
          The journey of a thousand miles begins with a single step.
        </Text>
        <Text style={styles.attribution}>LAO TZU</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    height: 192,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    marginTop: 48,
    marginBottom: 16,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  quoteIcon: {
    fontSize: 32,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 4,
  },
  quote: {
    fontFamily: tokens.fontHeadline,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    fontStyle: "italic",
    lineHeight: 24,
  },
  attribution: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 2,
    marginTop: 8,
  },
})
