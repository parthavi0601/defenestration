import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function OwnerDashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Owner Dashboard</Text>
            <Text style={styles.subtitle}>Manage your business operations</Text>
          </View>

          {/* Create Schedule Button */}
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Create Schedule</Text>
          </TouchableOpacity>

          {/* Dashboard Cards */}
          <View style={styles.cardGrid}>
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ShopInsights")}
            >
              <Text style={styles.cardIcon}>📊</Text>
              <Text style={styles.cardTitle}>Shop Insights</Text>
              <Text style={styles.cardSubtitle}>View performance metrics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("LeaveRequests")}
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
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Active Shops</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Total Staff</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Pending Requests</Text>
              </View>
            </View>
          </View>
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
  primaryButton: {
    backgroundColor: "#6366f1",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 32,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
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
})
