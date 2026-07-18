import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

const tokens = {
  primary: "#0D7CFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  surface: "#FFFFFF",
  fontBodyMedium: "Inter-Medium",
}

interface CategoryPillProps {
  label: string
  isActive?: boolean
  onPress?: () => void
}

export function CategoryPill({ label, isActive, onPress }: CategoryPillProps) {
  return (
    <TouchableOpacity
      style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  pillActive: {
    backgroundColor: tokens.primary,
  },
  pillInactive: {
    borderWidth: 1,
    borderColor: "#AFB1BC",
  },
  label: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 14,
  },
  labelActive: {
    color: "#fff",
  },
  labelInactive: {
    color: tokens.textSecondary,
  },
})
