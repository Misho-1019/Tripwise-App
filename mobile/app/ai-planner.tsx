import { useState, useCallback, useRef, useEffect } from "react"
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, FlatList } from "react-native"
import { router } from "expo-router"
import { useAiChat } from "../hooks/useAiPlanner"
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

let msgCounter = 0

export default function AiPlannerScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Hi! I'm your TripWise assistant. I can help you plan trips or answer questions about the app. What would you like to do?",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [showItinerary, setShowItinerary] = useState<{ plan: AiTripPlan; name: string } | null>(null)
  const scrollRef = useRef<ScrollView>(null)
  const aiChat = useAiChat()

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200)
  }, [messages])

  const addMessage = useCallback((role: "ai" | "user", text: string, itinerary?: AiTripPlan, destinationName?: string) => {
    const id = `msg_${++msgCounter}`
    setMessages((prev) => [
      ...prev,
      { id, role, text, timestamp: new Date(), itinerary, destinationName },
    ])
  }, [])

  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text || aiChat.isPending) return
    setInputText("")

    addMessage("user", text)

    aiChat.mutate({ message: text }, {
      onSuccess: (data) => {
        if (data.type === "itinerary") {
          const plan: AiTripPlan = { days: data.data.days }
          addMessage("ai", `Here's your itinerary for ${data.data.destination}:`, plan, data.data.destination)
        } else {
          addMessage("ai", data.text)
        }
      },
      onError: () => {
        addMessage("ai", "Sorry, I had trouble processing that. Could you try again?")
      },
    })
  }, [inputText, aiChat, addMessage])

  const handleViewDetails = useCallback((plan: AiTripPlan, name: string) => {
    setShowItinerary({ plan, name })
  }, [])

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={{
          uri: "https://lh3.googleusercontent.com/aida/AP1WRLvPnlG66QHnCrU6HMux4Ca-9069DpEwdAygfjF-gPCMR28d0LuNJ2uXxXgcpqeX3QYUBLTxW2ynsIDkClZeRD0rLhuc2lAlW8kBgyvzDEOpSHSQ55dMyzuYpmzJIDeo70zf3vgngHMJb2FdFDCvSV3xC7wXkOxpwDuW_uKpcK2VTnPDUhCG8elrnij0Bzr9QLstfN1AM6UpnhgwNwkNa7Oz16OWeBD_8HAcmMftprD8s78UivP3h3_d-XE",
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
          <View key={msg.id} style={msg.role === "user" ? styles.messageWrapperUser : styles.messageWrapper}>
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
        ))}
        {aiChat.isPending && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={tokens.primary} />
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
            disabled={!inputText.trim() || aiChat.isPending}
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
    maxWidth: "85%",
  },
  messageWrapperUser: {
    alignSelf: "flex-end",
  },
  cardWrapper: {
    marginTop: 8,
  },
  loadingBubble: {
    alignSelf: "flex-start",
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
