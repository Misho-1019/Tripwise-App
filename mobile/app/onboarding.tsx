import { useRef, useState, useCallback } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useUiStore } from "../store/uiStore"
import { Button } from "../components/ui/Button"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const PARALLAX_FACTOR = 0.3

const slides = [
  {
    id: "1",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLs02kjS35AHFvpyP9HmpJsvdPxqGj1gUXKtaqEmKMYDbYDoCD4Km7WA9gs1qlZth3XabUWRZtKGI407QAQhOqJIwjyPPfaq_DB5D2NKzQTpbVAQXjLkf7rPaR1bZsAyxCnI4UeAL-xHnOsNVEP184O_ZgEo-dynBow5_PkhluIdxmSgnyIvJ5gYQ9mdU3JbHC2b440_UeYEfP65tcdAoYo3TAlKH455TiylCSdpfdwgJ2Agv2fse5TUyHQ",
    title: "Discover Your Next Adventure",
    subtitle: "Explore thousands of destinations worldwide",
    buttonColor: "#006385",
  },
  {
    id: "2",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLs6mYQ-MJJ9cJfnAqqTg2hhSCeE8Ar23deCDdhLPEkDgSzfwYCyGvjnnR9BFqssiFS1lAqo6au8gxsNQ5_5c1oCW4Q8sKFj8CytP6_uHfMuJ6ob5tGE7kuy7S7af8jxMj_34Z8h8q2PDpJyFKokuW6JJ4n3dui6GFDT5pVEClddnunbPLB120oVOes1bGsCxz4r7KiGkiHjcAsRbM2DFUtuA-Q3DQF724msOD5zYKOi8HBHKnUngGQGmg",
    title: "Plan Your Perfect Trip",
    subtitle: "Build day-by-day itineraries with ease",
    buttonColor: "#FF6B35",
  },
  {
    id: "3",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDt8z-L9htA-5SVOfuMi4WAv3jGhj25IhjX76CqROkkp-y4_THF0GGhUoox7_ns-5eq0N95moSpcW7XvyDu6GiXriyI2Aseln5o34q6tyuzmo239G1vtgcH3RiZKNInXlPdfEVCFNL5nGGoYH3XGjrycXDZAbkb6xEtoeNQaYIFrwyJExy6n_OIRcJQ4sNfZxuRCKmhq8jK929HKk1Z3HSGzmQumUS-O6vMcLVj1EVfrzcQdoOmmhP8I3RR_Xby8sLVQMBm_NjXMmI",
    title: "Let AI Do the Heavy Lifting",
    subtitle: "Get personalized itineraries in seconds",
    buttonColor: "#ff4d6d",
  },
]

function Slide({
  item,
  index,
  scrollX,
  onGetStarted,
  onLogin,
}: {
  item: (typeof slides)[0]
  index: number
  scrollX: SharedValue<number>
  onGetStarted: () => void
  onLogin: () => void
}) {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ]

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          scrollX.value,
          inputRange,
          [SCREEN_WIDTH * PARALLAX_FACTOR, 0, -SCREEN_WIDTH * PARALLAX_FACTOR],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }))

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollX.value, inputRange, [24, 0, -24], Extrapolation.CLAMP),
      },
    ],
  }))

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollX.value, inputRange, [16, 0, -16], Extrapolation.CLAMP),
      },
    ],
  }))

  return (
    <View style={styles.slide}>
      <Animated.Image
        source={{ uri: item.image }}
        style={[styles.backgroundImage, imageStyle]}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
        locations={[0, 0.4, 1]}
        style={styles.overlay}
      />
      <View style={styles.content}>
        <Animated.Text style={[styles.title, titleStyle]}>{item.title}</Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          {item.subtitle}
        </Animated.Text>
        <Button title="Get Started" onPress={onGetStarted} color={item.buttonColor} />
        <TouchableOpacity onPress={onLogin} style={styles.loginLink}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginBold}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function Dot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const dotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ]
    const width = interpolate(scrollX.value, inputRange, [8, 32, 8], Extrapolation.CLAMP)
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP)
    return {
      width,
      opacity,
    }
  })

  return <Animated.View style={[styles.dot, dotStyle]} />
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<any>(null)
  const scrollX = useSharedValue(0)
  const setOnboarded = useUiStore((s) => s.setOnboarded)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
      setCurrentIndex(index)
    },
    [],
  )

  const handleGetStarted = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
    } else {
      setOnboarded(true)
      router.replace("/(auth)/login")
    }
  }, [currentIndex, setOnboarded])

  const handleLogin = useCallback(() => {
    setOnboarded(true)
    router.replace("/(auth)/login")
  }, [setOnboarded])

  const renderSlide = useCallback(
    ({ item, index }: { item: (typeof slides)[0]; index: number }) => (
      <Slide
        item={item}
        index={index}
        scrollX={scrollX}
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    ),
    [scrollX, handleGetStarted, handleLogin],
  )

  return (
    <View style={styles.container}>
      <View style={styles.dotsOverlay}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} />
          ))}
        </View>
      </View>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        bounces={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        getItemLayout={(_, i) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * i,
          index: i,
        })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  backgroundImage: {
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
  dotsOverlay: {
    position: "absolute",
    bottom: 400,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 32,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 48,
    lineHeight: 52,
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 26,
    marginBottom: 40,
  },
  loginLink: {
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  loginBold: {
    fontFamily: "Inter-Bold",
    fontWeight: "700",
  },
})
