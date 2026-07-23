import { useState, useCallback, useRef, useEffect } from "react"
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, FlatList } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useAiPlanTrip } from "../hooks/useAiPlanner"
import { ChatBubble } from "../components/ai/ChatBubble"
import { ItineraryPreviewCard } from "../components/ai/ItineraryPreviewCard"
import { AiTripPlan } from "../types"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainer: "#EDEDF6",
  surfaceContainerHigh: "#E7E8F1",
  surfaceContainerLowest: "#FFFFFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  outline: "#787A84",
  outlineVariant: "#AFB1BC",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

interface Message {
  id: string
  role: "ai" | "user"
  text: string
  timestamp: Date
  itinerary?: AiTripPlan
  destinationName?: string
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return "Just now"
  const h = date.getHours()
  const m = date.getMinutes().toString().padStart(2, "0")
  const ampm = h >= 12 ? "PM" : "AM"
  return `${h % 12 || 12}:${m} ${ampm}`
}

function parseMessage(text: string): { destination: string; days: number; budget: number; interests: string[] } {
  const lower = text.toLowerCase()

  const daysMatch = lower.match(/(\d+)\s*days?/)
  const days = daysMatch ? parseInt(daysMatch[1], 10) : 3

  const budgetMatch = lower.match(/\$(\d+(?:,\d{3})*)/)
  const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ""), 10) : 500

  const knownDestinations = [
    "paris", "tokyo", "bali", "new york", "dubai", "barcelona", "bangkok", "sydney", "rome", "cape town",
    "london", "berlin", "madrid", "amsterdam", "prague", "vienna", "venice", "florence", "santorini",
    "maldives", "phuket", "singapore", "hong kong", "seoul", "kyoto", "osaka", "mumbai", "delhi",
  ]
  let destination = ""
  for (const d of knownDestinations) {
    if (lower.includes(d)) {
      destination = d.charAt(0).toUpperCase() + d.slice(1)
      break
    }
  }
  if (!destination) {
    const words = text.split(/[\s,]+/).filter((w) => w.length > 2 && !/^\d+$/.test(w) && !/^\$/.test(w))
    destination = words[words.length - 1] || "Unknown"
  }

  const interestKeywords = ["food", "culture", "nature", "adventure", "beach", "shopping", "history", "nightlife", "museums", "hiking", "relaxation", "romantic"]
  const interests = interestKeywords.filter((ik) => lower.includes(ik))

  return { destination, days, budget, interests }
}

