// src/screens/OwnerLoginScreen.js - OWNER OFFLINE MODE ONLY
import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import authService from '../services/authService'
import offlineAuthService from '../services/offlineAuthService'

export default function OwnerLoginScreen({ navigation }) {
  const [username, setUsername] = useState("demo_owner")  // Pre-filled for demo
  const [password, setPassword] = useState("password123") // Pre-filled for demo
  const [loading, setLoading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true) // Toggle between demo and real mode

  // Show demo info on mount
  useEffect(() => {
    if (isDemoMode) {
      setTimeout(() => {
        Alert.alert(
          "☕ Owner Demo Mode", 
          "Demo owner credentials:\nUsername: demo_owner\nPassword: password123\n\n⚠️ Note: Staff login still uses real OTP system",
          [{ text: "Got it!" }]
        )
      }, 1000)
    }
  }, [isDemoMode])

  const switchToRealMode = () => {
    setIsDemoMode(false)
    setUsername("")
    setPassword("")
    Alert.alert("Real Mode", "Switched to real backend mode for owner login.")
  }

  const switchToDemoMode = () => {
    setIsDemoMode(true)
    setUsername("demo_owner")
    setPassword("password123")
    Alert.alert("Demo Mode", "Switched to demo mode for owner login.")
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password")
      return
    }

    setLoading(true)
    try {
      let result

      if (isDemoMode) {
        // Use offline authentication for OWNER ONLY
        console.log('🔐 Using offline demo authentication for owner...')
        result = await offlineAuthService.ownerLogin(username.trim(), password)
      } else {
        // Use real authentication for owner
        console.log('🔐 Using real backend authentication for owner...')
        result = await authService.ownerLogin(username.trim(), password)
      }
      
      if (result.success) {
        const welcomeMessage = isDemoMode 
          ? "Welcome to Owner Demo! 🎉\n\nYou can manage dummy staff and schedules."
          : "Welcome back! 👋"
        
        Alert.alert("Success", welcomeMessage, [
          { text: "Continue", onPress: () => navigation.navigate("OwnerDashboard") }
        ])
      } else {
        Alert.alert("Login Failed", result.error)
      }
    } catch (error) {
      console.error('Login error:', error)
      
      if (isDemoMode) {
        Alert.alert("Demo Error", "Demo authentication failed. Please try again.")
      } else {
        Alert.alert("Error", "Cannot connect to server. Please check your internet connection or switch to demo mode.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <View style={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>☕ Owner Login</Text>
            <Text style={styles.subtitle}>Access your business management dashboard</Text>
            
            {/* Mode Toggle - OWNER ONLY */}
            <View style={styles.modeToggle}>
              <TouchableOpacity 
                style={[styles.modeButton, isDemoMode && styles.modeButtonActive]} 
                onPress={switchToDemoMode}
                disabled={loading}
              >
                <Text style={[styles.modeButtonText, isDemoMode && styles.modeButtonTextActive]}>
                  🎯 Demo Owner
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modeButton, !isDemoMode && styles.modeButtonActive]} 
                onPress={switchToRealMode}
                disabled={loading}
              >
                <Text style={[styles.modeButtonText, !isDemoMode && styles.modeButtonTextActive]}>
                  🌐 Real Owner
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo credentials display */}
            {isDemoMode && (
              <View style={styles.demoBox}>
                <Text style={styles.demoTitle}>🎯 Demo Owner Credentials</Text>
                <Text style={styles.demoText}>Username: demo_owner</Text>
                <Text style={styles.demoText}>Password: password123</Text>
              </View>
            )}

            {/* Real mode info */}
            {!isDemoMode && (
              <View style={styles.realModeBox}>
                <Text style={styles.realModeTitle}>🌐 Real Backend Mode</Text>
                <Text style={styles.realModeText}>Enter your actual owner credentials</Text>
              </View>
            )}
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[styles.input, loading && styles.inputDisabled]}
                placeholder="Enter your username"
                placeholderTextColor="#6b7280"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, loading && styles.inputDisabled]}
                placeholder="Enter your password"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[
                styles.button, 
                loading && styles.buttonDisabled,
                isDemoMode ? styles.demoButton : styles.realButton
              ]} 
              onPress={handleLogin} 
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isDemoMode ? "🚀 Demo Login" : "🔐 Owner Login"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Staff Login - ALWAYS USES REAL OTP */}
            <TouchableOpacity
              style={styles.staffLoginButton}
              onPress={() => navigation.navigate("StaffLogin")}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.staffLoginText}>👥 Staff Login (Real OTP)</Text>
            </TouchableOpacity>

            {/* Create Account (only in real mode) */}
            {!isDemoMode && (
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => navigation.navigate("OwnerRegister")}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.createAccountText}>Create Owner Account</Text>
              </TouchableOpacity>
            )}

            {/* Important Note */}
            <View style={styles.noteBox}>
              <Text style={styles.noteTitle}>📋 Important Note:</Text>
              <Text style={styles.noteText}>
                • Owner login has demo mode for testing{'\n'}
                • Staff login always uses real OTP system{'\n'}
                • All staff features require actual phone verification
              </Text>
            </View>
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
    paddingTop: 20,
  },
  header: {
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
    marginBottom: 20,
  },
  
  // Mode Toggle Styles
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#6366f1",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
  },
  modeButtonTextActive: {
    color: "#ffffff",
  },

  // Demo box styles
  demoBox: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: "#e5e7eb",
    fontFamily: "monospace",
  },

  // Real mode box
  realModeBox: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  realModeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: 4,
  },
  realModeText: {
    fontSize: 12,
    color: "#9ca3af",
  },

  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#374151",
  },
  inputDisabled: {
    opacity: 0.6,
  },

  // Button Styles
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  demoButton: {
    backgroundColor: "#10b981",
  },
  realButton: {
    backgroundColor: "#6366f1",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#374151",
  },
  dividerText: {
    color: "#6b7280",
    paddingHorizontal: 16,
    fontSize: 14,
  },

  // Staff login button - ALWAYS REAL
  staffLoginButton: {
    borderWidth: 2,
    borderColor: "#f59e0b",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  staffLoginText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f59e0b",
  },

  createAccountButton: {
    borderWidth: 1,
    borderColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },

  // Note box
  noteBox: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 18,
  },
})
