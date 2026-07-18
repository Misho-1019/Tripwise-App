import { useState, useCallback, useRef, useEffect } from "react"
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import { router } from "expo-router"
import { useDestinations, useCategories } from "../../hooks/useDestinations"
import { ExploreCard } from "../../components/destination/ExploreCard"
import { FilterChip } from "../../components/ui/FilterChip"
import { Destination } from "../../types"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  text: "#1A1C1C",
  textSecondary: "#717786",
  outlineVariant: "#C1C6D7",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
}

const filters = [
  { id: "budget", label: "Budget" },
  { id: "duration", label: "Duration" },
  { id: "rating", label: "Rating" },
  { id: "category", label: "Category" },
]

function SearchBar({ onSearch }: { onSearch: (text: string) => void }) {
  const [text, setText] = useState("")
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    const timer = setTimeout(() => onSearch(text.trim()), 300)
    return () => clearTimeout(timer)
  }, [text, onSearch])

  const handleSubmit = () => {
    onSearch(text.trim())
    inputRef.current?.blur()
  }

  return (
    <View style={styles.searchSection}>
      <View style={styles.searchWrapper}>
        <TouchableOpacity onPress={handleSubmit} style={styles.searchIconButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor={tokens.textSecondary}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  )
}

export default function ExploreScreen() {
  const [activeSearch, setActiveSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { data: destData, isLoading, error } = useDestinations(
    activeSearch ? { search: activeSearch } : undefined
  )

  const destinations = destData?.destinations || []

  const handleSearch = useCallback((text: string) => {
    setActiveSearch(text)
  }, [])

  const handleFilterPress = useCallback((id: string) => {
    setActiveFilter((prev) => (prev === id ? null : id))
  }, [])

  const renderDestination = useCallback(
    ({ item }: { item: Destination }) => (
      <ExploreCard
        destination={item}
        variant={viewMode}
        onPress={(id) => router.push(`/destination/${id}`)}
      />
    ),
    [viewMode],
  )

  const renderHeader = useCallback(() => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerIcon}>✈</Text>
          <Text style={styles.headerTitle}>TripWise</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              isActive={activeFilter === f.id}
              onPress={() => handleFilterPress(f.id)}
            />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.gridToggle} onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
          <Text style={styles.gridIcon}>{viewMode === "grid" ? "≡" : "▦"}</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.primary} />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load destinations</Text>
        </View>
      )}

      {!isLoading && !error && destinations.length > 0 && (
        <Text style={styles.resultCount}>
          {destinations.length} destination{destinations.length !== 1 ? "s" : ""} found
        </Text>
      )}
    </View>
  ), [activeFilter, viewMode, activeSearch, isLoading, error, destinations.length])

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
      {error ? renderHeader() : (
        <FlatList
          key={viewMode}
          data={destinations}
          renderItem={renderDestination}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === "grid" ? 2 : undefined}
          columnWrapperStyle={viewMode === "grid" ? styles.gridRow : undefined}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No destinations found</Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting your search or filters
                </Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.background },
  header: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerIcon: { fontSize: 24, color: tokens.primary },
  headerTitle: { fontFamily: tokens.fontHeadline, fontSize: 20, fontWeight: "700", color: tokens.primary },
  searchSection: { paddingHorizontal: 16, marginTop: 8 },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.surface,
    borderRadius: 9999,
    height: 48,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconButton: { marginRight: 8 },
  searchIcon: { fontSize: 18 },
  searchInput: { flex: 1, fontFamily: tokens.fontBody, fontSize: 16, color: tokens.text, height: "100%" },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterScroll: { flex: 1 },
  gridToggle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: tokens.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  gridIcon: { fontSize: 18, color: tokens.primary },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  gridRow: { gap: 16, marginBottom: 16 },
  resultCount: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  loadingContainer: { paddingVertical: 40, alignItems: "center" },
  errorContainer: { paddingVertical: 40, alignItems: "center" },
  errorText: { fontFamily: tokens.fontBodyMedium, fontSize: 14, color: tokens.textSecondary },
  emptyContainer: { paddingVertical: 60, alignItems: "center" },
  emptyText: { fontFamily: tokens.fontHeadline, fontSize: 16, fontWeight: "600", color: tokens.text },
  emptySubtext: { fontFamily: tokens.fontBody, fontSize: 14, color: tokens.textSecondary, marginTop: 4 },
})
