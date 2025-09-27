// src/screens/OwnerDashboardScreen.js - WITH TABULAR VIEW & EXPORT
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, Modal, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import ScheduleGenerator from '../utils/scheduleGenerator'
import ScheduleExporter from '../utils/scheduleExport'
import { DUMMY_STAFF, DUMMY_SHOPS } from '../data/dummyData'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function OwnerDashboardScreen({ navigation }) {
  const [generating, setGenerating] = useState(false)
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false)
  const [generatedSchedule, setGeneratedSchedule] = useState(null)
  const [scheduleSummary, setScheduleSummary] = useState(null)
  const [ownerData, setOwnerData] = useState(null)
  const [exporting, setExporting] = useState({ csv: false, pdf: false })

  useEffect(() => {
    loadOwnerData()
  }, [])

  const loadOwnerData = async () => {
    try {
      const data = await AsyncStorage.getItem('ownerData')
      if (data) {
        setOwnerData(JSON.parse(data))
      }
    } catch (error) {
      console.error('Error loading owner data:', error)
    }
  }

  const handleCreateSchedule = async () => {
    setGenerating(true)
    
    try {
      Alert.alert("🤖 AI Schedule Generator", "Analyzing staff availability, business patterns, and optimizing shifts...", [
        { text: "Continue", onPress: () => generateSchedule() }
      ])
    } catch (error) {
      setGenerating(false)
      Alert.alert("Error", "Failed to generate schedule")
    }
  }

  const generateSchedule = async () => {
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate the schedule
      const schedule = ScheduleGenerator.generateWeeklySchedule(1)
      const summary = ScheduleGenerator.generateScheduleSummary(schedule)
      
      setGeneratedSchedule(schedule)
      setScheduleSummary(summary)
      setScheduleModalVisible(true)
      
      console.log('✅ Schedule generated:', schedule)
    } catch (error) {
      console.error('Schedule generation error:', error)
      Alert.alert("Error", "Failed to generate schedule")
    } finally {
      setGenerating(false)
    }
  }

  const handleExportCSV = async () => {
    setExporting(prev => ({ ...prev, csv: true }))
    
    try {
      const result = await ScheduleExporter.exportToCSV(generatedSchedule, scheduleSummary)
      
      if (result.success) {
        Alert.alert("CSV Export Successful! 📄", "The schedule has been exported as CSV and is ready to share.")
      } else {
        Alert.alert("Export Failed", result.error)
      }
    } catch (error) {
      Alert.alert("Export Error", "Failed to export CSV file")
    } finally {
      setExporting(prev => ({ ...prev, csv: false }))
    }
  }

  const handleExportPDF = async () => {
    setExporting(prev => ({ ...prev, pdf: true }))
    
    try {
      const result = await ScheduleExporter.exportToPDF(generatedSchedule, scheduleSummary)
      
      if (result.success) {
        Alert.alert("PDF Export Successful! 📑", "The professional schedule PDF has been generated and is ready to share.")
      } else {
        Alert.alert("Export Failed", result.error)
      }
    } catch (error) {
      Alert.alert("Export Error", "Failed to export PDF file")
    } finally {
      setExporting(prev => ({ ...prev, pdf: false }))
    }
  }

  const saveSchedule = async () => {
    try {
      await AsyncStorage.setItem('currentSchedule', JSON.stringify(generatedSchedule))
      
      setScheduleModalVisible(false)
      Alert.alert(
        "Schedule Saved! 🎉", 
        "The AI-generated schedule has been saved and staff will be notified. They can now view their shifts and request changes if needed.",
        [{ text: "Great!" }]
      )
    } catch (error) {
      Alert.alert("Error", "Failed to save schedule")
    }
  }

  const renderScheduleSummary = () => {
    if (!scheduleSummary) return null

    return (
      <View style={styles.schedulePreview}>
        <Text style={styles.previewTitle}>📊 Schedule Summary</Text>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{scheduleSummary.total_shifts}</Text>
            <Text style={styles.summaryLabel}>Total Shifts</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{scheduleSummary.total_hours}h</Text>
            <Text style={styles.summaryLabel}>Total Hours</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>₹{Math.round(scheduleSummary.estimated_labor_cost)}</Text>
            <Text style={styles.summaryLabel}>Labor Cost</Text>
          </View>
        </View>

        <Text style={styles.staffDistributionTitle}>👥 Staff Assignments:</Text>
        {Object.entries(scheduleSummary.staff_distribution).map(([name, hours]) => (
          <Text key={name} style={styles.staffDistributionItem}>
            • {name}: {hours}h
          </Text>
        ))}
      </View>
    )
  }

  const renderScheduleTable = () => {
    if (!generatedSchedule) return null

    const tableData = ScheduleExporter.generateTableData(generatedSchedule)

    return (
      <View style={styles.scheduleTable}>
        <Text style={styles.tableTitle}>📅 Weekly Schedule Table</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.dayColumn]}>Day</Text>
              <Text style={[styles.tableHeader, styles.staffColumn]}>Staff</Text>
              <Text style={[styles.tableHeader, styles.roleColumn]}>Role</Text>
              <Text style={[styles.tableHeader, styles.timeColumn]}>Time</Text>
              <Text style={[styles.tableHeader, styles.hoursColumn]}>Hours</Text>
            </View>
            
            {/* Table Rows */}
            {tableData.map((row, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}>
                <Text style={[styles.tableCell, styles.dayColumn]}>{row.day}</Text>
                <Text style={[styles.tableCell, styles.staffColumn]}>{row.staff}</Text>
                <Text style={[styles.tableCell, styles.roleColumn]}>{row.role}</Text>
                <Text style={[styles.tableCell, styles.timeColumn]}>{row.time}</Text>
                <Text style={[styles.tableCell, styles.hoursColumn]}>{row.hours}h</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>☕ Owner Dashboard</Text>
            <Text style={styles.subtitle}>
              {ownerData ? `Welcome back, ${ownerData.first_name}!` : 'Manage your Coffee Corner business'}
            </Text>
          </View>

          {/* AI Schedule Generation */}
          <TouchableOpacity 
            style={[styles.primaryButton, generating && styles.primaryButtonDisabled]} 
            onPress={handleCreateSchedule}
            activeOpacity={0.8}
            disabled={generating}
          >
            {generating ? (
              <View style={styles.buttonLoading}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.primaryButtonText}>🤖 AI Generating Schedule...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>🤖 Generate AI Schedule</Text>
            )}
          </TouchableOpacity>

          {/* Dashboard Cards */}
          <View style={styles.cardGrid}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => Alert.alert("Shop Insights", "View detailed analytics:\n\n📈 Sales: ₹45,230 this week\n👥 Customer satisfaction: 4.7/5\n⏰ Peak hours: 8-10 AM, 2-4 PM\n🔥 Best seller: Cappuccino")}
            >
              <Text style={styles.cardIcon}>📊</Text>
              <Text style={styles.cardTitle}>Shop Insights</Text>
              <Text style={styles.cardSubtitle}>View performance metrics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => Alert.alert("Leave Requests", "Pending requests:\n\n📅 Alice Johnson: Dec 25-26 (Christmas)\n📅 Bob Wilson: Jan 2 (Personal)\n\nTap to approve or deny requests.")}
            >
              <Text style={styles.cardIcon}>✅</Text>
              <Text style={styles.cardTitle}>Approve/Deny Leave</Text>
              <Text style={styles.cardSubtitle}>Manage staff requests</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{DUMMY_SHOPS.length}</Text>
                <Text style={styles.statLabel}>Active Shops</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{DUMMY_STAFF.filter(s => s.is_active).length}</Text>
                <Text style={styles.statLabel}>Total Staff</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Pending Requests</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Enhanced Schedule Modal with Table & Export */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={scheduleModalVisible}
          onRequestClose={() => setScheduleModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🤖 AI Generated Schedule</Text>
                <TouchableOpacity 
                  onPress={() => setScheduleModalVisible(false)} 
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                {renderScheduleSummary()}
                {renderScheduleTable()}
                
                <View style={styles.aiInsights}>
                  <Text style={styles.aiTitle}>🧠 AI Insights:</Text>
                  <Text style={styles.aiText}>• Optimized for peak hours coverage</Text>
                  <Text style={styles.aiText}>• Balanced workload across all staff</Text>
                  <Text style={styles.aiText}>• Considered staff preferences & availability</Text>
                  <Text style={styles.aiText}>• Minimized overtime costs</Text>
                  <Text style={styles.aiText}>• Ensured adequate coverage for busy periods</Text>
                </View>
              </ScrollView>

              {/* Enhanced Actions with Export Options */}
              <View style={styles.modalActions}>
                <View style={styles.exportButtons}>
                  <TouchableOpacity 
                    style={[styles.exportButton, exporting.csv && styles.exportButtonDisabled]}
                    onPress={handleExportCSV}
                    disabled={exporting.csv}
                  >
                    {exporting.csv ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.exportButtonText}>📄 Export CSV</Text>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.exportButton, exporting.pdf && styles.exportButtonDisabled]}
                    onPress={handleExportPDF}
                    disabled={exporting.pdf}
                  >
                    {exporting.pdf ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.exportButtonText}>📑 Export PDF</Text>
                    )}
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.saveButton} onPress={saveSchedule}>
                  <Text style={styles.saveButtonText}>💾 Save & Notify Staff</Text>
                </TouchableOpacity>
              </View>
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
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    lineHeight: 24,
  },
  
  // Primary button
  primaryButton: {
    backgroundColor: "#10b981",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 32,
  },
  primaryButtonDisabled: {
    backgroundColor: "#065f46",
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  buttonLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cardGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  card: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 16,
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
  
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6366f1",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#1f2937",
    borderRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  modalTitle: {
    fontSize: 20,
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
  modalScroll: {
    padding: 24,
    maxHeight: 400,
  },

  // Schedule preview
  schedulePreview: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  staffDistributionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  staffDistributionItem: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 6,
  },

  // Table styles
  scheduleTable: {
    marginBottom: 24,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6366f1",
    marginBottom: 16,
  },
  table: {
    minWidth: 600,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  evenRow: {
    backgroundColor: "#111827",
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#374151",
  },
  tableCell: {
    fontSize: 12,
    color: "#e5e7eb",
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#374151",
  },
  dayColumn: {
    width: 100,
  },
  staffColumn: {
    width: 120,
  },
  roleColumn: {
    width: 100,
  },
  timeColumn: {
    width: 140,
  },
  hoursColumn: {
    width: 60,
  },

  // AI insights
  aiInsights: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 12,
  },
  aiText: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 6,
  },

  // Modal actions
  modalActions: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    gap: 12,
  },
  exportButtons: {
    flexDirection: "row",
    gap: 12,
  },
  exportButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  exportButtonDisabled: {
    backgroundColor: "#4338ca",
    opacity: 0.6,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
})
