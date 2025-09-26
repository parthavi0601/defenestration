"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function RequestLeaveScreen({ navigation }) {
  const [selectedDates, setSelectedDates] = useState([])
  const [reason, setReason] = useState("")
  const [leaveType, setLeaveType] = useState("sick")

  // Mock upcoming dates for selection
  const upcomingDates = [
    { date: "2024-01-15", day: "Mon", shifts: ["8:00 AM - 2:00 PM"] },
    { date: "2024-01-16", day: "Tue", shifts: ["2:00 PM - 10:00 PM"] },
    { date: "2024-01-17", day: "Wed", shifts: ["8:00 AM - 2:00 PM"] },
    { date: "2024-01-18", day: "Thu", shifts: ["Off"] },
    { date: "2024-01-19", day: "Fri", shifts: ["8:00 AM - 2:00 PM"] },
    { date: "2024-01-20", day: "Sat", shifts: ["2:00 PM - 10:00 PM"] },
    { date: "2024-01-21", day: "Sun", shifts: ["Off"] },
  ]

  const leaveTypes = [
    { id: "sick", label: "Sick Leave", icon: "🤒" },
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "vacation", label: "Vacation", icon: "🏖️" },
    { id: "emergency", label: "Emergency", icon: "🚨" },
  ]

  const toggleDateSelection = (date) => {
    setSelectedDates((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]))
  }

  const submitLeaveRequest = () => {
    if (selectedDates.length === 0) {
      Alert.alert("Error", "Please select at least one date")
      return
    }
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason for your leave request")
      return
    }

    // Handle leave request submission
    Alert.alert("Success", "Your leave request has been submitted and is pending approval", [
      { text: "OK", onPress: () => navigation.goBack() },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Request Leave</Text>
          </View>

          {/* Leave Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leave Type</Text>
            <View style={styles.leaveTypeGrid}>
              {leaveTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.leaveTypeCard, leaveType === type.id && styles.selectedLeaveType]}
                  onPress={() => setLeaveType(type.id)}
                >
                  <Text style={styles.leaveTypeIcon}>{type.icon}</Text>
                  <Text style={[styles.leaveTypeLabel, leaveType === type.id && styles.selectedLeaveTypeText]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Dates</Text>
            <Text style={styles.sectionSubtitle}>Choose the dates you need off</Text>
            <View style={styles.datesContainer}>
              {upcomingDates.map((item) => (
                <TouchableOpacity
                  key={item.date}
                  style={[
                    styles.dateCard,
                    selectedDates.includes(item.date) && styles.selectedDate,
                    item.shifts[0] === "Off" && styles.offDayCard,
                  ]}
                  onPress={() => item.shifts[0] !== "Off" && toggleDateSelection(item.date)}
                  disabled={item.shifts[0] === "Off"}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDates.includes(item.date) && styles.selectedDateText,
                      item.shifts[0] === "Off" && styles.offDayText,
                    ]}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      selectedDates.includes(item.date) && styles.selectedDateText,
                      item.shifts[0] === "Off" && styles.offDayText,
                    ]}
                  >
                    {item.date.split("-")[2]}
                  </Text>
                  <Text
                    style={[
                      styles.shiftText,
                      selectedDates.includes(item.date) && styles.selectedDateText,
                      item.shifts[0] === "Off" && styles.offDayText,
                    ]}
                  >
                    {item.shifts[0] === "Off" ? "Off" : item.shifts[0].split(" - ")[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reason Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reason</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Please provide a reason for your leave request..."
              placeholderTextColor="#9ca3af"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Summary */}
          {selectedDates.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryText}>
                  Requesting {selectedDates.length} day{selectedDates.length > 1 ? "s" : ""} off
                </Text>
                <Text style={styles.summaryText}>Type: {leaveTypes.find((t) => t.id === leaveType)?.label}</Text>
                <Text style={styles.summaryDates}>Dates: {selectedDates.join(", ")}</Text>
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={submitLeaveRequest}>
            <Text style={styles.submitButtonText}>Submit Leave Request</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#6366f1",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 16,
  },
  leaveTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  leaveTypeCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
    minWidth: "45%",
  },
  selectedLeaveType: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  leaveTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  leaveTypeLabel: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  selectedLeaveTypeText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  datesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  dateCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
    minWidth: 80,
  },
  selectedDate: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  offDayCard: {
    backgroundColor: "#374151",
    opacity: 0.5,
  },
  dayText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  shiftText: {
    fontSize: 10,
    color: "#9ca3af",
  },
  selectedDateText: {
    color: "#ffffff",
  },
  offDayText: {
    color: "#6b7280",
  },
  reasonInput: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#374151",
    minHeight: 100,
  },
  summaryCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  summaryText: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 8,
  },
  summaryDates: {
    fontSize: 14,
    color: "#9ca3af",
  },
  submitButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
})
