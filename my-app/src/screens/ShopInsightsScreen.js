import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function ShopInsightsScreen({ navigation }) {
  const shopData = [
    { name: "Main Store", revenue: "$12,450", staff: 5, efficiency: "92%" },
    { name: "Downtown Branch", revenue: "$8,320", staff: 3, efficiency: "87%" },
    { name: "Mall Location", revenue: "$15,680", staff: 4, efficiency: "95%" },
  ]

  const weeklyStats = [
    { day: "Mon", hours: 45, revenue: 1200 },
    { day: "Tue", hours: 42, revenue: 1100 },
    { day: "Wed", hours: 48, revenue: 1350 },
    { day: "Thu", hours: 44, revenue: 1250 },
    { day: "Fri", hours: 52, revenue: 1500 },
    { day: "Sat", hours: 56, revenue: 1800 },
    { day: "Sun", hours: 38, revenue: 950 },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Shop Insights</Text>
            <Text style={styles.subtitle}>Performance metrics and analytics</Text>
          </View>

          {/* Overview Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.overviewGrid}>
              <View style={styles.overviewCard}>
                <Text style={styles.overviewNumber}>$36,450</Text>
                <Text style={styles.overviewLabel}>Total Revenue</Text>
                <Text style={styles.overviewChange}>+12.5%</Text>
              </View>
              <View style={styles.overviewCard}>
                <Text style={styles.overviewNumber}>324</Text>
                <Text style={styles.overviewLabel}>Total Hours</Text>
                <Text style={styles.overviewChange}>+8.2%</Text>
              </View>
            </View>
          </View>

          {/* Shop Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shop Performance</Text>
            {shopData.map((shop, index) => (
              <View key={index} style={styles.shopCard}>
                <View style={styles.shopHeader}>
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <Text style={styles.shopRevenue}>{shop.revenue}</Text>
                </View>
                <View style={styles.shopStats}>
                  <View style={styles.shopStat}>
                    <Text style={styles.shopStatLabel}>Staff</Text>
                    <Text style={styles.shopStatValue}>{shop.staff}</Text>
                  </View>
                  <View style={styles.shopStat}>
                    <Text style={styles.shopStatLabel}>Efficiency</Text>
                    <Text style={styles.shopStatValue}>{shop.efficiency}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Weekly Trends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Trends</Text>
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Hours vs Revenue</Text>
              </View>
              <View style={styles.chart}>
                {weeklyStats.map((day, index) => (
                  <View key={index} style={styles.chartBar}>
                    <View style={[styles.bar, { height: (day.hours / 60) * 100 }]} />
                    <Text style={styles.chartLabel}>{day.day}</Text>
                    <Text style={styles.chartValue}>{day.hours}h</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Text style={styles.actionButtonText}>Export Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} activeOpacity={0.8}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Schedule Analysis</Text>
            </TouchableOpacity>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: "row",
    gap: 16,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6366f1",
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 4,
  },
  overviewChange: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  shopCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  shopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  shopRevenue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366f1",
  },
  shopStats: {
    flexDirection: "row",
    gap: 24,
  },
  shopStat: {
    alignItems: "center",
  },
  shopStatLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  shopStatValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  chartContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: "#6366f1",
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 10,
    color: "#6b7280",
  },
  actionSection: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6366f1",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  secondaryButtonText: {
    color: "#6366f1",
  },
})
