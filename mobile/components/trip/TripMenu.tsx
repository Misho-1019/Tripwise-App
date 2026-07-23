import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, Share, Alert, TextInput } from "react-native"
import { useDeleteTrip, useUpdateTrip } from "../../hooks/useTrips"
import { router } from "expo-router"

const tokens = {
  primary: "#0D7CFF",
  surface: "#FFFFFF",
  surfaceContainer: "#EDEDF6",
  surfaceContainerHigh: "#E7E8F1",
  surfaceContainerLowest: "#FFFFFF",
  text: "#2F323A",
  textSecondary: "#5C5F68",
  outlineVariant: "#AFB1BC",
  error: "#FF3B30",
  fontHeadline: "PlusJakartaSans-Bold",
  fontBody: "Inter-Regular",
  fontBodyMedium: "Inter-Medium",
  fontBodyBold: "Inter-Bold",
}

interface TripMenuProps {
  visible: boolean
  onClose: () => void
  tripId: string
  tripName: string
  tripBudget?: number
  destinationName?: string
  dateRange?: string
  onUpdate: () => void
}

export function TripMenu({ visible, onClose, tripId, tripName, tripBudget, destinationName, dateRange, onUpdate }: TripMenuProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState(tripName)
  const [editBudget, setEditBudget] = useState(tripBudget?.toString() || "")

  const deleteTrip = useDeleteTrip()
  const updateTrip = useUpdateTrip()

  const handleShare = async () => {
    onClose()
    try {
      const lines = [`✈️ Trip to ${destinationName || tripName}`]
      if (dateRange) lines.push(`📅 ${dateRange}`)
      if (tripBudget) lines.push(`💰 Budget: $${tripBudget}`)
      lines.push("")
      lines.push("Plan your own trips with TripWise!")
      await Share.share({ message: lines.join("\n") })
    } catch {
      Alert.alert("Share", "Unable to open share sheet on this device.")
    }
  }

  const handleDelete = () => {
    onClose()
    Alert.alert("Delete Trip", "Are you sure you want to delete this trip? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTrip.mutate(tripId, {
            onSuccess: () => {
              router.back()
            },
          })
        },
      },
    ])
  }

  const handleSaveEdit = () => {
    if (!editName.trim()) return
    updateTrip.mutate(
      {
        tripId,
        data: {
          name: editName.trim(),
          budget: editBudget ? Number(editBudget) : undefined,
        },
      },
      {
        onSuccess: () => {
          setShowEdit(false)
          onClose()
          onUpdate()
        },
      },
    )
  }

  return (
    <>
      <Modal visible={visible && !showEdit} transparent animationType="slide" onRequestClose={onClose}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <View />
        </TouchableOpacity>
        <View style={styles.sheet}>
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={() => { setEditName(tripName); setEditBudget(tripBudget?.toString() || ""); setShowEdit(true) }} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={styles.menuLabel}>Edit Trip</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleShare} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>📤</Text>
            <Text style={styles.menuLabel}>Share Trip</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleDelete} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>🗑️</Text>
            <Text style={[styles.menuLabel, { color: tokens.error }]}>Delete Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showEdit} transparent animationType="slide" onRequestClose={() => setShowEdit(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowEdit(false)}>
          <View />
        </TouchableOpacity>
        <View style={styles.sheet}>
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.editTitle}>Edit Trip</Text>

          <View style={styles.editForm}>
            <Text style={styles.fieldLabel}>TRIP NAME</Text>
            <TextInput
              style={styles.fieldInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Trip name"
              placeholderTextColor={tokens.outlineVariant}
            />

            <Text style={styles.fieldLabel}>BUDGET (OPTIONAL)</Text>
            <TextInput
              style={styles.fieldInput}
              value={editBudget}
              onChangeText={setEditBudget}
              placeholder="0"
              placeholderTextColor={tokens.outlineVariant}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, (!editName.trim() || updateTrip.isPending) && { opacity: 0.5 }]}
            onPress={handleSaveEdit}
            disabled={!editName.trim() || updateTrip.isPending}
            activeOpacity={0.8}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEdit(false)} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: tokens.surfaceContainerLowest,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  handleRow: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.outlineVariant,
    opacity: 0.4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  menuIcon: {
    fontSize: 22,
    width: 32,
  },
  menuLabel: {
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: tokens.text,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.outlineVariant,
    opacity: 0.2,
  },
  cancelButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 9999,
    backgroundColor: tokens.surfaceContainer,
    alignItems: "center",
  },
  cancelText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 16,
    color: tokens.textSecondary,
  },
  editTitle: {
    fontFamily: tokens.fontHeadline,
    fontSize: 20,
    fontWeight: "700",
    color: tokens.text,
    marginBottom: 24,
  },
  editForm: {
    gap: 16,
    marginBottom: 24,
  },
  fieldLabel: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 11,
    color: tokens.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: tokens.surfaceContainer,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: tokens.fontBodyMedium,
    fontSize: 16,
    color: tokens.text,
  },
  saveButton: {
    backgroundColor: tokens.primary,
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
  },
  saveText: {
    fontFamily: tokens.fontBodyBold,
    fontSize: 16,
    color: "#fff",
  },
})
