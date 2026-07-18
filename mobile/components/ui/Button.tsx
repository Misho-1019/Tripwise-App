import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface ButtonProps {
  title: string
  onPress?: () => void
  color?: string
  disabled?: boolean
}

export function Button({ title, onPress, color = "#0D7CFF", disabled }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    fontWeight: "600",
  },
})
