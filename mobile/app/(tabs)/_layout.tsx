import { Tabs } from "expo-router"
import { Text } from "react-native"

export default function TabLayout() {
  return (
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
  )
}
