import { useState, useCallback } from "react"
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, FlatList } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useDestinations, useCategories } from "../../hooks/useDestinations"
import { useSavedDestinations, useSaveDestination, useUnsaveDestination } from "../../hooks/useSaved"
import { DestinationCard } from "../../components/destination/DestinationCard"
import { CategoryPill } from "../../components/ui/CategoryPill"

const tokens = {
  primary: "#0D7CFF",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  surfaceContainer: "#EDEDF6",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA23dqBLO1gpiDU8drMOALHNu_2xulmB29M6iUbe_Vg6Dt3h6HFQsz1EPBMb3Hr7aMsWyRuYpWHDAgSknu7vFiWEGMVilBZyV9YBW5WPMd0MNjBWBO5DtKnsvSPYvCAwAH9_RgoyztjhbX5zYx3l-G4t0iv1IPQ44HUymQHQSn9_hlN1ZKXhBMgfGDV7vjCfsqP2dPvKaTFY8bkcGDOmi3R5NV9vlVtSiPrYiuzUnM-41RrMTa8VLVMV-bMzjd6MAPIPRU7K_Zf96Y"

const fallbackCategories = [
  { id: "all", name: "All" },
  { id: "beach", name: "Beach" },
  { id: "adventure", name: "Adventure" },
  { id: "culture", name: "Culture" },
  { id: "food", name: "Food" },
  { id: "nature", name: "Nature" },
  { id: "history", name: "History" },
]

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined)
  const [searchFocused, setSearchFocused] = useState(false)

  const { data: destData, isLoading: destLoading, error: destError } = useDestinations(
    activeCategory ? { category: activeCategory } : undefined
  )
  const { data: catData } = useCategories()
  const { data: savedData } = useSavedDestinations()
  const saveMutation = useSaveDestination()
  const unsaveMutation = useUnsaveDestination()

  const categories = catData?.categories || fallbackCategories
  const destinations = destData?.destinations || []
  const savedIds = new Set(savedData?.destinations?.map((d) => d.id) || [])

  const handleSave = useCallback(
    (id: string) => {
      if (savedIds.has(id)) {
        unsaveMutation.mutate(id)
      } else {
        saveMutation.mutate(id)
      }
    },
    [savedIds, saveMutation, unsaveMutation],
  )

  return (
    <View style={styles.container}>
      {/* Header - absolute over hero */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>✈</Text>
          <Text style={styles.headerTitle}>TripWise</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", tokens.background]}
            locations={[0, 0.4, 1]}
            style={styles.heroOverlay}
          />
          <View style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
              <Text style={styles.searchInputIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Where do you want to go?"
                placeholderTextColor={tokens.textSecondary}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onSubmitEditing={() => router.push("/(tabs)/explore")}
              />
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <CategoryPill
                label={item.name}
                isActive={item.name === activeCategory || (item.name === "All" && !activeCategory)}
                onPress={() => setActiveCategory(item.name === "All" ? undefined : item.name)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Popular Destinations */}
        <View style={styles.destinationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {destLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={tokens.primary} />
            </View>
          ) : destError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load destinations</Text>
            </View>
          ) : (
            <FlatList
              data={destinations}
              renderItem={({ item }) => (
                <DestinationCard
                  destination={item}
                  isSaved={savedIds.has(item.id)}
                  onPress={(id) => router.push(`/destination/${id}`)}
                  onSave={handleSave}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={296}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselList}
            />
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    fontSize: 24,
    color: tokens.primary,
  },
  headerTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 20,
    fontWeight: "700",
    color: tokens.primary,
  },
  searchIcon: {
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    height: 340,
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchContainer: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.surface,
    borderRadius: 9999,
    height: 56,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  searchInputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: tokens.text,
    height: "100%",
  },
  categoriesSection: {
    marginTop: 16,
  },
  categoriesList: {
    gap: 12,
    paddingHorizontal: 16,
  },
  destinationsSection: {
    marginTop: 32,
    paddingLeft: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingRight: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 24,
    fontWeight: "700",
    color: tokens.text,
  },
  viewAll: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 14,
    color: tokens.primary,
  },
  carouselList: {
    gap: 16,
    paddingRight: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
    color: tokens.textSecondary,
  },
})
