"use client"

import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"

export default function LeaveRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([
    {
      id: 1,
      staffName: "John Smith",
      shop: "Main Store",
      leaveType: "Sick Leave",
      dates: "Dec 15 - Dec 16",
      reason: "Flu symptoms, need to recover",
      status: "pending",
      requestDate: "Dec 12, 2024",
    },
    {
      id: 2,
      staffName: "Sarah Johnson",
      shop: "Downtown Branch",
      leaveType: "Personal Leave",
      dates: "Dec 20 - Dec 22",
      reason: "Family wedding out of town",
      status: "pending",
      requestDate: "Dec 10, 2024",
    },
    {
      id: 3,
      staffName: "Mike Wilson",
      shop: "Mall Location",
      leaveType: "Vacation",
      dates: "Dec 25 - Dec 30",
      reason: "Holiday vacation with family",
      status: "pending",
      requestDate: "Dec 8, 2024",
    },
    {
      id: 4,
      staffName: "Emma Davis",
      shop: "Main Store",
      leaveType: "Emergency Leave",
      dates: "Dec 18",
      reason: "Medical emergency in family",
      status: "approved",
      requestDate: "Dec 11, 2024",
    },
  ])

  const handleApprove = (requestId) => {
    Alert.alert("Approve Leave Request", "Are you sure you want to approve this leave request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "approved" } : req)))
        },
      },
    ])
  }

  const handleReject = (requestId) => {
    Alert.alert("Reject Leave Request", "Are you sure you want to reject this leave request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" } : req)))
        },
      },
    ])
  }

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const processedRequests = requests.filter((req) => req.status !== "pending")

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#10b981"
      case "rejected":
        return "#ef4444"
      default:
        return "#f59e0b"
    }
  }

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Sick Leave":
        return "#ef4444"
      case "Vacation":
        return "#10b981"
      case "Personal Leave":
        return "#6366f1"
      case "Emergency Leave":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Leave Requests</Text>
            <Text style={styles.subtitle}>Manage staff leave applications</Text>
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{pendingRequests.length}</Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{requests.filter((r) => r.status === "approved").length}</Text>
              <Text style={styles.summaryLabel}>Approved</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{requests.filter((r) => r.status === "rejected").length}</Text>
              <Text style={styles.summaryLabel}>Rejected</Text>
            </View>
          </View>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pending Requests</Text>
              {pendingRequests.map((request) => (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <View>
                      <Text style={styles.staffName}>{request.staffName}</Text>
                      <Text style={styles.shopName}>{request.shop}</Text>
                    </View>
                    <View
                      style={[styles.leaveTypeBadge, { backgroundColor: getLeaveTypeColor(request.leaveType) + "20" }]}
                    >
                      <Text style={[styles.leaveTypeText, { color: getLeaveTypeColor(request.leaveType) }]}>
                        {request.leaveType}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.requestDetails}>
                    <Text style={styles.detailLabel}>Dates:</Text>
                    <Text style={styles.detailValue}>{request.dates}</Text>
                  </View>

                  <View style={styles.requestDetails}>
                    <Text style={styles.detailLabel}>Reason:</Text>
                    <Text style={styles.detailValue}>{request.reason}</Text>
                  </View>

                  <View style={styles.requestDetails}>
                    <Text style={styles.detailLabel}>Requested:</Text>
                    <Text style={styles.detailValue}>{request.requestDate}</Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleApprove(request.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleReject(request.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Decisions</Text>
              {processedRequests.map((request) => (
                <View key={request.id} style={[styles.requestCard, styles.processedCard]}>
                  <View style={styles.requestHeader}>
                    <View>
                      <Text style={styles.staffName}>{request.staffName}</Text>
                      <Text style={styles.shopName}>{request.shop}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + "20" }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.requestDetails}>
                    <Text style={styles.detailLabel}>Dates:</Text>
                    <Text style={styles.detailValue}>{request.dates}</Text>
                  </View>

                  <View style={styles.requestDetails}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>{request.leaveType}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6366f1",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9ca3af",
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
  requestCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  processedCard: {
    opacity: 0.8,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  staffName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    color: "#9ca3af",
  },
  leaveTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  leaveTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  requestDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#9ca3af",
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: "#ffffff",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#10b981",
  },
  rejectButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },
})