export default function AiPlannerScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hi! Tell me about your dream trip and I will create the perfect itinerary for you.",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [showItinerary, setShowItinerary] = useState<{ plan: AiTripPlan; name: string } | null>(null)
  const scrollRef = useRef<ScrollView>(null)
  const aiPlan = useAiPlanTrip()

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200)
  }, [messages])

  const addMessage = useCallback((role: "ai" | "user", text: string, itinerary?: AiTripPlan, destinationName?: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role, text, timestamp: new Date(), itinerary, destinationName },
    ])
  }, [])

  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text || aiPlan.isPending) return
    setInputText("")

    addMessage("user", text)

    const parsed = parseMessage(text)

    addMessage("ai", `Let me plan an amazing trip to ${parsed.destination} for you! Give me a moment...`)

    aiPlan.mutate(parsed, {
      onSuccess: (data) => {
        setMessages((prev) => prev.filter((m) => m.id !== prev[prev.length - 1]?.id))
        addMessage(
          "ai",
          `That sounds amazing! ${parsed.destination} is a wonderful destination. Based on your $${parsed.budget} budget, I've drafted a premium ${parsed.days}-day experience for you:`,
          data.suggestedTrip,
          parsed.destination,
        )
      },
      onError: () => {
        setMessages((prev) => prev.filter((m) => m.id !== prev[prev.length - 1]?.id))
        addMessage("ai", "Sorry, I couldn't generate a trip plan. Please try again with different details.")
      },
    })
  }, [inputText, aiPlan, addMessage])

  const handleViewDetails = useCallback((plan: AiTripPlan, name: string) => {
    setShowItinerary({ plan, name })
  }, [])

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800",
        }}
        style={styles.bgImage}
        resizeMode="cover"
      />
      <View style={styles.bgOverlay} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Trip Planner</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>🕐</Text>
        </TouchableOpacity>
      </View>

      {/* Chat */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageWrapper}>
            {msg.role === "ai" && (
              <View style={styles.avatarCol}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>🤖</Text>
                </View>
              </View>
            )}
            <View style={[styles.messageCol, msg.role === "user" && styles.messageColUser]}>
              <ChatBubble
                role={msg.role}
                text={msg.text}
                timestamp={formatTimestamp(msg.timestamp)}
              />
              {msg.itinerary && msg.destinationName && (
                <View style={styles.cardWrapper}>
                  <ItineraryPreviewCard
                    plan={msg.itinerary}
                    destinationName={msg.destinationName}
                    onViewDetails={() => handleViewDetails(msg.itinerary!, msg.destinationName!)}
                  />
                </View>
              )}
            </View>
          </View>
        ))}
        {aiPlan.isPending && (
          <View style={styles.loadingRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>🤖</Text>
            </View>
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color={tokens.primary} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="rgba(47,50,58,0.5)"
              value={inputText}
              onChangeText={setInputText}
              multiline
              onSubmitEditing={handleSend}
              blurOnSubmit
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || aiPlan.isPending}
            activeOpacity={0.7}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Itinerary Detail Modal */}
      <Modal visible={!!showItinerary} transparent animationType="slide" onRequestClose={() => setShowItinerary(null)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowItinerary(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandleRow}>
              <View style={styles.modalHandle} />
            </View>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{showItinerary?.name} Itinerary</Text>
              <TouchableOpacity onPress={() => setShowItinerary(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={showItinerary?.plan.days || []}
              renderItem={({ item }) => (
                <View style={styles.dayCard}>
                  <Text style={styles.dayTitle}>Day {item.day_number}: {item.title}</Text>
                  <View style={styles.mealRow}>
                    <Text style={styles.mealLabel}>☕ Breakfast: </Text>
                    <Text style={styles.mealValue}>{item.meal_suggestions.breakfast}</Text>
                  </View>
                  <View style={styles.mealRow}>
                    <Text style={styles.mealLabel}>🍽️ Lunch: </Text>
                    <Text style={styles.mealValue}>{item.meal_suggestions.lunch}</Text>
                  </View>
                  <View style={styles.mealRow}>
                    <Text style={styles.mealLabel}>🌙 Dinner: </Text>
                    <Text style={styles.mealValue}>{item.meal_suggestions.dinner}</Text>
                  </View>
                  <View style={styles.activitiesList}>
                    {item.activities.map((act, i) => (
                      <View key={i} style={styles.activityItem}>
                        <Text style={styles.activityDot}>•</Text>
                        <View style={styles.activityBody}>
                          <Text style={styles.activityTitle}>{act.title}</Text>
                          <Text style={styles.activityMeta}>
                            {act.duration}{act.estimated_cost ? ` • $${act.estimated_cost}` : ""} • {act.category}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.day_number.toString()}
              contentContainerStyle={styles.modalList}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.savePlanButton}
                  onPress={() => setShowItinerary(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.savePlanText}>Close</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    fontSize: 20,
    color: "#fff",
  },
  headerTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 18,
    fontWeight: "700",
    color: tokens.primary,
  },
  chatArea: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingBottom: 24,
    gap: 16,
  },
  messageWrapper: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  avatarCol: {
    width: 32,
    paddingTop: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  avatarIcon: {
    fontSize: 16,
  },
  messageCol: {
    flex: 1,
    gap: 4,
  },
  messageColUser: {
    alignItems: "flex-end",
  },
  cardWrapper: {
    marginTop: 8,
  },
  loadingRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  loadingBubble: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  inputBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 32,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "300",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 9999,
    paddingHorizontal: 16,
  },
  textInput: {
    fontFamily: tokens.fontBody,
    fontSize: 15,
    color: tokens.text,
    minHeight: 40,
    maxHeight: 80,
    paddingVertical: 10,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: tokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalSheet: {
    backgroundColor: tokens.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "85%",
    paddingBottom: 40,
  },
  modalHandleRow: {
    alignItems: "center",
    paddingTop: 12,
  },
  modalHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.outlineVariant,
    opacity: 0.4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 22,
    fontWeight: "700",
    color: tokens.text,
  },
  modalClose: {
    fontSize: 20,
    color: tokens.textSecondary,
  },
  modalList: {
    padding: 24,
    gap: 16,
  },
  dayCard: {
    backgroundColor: tokens.surfaceContainer,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  dayTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 18,
    fontWeight: "700",
    color: tokens.text,
    marginBottom: 8,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealLabel: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 13,
    color: tokens.textSecondary,
  },
  mealValue: {
    fontFamily: tokens.fontBody,
    fontSize: 13,
    color: tokens.text,
  },
  activitiesList: {
    marginTop: 8,
    gap: 8,
  },
  activityItem: {
    flexDirection: "row",
    gap: 8,
  },
  activityDot: {
    fontSize: 16,
    color: tokens.primary,
    marginTop: 1,
  },
  activityBody: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 14,
    color: tokens.text,
  },
  activityMeta: {
    fontFamily: tokens.fontBody,
    fontSize: 12,
    color: tokens.textSecondary,
    marginTop: 2,
  },
  savePlanButton: {
    backgroundColor: tokens.primary,
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
    marginTop: 16,
  },
  savePlanText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 16,
    color: "#fff",
  },
})
