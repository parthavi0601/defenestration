"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, FlatList } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function StaffDashboardScreen({ navigation }) {
  const [swapModalVisible, setSwapModalVisible] = useState(false)

  const weeklySchedule = [
    {
      date: "2024-01-15",
      day: "Mon",
      shift: "8:00 AM - 2:00 PM",
      role: "Cashier",
      shop: "Main Store",
      status: "upcoming",
    },
    {
      date: "2024-01-16",
      day: "Tue",
      shift: "2:00 PM - 10:00 PM",
      role: "Sales Associate",
      shop: "Main Store",
      status: "today",
    },
    {
      date: "2024-01-17",
      day: "Wed",
      shift: "8:00 AM - 2:00 PM",
      role: "Cashier",
      shop: "Main Store",
      status: "upcoming",
    },
    { date: "2024-01-18", day: "Thu", shift: "Off", role: "", shop: "", status: "off" },
    {
      date: "2024-01-19",
      day: "Fri",
      shift: "8:00 AM - 2:00 PM",
      role: "Cashier",
      shop: "Main Store",
      status: "upcoming",
    },
    {
      date: "2024-01-20",
      day: "Sat",
      shift: "2:00 PM - 10:00 PM",
      role: "Sales Associate",
      shop: "Main Store",
      status: "upcoming",
    },
    { date: "2024-01-21", day: "Sun", shift: "Off", role: "", shop: "", status: "off" },
  ]

  const todaySchedule = weeklySchedule.find((schedule) => schedule.status === "today")

  const availableStaff = [
    { id: 1, name: "John Doe", shift: "2:00 PM - 10:00 PM" },
    { id: 2, name: "Jane Smith", shift: "8:00 AM - 2:00 PM" },
    { id: 3, name: "Mike Johnson", shift: "Off Today" },
  ]

  const sendSwapRequest = (staffId) => {
    setSwapModalVisible(false)
    // Handle swap request logic here
    alert("Swap request sent successfully!")
  }

  const renderStaffItem = ({ item }) => (
    <View style={styles.staffItem}>
      <View style={styles.staffInfo}>
        <Text style={styles.staffName}>{item.name}</Text>
        <Text style={styles.staffShift}>{item.shift}</Text>
      </View>
      <TouchableOpacity style={styles.requestButton} onPress={() => sendSwapRequest(item.id)}>
        <Text style={styles.requestButtonText}>Send Request</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week's Schedule</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scheduleScroll}>
              {weeklySchedule.map((schedule, index) => (
                <View
                  key={index}
                  style={[
                    styles.scheduleCard,
                    schedule.status === "today" && styles.todayCard,
                    schedule.status === "off" && styles.offDayCard,
                  ]}
                >
                  <View style={styles.scheduleHeader}>
                    <Text style={[styles.dayText, schedule.status === "today" && styles.todayText]}>
                      {schedule.day}
                    </Text>
                    <Text style={[styles.dateText, schedule.status === "today" && styles.todayText]}>
                      {schedule.date.split("-")[2]}
                    </Text>
                  </View>

                  {schedule.status !== "off" ? (
                    <>
                      <Text style={[styles.scheduleTime, schedule.status === "today" && styles.todayText]}>
                        {schedule.shift}
                      </Text>
                      <Text style={[styles.scheduleRole, schedule.status === "today" && styles.todayAccent]}>
                        {schedule.role}
                      </Text>
                      <Text style={[styles.scheduleShop, schedule.status === "today" && styles.todayMuted]}>
                        {schedule.shop}
                      </Text>
                      {schedule.status === "today" && (
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>Active</Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <Text style={styles.offDayText}>Day Off</Text>
                  )}
                </View>
              ))}
            </ScrollView>

            {/* Today's shift actions */}
            {todaySchedule && todaySchedule.status === "today" && (
              <TouchableOpacity style={styles.swapButton} onPress={() => setSwapModalVisible(true)}>
                <Text style={styles.swapButtonText}>Request Swap for Today</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("RequestLeave")}>
                <Text style={styles.actionIcon}>📅</Text>
                <Text style={styles.actionTitle}>Request Leave</Text>
                <Text style={styles.actionSubtitle}>Apply for time off</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate("StaffInsights")}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionTitle}>Staff Insights</Text>
                <Text style={styles.actionSubtitle}>View your stats</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <Text style={styles.activityText}>• Completed 6-hour shift yesterday</Text>
              <Text style={styles.activityText}>• Swap request approved for Friday</Text>
              <Text style={styles.activityText}>• Leave request pending approval</Text>
            </View>
          </View>
        </ScrollView>

        {/* Swap Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={swapModalVisible}
          onRequestClose={() => setSwapModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Available Staff</Text>
                <TouchableOpacity onPress={() => setSwapModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={availableStaff}
                renderItem={renderStaffItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.staffList}
              />
            </View>
          </View>
        </Modal>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  scheduleCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  scheduleTime: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  statusBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ffffff",
  },
  scheduleRole: {
    fontSize: 16,
    color: "#6366f1",
    marginBottom: 4,
  },
  scheduleShop: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 16,
  },
  swapButton: {
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  swapButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  actionGrid: {
    flexDirection: "row",
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
  activityCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  activityText: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1f2937",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#ffffff",
  },
  staffList: {
    paddingHorizontal: 24,
  },
  staffItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 4,
  },
  staffShift: {
    fontSize: 14,
    color: "#9ca3af",
  },
  requestButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  requestButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  scheduleScroll: {
    marginBottom: 16,
  },
  todayCard: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  offDayCard: {
    backgroundColor: "#374151",
    opacity: 0.7,
  },
  dayText: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "700",
  },
  todayText: {
    color: "#ffffff",
  },
  todayAccent: {
    color: "#e0e7ff",
  },
  todayMuted: {
    color: "#c7d2fe",
  },
  offDayText: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 20,
  },
})
