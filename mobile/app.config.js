const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""

export default {
  expo: {
    name: "TripWise",
    slug: "tripwise",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "tripwise",
    splash: {
      backgroundColor: "#0D7CFF",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tripwise.app",
      config: {
        googleMapsApiKey: mapsKey,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "TripWise needs your location to show nearby destinations.",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      package: "com.tripwise.app",
      config: {
        googleMaps: {
          apiKey: mapsKey,
        },
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow TripWise to use your location.",
          locationWhenInUsePermission: "Allow TripWise to use your location.",
        },
      ],
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        build: {
          preview: {
            android: {
              buildType: "apk",
            },
          },
        },
        projectId: "e881096e-5045-45b8-ba7c-a1b82b122fdd",
      },
      router: {},
    },
  },
}
