import { useState, useCallback, useRef, useMemo } from "react"
import { View, Text, TextInput, Modal, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions, Linking, Alert, Keyboard, TouchableWithoutFeedback } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, router } from "expo-router"
import { useDestination, useAttractions, useHotels } from "../../hooks/useDestinations"
import { useReviews, useCreateReview } from "../../hooks/useReviews"
import { useSavedDestinations, useSaveDestination, useUnsaveDestination } from "../../hooks/useSaved"
import { AttractionCard } from "../../components/destination/AttractionCard"
import { HotelCard } from "../../components/destination/HotelCard"
import { ReviewCard } from "../../components/destination/ReviewCard"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainer: "#EDEDF6",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

const tabs = ["Attractions", "Hotels", "Reviews"] as const
type Tab = (typeof tabs)[number]

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>("Attractions")

  const { data: destData, isLoading: destLoading, error: destError } = useDestination(id || "")
  const { data: attrData } = useAttractions(id || "")
  const { data: hotelData } = useHotels(id || "")
  const { data: reviewData } = useReviews(id || "")

  const destination = destData?.destination
  const attractions = attrData?.attractions || []
  const hotels = hotelData?.hotels || []
  const reviews = reviewData?.reviews || []

  const reviewAvg = reviewData?.averageRating

  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const createReview = useCreateReview()
  const { data: savedData } = useSavedDestinations()
  const saveMutation = useSaveDestination()
  const unsaveMutation = useUnsaveDestination()

  const savedIds = new Set(savedData?.destinations?.map((d) => d.id) || [])
  const isSaved = id ? savedIds.has(id) : false

  const handleToggleSave = useCallback(() => {
    if (!id) return
    if (isSaved) {
      unsaveMutation.mutate(id)
    } else {
      saveMutation.mutate(id)
    }
  }, [id, isSaved, saveMutation, unsaveMutation])

  const handleSubmitReview = () => {
    if (reviewRating === 0) return
    createReview.mutate(
      { destinationId: id || "", data: { rating: reviewRating, comment: reviewComment } },
      { onSuccess: () => { setShowReviewModal(false); setReviewRating(0); setReviewComment("") } },
    )
  }

  const heroImages = useMemo(() => {
    const images = [destination?.image_url]
    if (attractions.length > 0) images.push(attractions[0].image_url)
    if (hotels.length > 0) images.push(hotels[0].image_url)
    return images.filter(Boolean) as string[]
  }, [destination, attractions, hotels])

  const scrollX = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  if (destLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tokens.primary} />
      </View>
    )
  }

  if (destError || !destination) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load destination</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerIcon}>✈</Text>
            <Text style={styles.headerTitle}>TripWise</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            bounces={false}
          >
            {heroImages.map((img, i) => (
              <View key={i} style={styles.heroSlide}>
                <Image source={{ uri: img }} style={styles.heroImage} />
              </View>
            ))}
          </Animated.ScrollView>
          {heroImages.length > 1 && (
            <View style={styles.heroDots}>
              {heroImages.map((_, i) => (
                <HeroDot key={i} index={i} scrollX={scrollX} />
              ))}
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            locations={[0.4, 1]}
            style={styles.heroOverlay}
          />
          <TouchableOpacity style={styles.heartButton} onPress={handleToggleSave} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <Text style={styles.heartIcon}>{isSaved ? "♥" : "♡"}</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.destTitle}>{destination.name}</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.country}>{destination.country}</Text>
              </View>
            </View>
            <View style={styles.ratingCol}>
              <View style={styles.ratingRow}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.ratingValue}>{destination.rating ? Number(destination.rating).toFixed(1) : "N/A"}</Text>
              </View>
              <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
            </View>
          </View>
          {destination.description && (
            <Text style={styles.description}>{destination.description}</Text>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Attractions */}
        {activeTab === "Attractions" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Must-Visit Spots</Text>
            </View>
            {attractions.length === 0 ? (
              <Text style={styles.emptyText}>No attractions listed</Text>
            ) : (
              <View style={styles.attractionsList}>
                {attractions.map((a) => (
                  <AttractionCard key={a.id} attraction={a} onPress={() => {
                    const query = encodeURIComponent(`${a.name} ${destination.name}`)
                    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`)
                  }} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Hotels */}
        {activeTab === "Hotels" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Rated Hotels</Text>
            </View>
            {hotels.length === 0 ? (
              <Text style={styles.emptyText}>No hotels available</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hotelsCarousel}>
                {hotels.map((h) => (
                  <HotelCard key={h.id} hotel={h} onPress={() => {
                    const query = encodeURIComponent(`${h.name} ${destination.name}`)
                    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`)
                  }} />
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {/* Reviews */}
        {activeTab === "Reviews" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Reviews</Text>
            </View>
            {reviews.length === 0 ? (
              <View style={styles.emptyReviews}>
                <Text style={styles.emptyText}>No reviews yet</Text>
                <Text style={styles.emptySubtext}>Be the first to review!</Text>
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.writeReviewButton} onPress={() => setShowReviewModal(true)}>
              <Text style={styles.writeReviewText}>✏ Write a Review</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={showReviewModal} transparent animationType="slide" onRequestClose={() => setShowReviewModal(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.ratingLabel}>Tap to rate</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                  <Text style={[styles.star, star <= reviewRating && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Share your experience (optional)"
              placeholderTextColor="#999"
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
              textAlignVertical="top"
            />

            {createReview.error && (
              <Text style={styles.modalError}>
                {createReview.error instanceof Error ? createReview.error.message : "Failed to submit"}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, reviewRating === 0 && styles.submitDisabled]}
              onPress={handleSubmitReview}
              disabled={reviewRating === 0 || createReview.isPending}
            >
              {createReview.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

function HeroDot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const dotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0.25, 1, 0.25],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      scrollX.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [8, 24, 8],
      Extrapolation.CLAMP,
    ),
  }))
  return <Animated.View style={[styles.heroDot, dotStyle]} />
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.background },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: tokens.background },
  errorText: { fontFamily: tokens.fontBodyMedium, fontSize: 14, color: tokens.textSecondary, marginBottom: 12 },
  retryButton: { padding: 12 },
  retryText: { fontFamily: tokens.fontBodyBold, fontSize: 14, color: tokens.primary },
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
    paddingBottom: 8,
  },
  headerButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  headerButtonText: { fontSize: 22, color: "#fff" },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerIcon: { fontSize: 20, color: "#fff" },
  headerTitle: { fontFamily: tokens.fontHeadline, fontSize: 18, fontWeight: "700", color: "#fff" },
  hero: { height: 340, position: "relative" },
  heroSlide: { width: SCREEN_WIDTH, height: 340 },
  heroImage: { width: SCREEN_WIDTH, height: 340 },
  heroOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  heroDots: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  heroDot: { height: 8, borderRadius: 4, backgroundColor: "#fff" },
  heartButton: {
    position: "absolute",
    top: 80,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: { fontSize: 22, color: "#fff" },
  infoCard: {
    backgroundColor: tokens.surface,
    marginTop: -32,
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    position: "relative",
    zIndex: 10,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  destTitle: { fontFamily: tokens.fontHeadline, fontSize: 28, fontWeight: "700", color: tokens.text, letterSpacing: -0.5 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  locationIcon: { fontSize: 14 },
  country: { fontFamily: tokens.fontBodyMedium, fontSize: 14, color: tokens.textSecondary },
  ratingCol: { alignItems: "flex-end" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  starIcon: { fontSize: 16, color: "#F59E0B" },
  ratingValue: { fontFamily: tokens.fontBodyBold, fontSize: 16, color: tokens.text },
  reviewCount: { fontFamily: tokens.fontBody, fontSize: 12, color: tokens.textSecondary, marginTop: 2 },
  description: { fontFamily: tokens.fontBody, fontSize: 14, color: tokens.textSecondary, lineHeight: 20, marginTop: 16 },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    gap: 32,
    backgroundColor: tokens.background,
  },
  tab: { paddingBottom: 12 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: tokens.primary },
  tabText: { fontFamily: tokens.fontBodyBold, fontSize: 14, color: tokens.textSecondary },
  tabTextActive: { color: tokens.primary },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontFamily: tokens.fontHeadline, fontSize: 20, fontWeight: "700", color: tokens.text },
  emptyText: { fontFamily: tokens.fontBody, fontSize: 14, color: tokens.textSecondary, textAlign: "center", paddingVertical: 40 },
  emptySubtext: { fontFamily: tokens.fontBody, fontSize: 12, color: tokens.textSecondary, textAlign: "center" },
  emptyReviews: { paddingVertical: 40, alignItems: "center" },
  attractionsList: { gap: 16 },
  hotelsCarousel: { gap: 16, paddingRight: 16 },
  reviewsList: { gap: 24 },
  writeReviewButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  writeReviewText: { fontFamily: tokens.fontBodyBold, fontSize: 14, color: tokens.primary },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: tokens.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { fontFamily: tokens.fontHeadline, fontSize: 20, fontWeight: "700", color: tokens.text },
  modalClose: { fontSize: 20, color: tokens.textSecondary },
  ratingLabel: { fontFamily: tokens.fontBodyBold, fontSize: 14, color: tokens.textSecondary, marginBottom: 12 },
  starRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  star: { fontSize: 36, color: "#D1D5DB" },
  starActive: { color: "#F59E0B" },
  commentInput: { backgroundColor: tokens.background, borderRadius: 12, padding: 16, minHeight: 100, fontFamily: tokens.fontBody, fontSize: 16, color: tokens.text, marginBottom: 16 },
  modalError: { fontFamily: tokens.fontBodyMedium, fontSize: 14, color: "#FF3B30", marginBottom: 12, textAlign: "center" },
  submitButton: { backgroundColor: tokens.primary, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  submitDisabled: { opacity: 0.5 },
  submitText: { fontFamily: tokens.fontBodyBold, fontSize: 16, color: "#fff" },
})
