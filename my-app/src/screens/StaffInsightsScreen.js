import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function StaffInsightsScreen() {
  // Mock data
  const earnings = {
    thisWeek: 320,
    thisMonth: 1280,
    total: 5640,
  }

  const stats = {
    hoursWorked: 156,
    shiftsCompleted: 24,
    averageRating: 4.8,
  }

  const leaderboard = [
    { name: "Sarah Johnson", earnings: 1450, rank: 1 },
    { name: "Mike Chen", earnings: 1380, rank: 2 },
    { name: "You", earnings: 1280, rank: 3 },
    { name: "Alex Smith", earnings: 1150, rank: 4 },
    { name: "Emma Davis", earnings: 980, rank: 5 },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          {/* Earnings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earnings</Text>
            <View style={styles.earningsGrid}>
              <View style={styles.earningsCard}>
                <Text style={styles.earningsAmount}>${earnings.thisWeek}</Text>
                <Text style={styles.earningsLabel}>This Week</Text>
              </View>
              <View style={styles.earningsCard}>
                <Text style={styles.earningsAmount}>${earnings.thisMonth}</Text>
                <Text style={styles.earningsLabel}>This Month</Text>
              </View>
              <View style={styles.earningsCard}>
                <Text style={styles.earningsAmount}>${earnings.total}</Text>
                <Text style={styles.earningsLabel}>Total Earned</Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Hours Worked</Text>
                <Text style={styles.statValue}>{stats.hoursWorked}h</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Shifts Completed</Text>
                <Text style={styles.statValue}>{stats.shiftsCompleted}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Average Rating</Text>
                <Text style={styles.statValue}>{stats.averageRating}/5.0</Text>
              </View>
            </View>
          </View>

          {/* Leaderboard Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <View style={styles.leaderboardCard}>
              {leaderboard.map((person, index) => (
                <View key={index} style={[styles.leaderboardRow, person.name === "You" && styles.currentUserRow]}>
                  <View style={styles.rankContainer}>
                    <Text style={[styles.rank, person.name === "You" && styles.currentUserText]}>#{person.rank}</Text>
                  </View>
                  <Text style={[styles.leaderboardName, person.name === "You" && styles.currentUserText]}>
                    {person.name}
                  </Text>
                  <Text style={[styles.leaderboardEarnings, person.name === "You" && styles.currentUserText]}>
                    ${person.earnings}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Performance Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Insights</Text>
            <View style={styles.insightsCard}>
              <Text style={styles.insightText}>🎉 Great job! You've worked 20% more hours than last month.</Text>
              <Text style={styles.insightText}>📈 Your earnings are trending upward this quarter.</Text>
              <Text style={styles.insightText}>⭐ You're maintaining an excellent rating of 4.8/5.0.</Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  earningsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  earningsCard: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  earningsAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#10b981",
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  statLabel: {
    fontSize: 16,
    color: "#9ca3af",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  leaderboardCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  currentUserRow: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 8,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  rankContainer: {
    width: 40,
    alignItems: "center",
  },
  rank: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },
  leaderboardName: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 12,
  },
  leaderboardEarnings: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  currentUserText: {
    color: "#6366f1",
  },
  insightsCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  insightText: {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 20,
    marginBottom: 12,
  },
})
