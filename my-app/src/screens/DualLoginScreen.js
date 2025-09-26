import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

export default function DualLoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>WorkForce</Text>
            <Text style={styles.subtitle}>Planner</Text>
            <Text style={styles.description}>AI-powered scheduling for small businesses</Text>
          </View>

          {/* Login Options */}
          <View style={styles.loginOptions}>
            <TouchableOpacity
              style={[styles.loginButton, styles.staffButton]}
              onPress={() => navigation.navigate("StaffLogin")}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>👥</Text>
                </View>
                <Text style={styles.buttonTitle}>Staff Login</Text>
                <Text style={styles.buttonSubtitle}>View your schedule and manage shifts</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, styles.ownerButton]}
              onPress={() => navigation.navigate("OwnerLogin")}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>🏪</Text>
                </View>
                <Text style={styles.buttonTitle}>Owner Login</Text>
                <Text style={styles.buttonSubtitle}>Manage your business and staff</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Streamline your workforce management</Text>
          </View>
        </View>
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
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: height * 0.1,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 42,
    fontWeight: "300",
    color: "#6366f1",
    textAlign: "center",
    marginTop: -8,
  },
  description: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
  loginOptions: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  loginButton: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  staffButton: {
    backgroundColor: "#1f2937",
  },
  ownerButton: {
    backgroundColor: "#1e1b4b",
  },
  buttonContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
})
