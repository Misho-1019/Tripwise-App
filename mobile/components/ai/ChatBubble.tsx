import { View, Text, StyleSheet } from "react-native"

const tokens = {
  primary: "#0D7CFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

interface ChatBubbleProps {
  role: "ai" | "user"
  text: string
  timestamp: string
}

export function ChatBubble({ role, text, timestamp }: ChatBubbleProps) {
  const isAi = role === "ai"

  return (
    <View style={[styles.wrapper, isAi ? styles.wrapperAi : styles.wrapperUser]}>
      {isAi && (
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>🤖</Text>
        </View>
      )}
      <View style={styles.contentCol}>
        <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleUser]}>
          <Text style={[styles.bubbleText, isAi ? styles.bubbleTextAi : styles.bubbleTextUser]}>
            {text}
          </Text>
        </View>
        <Text style={[styles.timestamp, isAi ? styles.timestampAi : styles.timestampUser]}>
          {timestamp}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: 8,
    maxWidth: "85%",
  },
  wrapperAi: {
    alignSelf: "flex-start",
  },
  wrapperUser: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarIcon: {
    fontSize: 16,
  },
  contentCol: {
    gap: 4,
  },
  bubble: {
    padding: 16,
    borderRadius: 16,
  },
  bubbleAi: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: tokens.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontFamily: tokens.fontBody,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextAi: {
    color: tokens.text,
  },
  bubbleTextUser: {
    color: "#fff",
  },
  timestamp: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 10,
  },
  timestampAi: {
    color: "rgba(255,255,255,0.7)",
    marginLeft: 4,
  },
  timestampUser: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
    marginRight: 4,
  },
})
