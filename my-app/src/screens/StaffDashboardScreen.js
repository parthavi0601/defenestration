// src/screens/StaffDashboardScreen.js - UPDATED WITH DUMMY DATA
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, FlatList, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { getWeekScheduleForStaff, DUMMY_STAFF, DUMMY_ROLES } from '../data/dummyData'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function StaffDashboardScreen({ navigation }) {
  const [swapModalVisible, setSwapModalVisible] = useState(false)
  const [weeklySchedule, setWeeklySchedule] = useState([])
  const [currentStaff, setCurrentStaff] = useState(null)
  const [todaySchedule, setTodaySchedule] = useState(null)

  useEffect(() => {
    loadStaffData()
  }, [])

  const loadStaffData = async () => {
    try {
      // Get current staff data from AsyncStorage
      const staffDataString = await AsyncStorage.getItem('staffData')
      
      if (staffDataString) {
        const staffData = JSON.parse(staffDataString)
        
        // Find full staff details from dummy data
        const fullStaffData = DUMMY_STAFF.find(staff => staff.id === staffData.staff_id)
        
        if (fullStaffData) {
          setCurrentStaff({
            ...staffData,
            full_name: `${fullStaffData.first_name} ${fullStaffData.last_name}`,
            role_name: DUMMY_ROLES.find(role => role.id === fullStaffData.role_id)?.name || 'Staff',
            pay_rate: fullStaffData.pay_rate,
            hire_date: fullStaffData.hire_date
          })
          
          // Load their schedule
          const schedule = getWeekScheduleForStaff(staffData.staff_id)
          setWeeklySchedule(schedule)
          
          // Get today's shift
          const todayShift = schedule.find(s => s.status === "today")
          setTodaySchedule(todayShift)
          
          console.log('📅 Loaded schedule for:', fullStaffData.first_name)
        }
      } else {
        // If no staff logged in, show demo data for Carol (staff_id: 3)
        const demoStaff = DUMMY_STAFF.find(staff => staff.id === 3) // Carol Davis
        setCurrentStaff({
          staff_id: demoStaff.id,
          name: `${demoStaff.first_name} ${demoStaff.last_name}`,
          full_name: `${demoStaff.first_name} ${demoStaff.last_name}`,
          phone: demoStaff.phone,
          role_name: DUMMY_ROLES.find(role => role.id === demoStaff.role_id)?.name || 'Staff',
          pay_rate: demoStaff.pay_rate,
          hire_date: demoStaff.hire_date
        })
        
        // Load demo schedule for Carol
        const schedule = getWeekScheduleForStaff(3)
        setWeeklySchedule(schedule)
        
        const todayShift = schedule.find(s => s.status === "today")
        setTodaySchedule(todayShift)
        
        console.log('📅 Loaded demo schedule for Carol Davis')
      }
    } catch (error) {
      console.error('Error loading staff data:', error)
      Alert.alert("Error", "Failed to load schedule data")
    }
  }

  // Available staff for swapping (other staff members)
  const availableStaff = DUMMY_STAFF
    .filter(staff => staff.id !== currentStaff?.staff_id)
    .slice(0, 3)
    .map(staff => {
      const role = DUMMY_ROLES.find(r => r.id === staff.role_id)
      return {
        id: staff.id,
        name: `${staff.first_name} ${staff.last_name}`,
        shift: "Available for swap",
        role: role?.name || 'Staff'
      }
    })

  const sendSwapRequest = (staffId) => {
    setSwapModalVisible(false)
    const selectedStaff = availableStaff.find(staff => staff.id === staffId)
    Alert.alert(
      "Swap Request Sent! 📤", 
      `Your swap request has been sent to ${selectedStaff.name}. They will receive a notification and can accept or decline the request.`,
      [{ text: "OK" }]
    )
  }

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: async () => {
            await AsyncStorage.multiRemove(['staffToken', 'staffData'])
            navigation.navigate("OwnerLogin")
          }
        }
      ]
    )
  }

  const renderStaffItem = ({ item }) => (
    <View style={styles.staffItem}>
      <View style={styles.staffInfo}>
        <Text style={styles.staffName}>{item.name}</Text>
        <Text style={styles.staffRole}>{item.role}</Text>
        <Text style={styles.staffShift}>{item.shift}</Text>
      </View>
      <TouchableOpacity style={styles.requestButton} onPress={() => sendSwapRequest(item.id)}>
        <Text style={styles.requestButtonText}>Send Request</Text>
      </TouchableOpacity>
    </View>
  )

  if (!currentStaff) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your schedule...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          
          {/* Header with Staff Info */}
          <View style={styles.header}>
            <View style={styles.staffProfile}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {currentStaff.full_name?.charAt(0) || 'S'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.welcomeText}>Welcome back! 👋</Text>
                <Text style={styles.nameText}>{currentStaff.full_name}</Text>
                <Text style={styles.roleText}>{currentStaff.role_name} • Coffee Corner</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Current Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>32</Text>
              <Text style={styles.statLabel}>Hours This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Shifts Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹{currentStaff.pay_rate}</Text>
              <Text style={styles.statLabel}>Hourly Rate</Text>
            </View>
          </View>

          {/* This Week's Schedule */}
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
                          <Text style={styles.statusText}>Today</Text>
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
              <View style={styles.todayActions}>
                <TouchableOpacity style={styles.swapButton} onPress={() => setSwapModalVisible(true)}>
                  <Text style={styles.swapButtonText}>🔄 Request Swap for Today</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clockInButton}>
                  <Text style={styles.clockInButtonText}>⏰ Clock In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionCard} 
                onPress={() => Alert.alert("Leave Request", "Leave request feature coming soon! You'll be able to request time off directly from here.")}
              >
                <Text style={styles.actionIcon}>📅</Text>
                <Text style={styles.actionTitle}>Request Leave</Text>
                <Text style={styles.actionSubtitle}>Apply for time off</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard} 
                onPress={() => Alert.alert("Your Performance", `This month you have:\n\n• 95% attendance rate\n• 4.8/5 customer rating\n• 2 commendations\n• ₹${(currentStaff.pay_rate * 160).toLocaleString()} earned\n\nGreat work! 🌟`)}
              >
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionTitle}>My Performance</Text>
                <Text style={styles.actionSubtitle}>View your stats</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <Text style={styles.activityText}>• ✅ Completed 6-hour shift yesterday</Text>
              <Text style={styles.activityText}>• 🔄 Swap request with Alice approved for Friday</Text>
              <Text style={styles.activityText}>• 📈 Perfect attendance this month</Text>
              <Text style={styles.activityText}>• ⭐ Customer compliment received</Text>
              <Text style={styles.activityText}>• 💰 Paycheck processed for last week</Text>
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
                <Text style={styles.modalTitle}>Available Staff for Swap</Text>
                <TouchableOpacity onPress={() => setSwapModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDescription}>
                Select a colleague to send a shift swap request to:
              </Text>

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  
  // Header with staff profile
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  staffProfile: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  roleText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#374151",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },

  // Stats container
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#10b981",
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 4,
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
  
  scheduleScroll: {
    marginBottom: 16,
  },
  scheduleCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
    borderWidth: 1,
    borderColor: "#374151",
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  scheduleTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  scheduleRole: {
    fontSize: 12,
    color: "#6366f1",
    marginBottom: 4,
    fontWeight: "500",
  },
  scheduleShop: {
    fontSize: 10,
    color: "#9ca3af",
  },
  statusBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#ffffff",
  },
  todayCard: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  offDayCard: {
    backgroundColor: "#374151",
    opacity: 0.7,
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
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 16,
  },

  // Today's actions
  todayActions: {
    flexDirection: "row",
    gap: 12,
  },
  swapButton: {
    flex: 1,
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
  clockInButton: {
    flex: 1,
    backgroundColor: "#10b981",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  clockInButtonText: {
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

  // Modal styles
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
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  modalDescription: {
    fontSize: 14,
    color: "#9ca3af",
    paddingHorizontal: 24,
    marginBottom: 20,
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
    marginBottom: 2,
  },
  staffRole: {
    fontSize: 12,
    color: "#10b981",
    marginBottom: 2,
  },
  staffShift: {
    fontSize: 12,
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
})
