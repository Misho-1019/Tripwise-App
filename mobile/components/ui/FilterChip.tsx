import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

const tokens = {
  primary: "#0D7CFF",
  surface: "#FFFFFF",
  text: "#1A1C1C",
  textSecondary: "#717786",
  surfaceVariant: "#E2E2E2",
  outlineVariant: "#C1C6D7",
  fontBody: "PlusJakartaSans-Bold",
}

interface FilterChipProps {
  label: string
  isActive?: boolean
  onPress?: () => void
}

export function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
      <Text style={[styles.arrow, isActive && styles.arrowActive]}>▼</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: tokens.surface,
    borderWidth: 1,
    borderColor: tokens.outlineVariant,
  },
  chipActive: {
    backgroundColor: tokens.primary,
    borderColor: tokens.primary,
  },
  label: {
    fontFamily: tokens.fontBody,
    fontSize: 14,
    fontWeight: "600",
    color: tokens.textSecondary,
  },
  labelActive: {
    color: "#fff",
  },
  arrow: {
    fontSize: 16,
    color: tokens.textSecondary,
  },
  arrowActive: {
    color: "#fff",
  },
})
