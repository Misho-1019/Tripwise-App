import { useState, useCallback, useMemo, useRef } from "react"
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { useAttractions } from "../../hooks/useDestinations"
import { useAddActivity } from "../../hooks/useTrips"
import { Attraction } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F3F3FA",
  surfaceContainer: "#EDEDF6",
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

const categoryColors: Record<string, string> = {
  Landmark: tokens.primary,
  Museum: "#685781",
  Food: "#575f72",
  Tour: tokens.primary,
  Sightseeing: tokens.primary,
  Nature: "#34C759",
  Beach: "#0D7CFF",
  Temple: "#685781",
  Shrine: "#685781",
  Park: "#34C759",
  Market: "#575f72",
  Neighborhood: "#575f72",
  Nightlife: "#FF6B35",
  Adventure: "#FF6B35",
  History: "#685781",
}

function categoryColor(cat: string): string {
  return categoryColors[cat] || tokens.textSecondary
}

interface AddActivitySheetProps {
  visible: boolean
  onClose: () => void
  destinationId: string
  tripId: string
  dayId: string
  nextOrderIndex: number
  remainingBudget?: number | null
}

export function AddActivitySheet({ visible, onClose, destinationId, tripId, dayId, nextOrderIndex, remainingBudget }: AddActivitySheetProps) {
  const [searchText, setSearchText] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null)
  const [showManual, setShowManual] = useState(false)
  const [manualTitle, setManualTitle] = useState("")
  const [manualStartTime, setManualStartTime] = useState("")
  const [manualEndTime, setManualEndTime] = useState("")
  const [manualNotes, setManualNotes] = useState("")
  const [manualCost, setManualCost] = useState("")
  const scrollRef = useRef<ScrollView>(null)

  const { data: attrData, isLoading } = useAttractions(destinationId, activeCategory !== "All" ? { category: activeCategory } : undefined)
  const attractions = attrData?.attractions || []
  const addActivity = useAddActivity()

  const categories = useMemo(() => {
    if (!attrData?.attractions) return ["All"]
    const cats = new Set(attrData.attractions.map((a) => a.category).filter(Boolean))
    return ["All", ...Array.from(cats)] as string[]
  }, [attrData])

  const filteredAttractions = useMemo(() => {
    if (!searchText.trim()) return attractions
    const q = searchText.toLowerCase()
    return attractions.filter((a) => a.name.toLowerCase().includes(q))
  }, [attractions, searchText])

  const handleSelectAttraction = useCallback((id: string) => {
    setSelectedAttractionId((prev) => (prev === id ? null : id))
  }, [])

  const handleToggleManual = useCallback(() => {
    setShowManual((prev) => !prev)
    if (!showManual) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true })
      }, 200)
    }
  }, [showManual])

  const handleReset = useCallback(() => {
    setSearchText("")
    setActiveCategory("All")
    setSelectedAttractionId(null)
    setShowManual(false)
    setManualTitle("")
    setManualStartTime("")
    setManualEndTime("")
    setManualNotes("")
    setManualCost("")
  }, [])

  const handleAddToDay = useCallback(() => {
    const doAdd = () => {
      if (selectedAttractionId) {
        const attr = attractions.find((a) => a.id === selectedAttractionId)
        addActivity.mutate(
          {
            tripId, dayId,
            data: {
              title: attr?.name || "",
              attraction_id: selectedAttractionId,
              cost: attr?.price != null ? Number(attr.price) : undefined,
              order_index: nextOrderIndex,
            },
          },
          {
            onSuccess: () => { handleReset(); onClose() },
            onError: (err: any) => { Alert.alert("Error", err?.message || "Failed to add activity") },
          },
        )
      } else if (showManual && manualTitle.trim()) {
        addActivity.mutate(
          {
            tripId, dayId,
            data: {
              title: manualTitle.trim(),
              start_time: manualStartTime || undefined,
              end_time: manualEndTime || undefined,
              notes: manualNotes || undefined,
              cost: manualCost ? Number(manualCost) : undefined,
              order_index: nextOrderIndex,
            },
          },
          {
            onSuccess: () => { handleReset(); onClose() },
            onError: (err: any) => { Alert.alert("Error", err?.message || "Failed to add activity") },
          },
        )
      }
    }

    const activityCost = selectedAttractionId
      ? Number(attractions.find((a) => a.id === selectedAttractionId)?.price ?? 0)
      : manualCost ? Number(manualCost) : 0

    if (remainingBudget != null && activityCost > remainingBudget) {
      Alert.alert(
        "Budget Exceeded",
        `This activity costs $${activityCost}, but you only have $${remainingBudget} remaining. Add anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Add Anyway", onPress: doAdd },
        ],
      )
    } else {
      doAdd()
    }
  }, [selectedAttractionId, showManual, manualTitle, manualStartTime, manualEndTime, manualNotes, manualCost, attractions, tripId, dayId, nextOrderIndex, remainingBudget, addActivity, handleReset, onClose])

  const canAdd = !!(selectedAttractionId || (showManual && manualTitle.trim()))

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TouchableOpacity style={styles.overlayBg} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Activity</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Search */}
            <View style={styles.searchWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search attractions..."
                placeholderTextColor={tokens.outlineVariant}
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, cat === activeCategory ? styles.catPillActive : styles.catPillInactive]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.catPillText, cat === activeCategory ? styles.catPillTextActive : styles.catPillTextInactive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Results */}
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={tokens.primary} />
              </View>
            ) : filteredAttractions.length > 0 ? (
              <View style={styles.resultsList}>
                {filteredAttractions.map((attr) => {
                  const isSelected = selectedAttractionId === attr.id
                  const catColor = categoryColor(attr.category || "")
                  return (
                    <TouchableOpacity
                      key={attr.id}
                      style={[styles.attractionItem, isSelected && styles.attractionItemSelected]}
                      onPress={() => handleSelectAttraction(attr.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.attrImageWrapper}>
                        <Image
                          source={{ uri: attr.image_url || "https://via.placeholder.com/80" }}
                          style={styles.attrImage}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.attrBody}>
                        <View style={styles.attrBadgeRow}>
                          {attr.category && (
                            <View style={[styles.attrBadge, { backgroundColor: catColor + "15" }]}>
                              <Text style={[styles.attrBadgeText, { color: catColor }]}>{attr.category.toUpperCase()}</Text>
                            </View>
                          )}
                          {attr.rating != null && (
                            <View style={styles.attrRating}>
                              <Text style={styles.attrStar}>★</Text>
                              <Text style={styles.attrRatingText}>{Number(attr.rating).toFixed(1)}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.attrTitle} numberOfLines={1}>{attr.name}</Text>
                        <Text style={styles.attrMeta}>
                          {attr.price != null ? `$${attr.price}` : ""}{attr.duration ? ` • ${attr.duration}` : ""}
                        </Text>
                      </View>
                      <View style={[styles.radio, isSelected && styles.radioSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            ) : !isLoading ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No attractions found</Text>
              </View>
            ) : null}

            {/* Manual Divider */}
            <View style={styles.manualDivider}>
              <View style={styles.manualLine} />
              <TouchableOpacity onPress={handleToggleManual}>
                <Text style={styles.manualLink}>{showManual ? "hide manual entry" : "or add manually"}</Text>
              </TouchableOpacity>
              <View style={styles.manualLine} />
            </View>

            {/* Manual Form */}
            {showManual && (
              <View style={styles.manualForm}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>TITLE</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="e.g. Seine River Cruise"
                    placeholderTextColor={tokens.outlineVariant}
                    value={manualTitle}
                    onChangeText={setManualTitle}
                  />
                </View>
                <View style={styles.fieldRow}>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>START TIME</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="09:00"
                      placeholderTextColor={tokens.outlineVariant}
                      value={manualStartTime}
                      onChangeText={setManualStartTime}
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>END TIME</Text>
                    <TextInput
                      style={styles.fieldInput}
                      placeholder="10:00"
                      placeholderTextColor={tokens.outlineVariant}
                      value={manualEndTime}
                      onChangeText={setManualEndTime}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>NOTES</Text>
                  <TextInput
                    style={[styles.fieldInput, styles.fieldTextarea]}
                    placeholder="Any specific details or reminders..."
                    placeholderTextColor={tokens.outlineVariant}
                    value={manualNotes}
                    onChangeText={setManualNotes}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>ESTIMATED COST</Text>
                  <View style={styles.costWrapper}>
                    <Text style={styles.costPrefix}>$</Text>
                    <TextInput
                      style={[styles.fieldInput, { paddingLeft: 28 }]}
                      placeholder="0.00"
                      placeholderTextColor={tokens.outlineVariant}
                      value={manualCost}
                      onChangeText={setManualCost}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Bottom spacer for footer */}
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
              onPress={handleAddToDay}
              disabled={!canAdd || addActivity.isPending}
              activeOpacity={0.8}
            >
              {addActivity.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.addButtonText}>Add to Day</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: tokens.surfaceContainerLowest,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: "92%",
    flexDirection: "column",
  },
  handleRow: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.outlineVariant,
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 20,
    fontWeight: "700",
    color: tokens.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 18,
    color: tokens.textSecondary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    backgroundColor: tokens.surfaceContainerLow,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: tokens.text,
    height: "100%",
  },
  catList: {
    gap: 8,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  catPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  catPillActive: {
    backgroundColor: tokens.primary,
  },
  catPillInactive: {
    backgroundColor: tokens.surfaceContainerHigh,
  },
  catPillText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 13,
  },
  catPillTextActive: {
    color: "#fff",
  },
  catPillTextInactive: {
    color: tokens.textSecondary,
  },
  loadingRow: {
    paddingVertical: 40,
    alignItems: "center",
  },
  resultsList: {
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 16,
  },
  attractionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: tokens.surfaceContainer,
    borderWidth: 1,
    borderColor: "transparent",
  },
  attractionItemSelected: {
    backgroundColor: tokens.primary + "08",
    borderColor: tokens.primary + "30",
  },
  attrImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: tokens.surfaceContainerHigh,
  },
  attrImage: {
    width: "100%",
    height: "100%",
  },
  attrBody: {
    flex: 1,
    minWidth: 0,
  },
  attrBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  attrBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attrBadgeText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  attrRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  attrStar: {
    fontSize: 14,
    color: "#F59E0B",
  },
  attrRatingText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 12,
    color: tokens.textSecondary,
  },
  attrTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 15,
    fontWeight: "700",
    color: tokens.text,
    marginBottom: 2,
  },
  attrMeta: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 12,
    color: tokens.textSecondary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: tokens.primary,
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: tokens.primary,
  },
  noResults: {
    paddingVertical: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
  },
  manualDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 24,
  },
  manualLine: {
    flex: 1,
    height: 1,
    backgroundColor: tokens.outlineVariant,
    opacity: 0.3,
  },
  manualLink: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 13,
    color: tokens.primary,
  },
  manualForm: {
    paddingHorizontal: 24,
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 11,
    color: tokens.textSecondary,
    letterSpacing: 1,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  fieldInput: {
    backgroundColor: tokens.surfaceContainer,
    borderWidth: 1,
    borderColor: tokens.outlineVariant + "30",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: tokens.fontBodyMedium,
    fontSize: 15,
    color: tokens.text,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
  },
  fieldTextarea: {
    minHeight: 80,
    paddingTop: 14,
  },
  costWrapper: {
    position: "relative",
  },
  costPrefix: {
    position: "absolute",
    left: 16,
    top: 14,
    fontFamily: tokens.fontBodyBold,
    fontSize: 17,
    color: tokens.textSecondary,
    zIndex: 1,
  },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: tokens.outlineVariant + "15",
    backgroundColor: tokens.surfaceContainerLowest,
  },
  addButton: {
    backgroundColor: tokens.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: tokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontFamily: tokens.fontHeadline,
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
})
