import { Tabs, router } from "expo-router"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{
        tabBarActiveTintColor: "#0D7CFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter-Medium",
        },
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🔍</Text>,
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: "Saved",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>❤️</Text>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
          }}
        />
      </Tabs>

      <TouchableOpacity
        style={styles.aiFab}
        onPress={() => router.navigate("/ai-planner")}
        activeOpacity={0.8}
      >
        <Text style={styles.aiFabIcon}>🤖</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  aiFab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0D7CFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0D7CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  aiFabIcon: {
    fontSize: 24,
  },
})
