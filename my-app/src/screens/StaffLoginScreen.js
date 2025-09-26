"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function StaffLoginScreen({ navigation }) {
  const [contact, setContact] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  
  const staticOTP = "123456"; // Your static OTP


  const sendOTP = () => {
   
    if (!contact.trim()) {
      Alert.alert("Error", "Please enter your contact number")
      return
    }
    // Simulate OTP sending
    setOtpSent(true)
    Alert.alert("OTP Sent", "A verification code has been sent to your phone")
  }

  const verifyOTP = () => {
    
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP")
      return
    }
    // Dummy OTP verification (accept any 4-digit code)
    if (otp.length === 4) {
      navigation.navigate("StaffDashboard")
    } else {
      Alert.alert("Error", "Please enter a valid 4-digit OTP")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Staff Login</Text>
            <Text style={styles.subtitle}>Enter your contact details to access your schedule</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#6b7280"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
                editable={!otpSent}
              />
            </View>

            {otpSent && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 4-digit OTP"
                  placeholderTextColor="#6b7280"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={otpSent ? verifyOTP : sendOTP} activeOpacity={0.8}>
              <Text style={styles.buttonText}>{otpSent ? "Verify OTP" : "Send OTP"}</Text>
            </TouchableOpacity>

            {otpSent && (
              <TouchableOpacity style={styles.resendButton} onPress={sendOTP} activeOpacity={0.8}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
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
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
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
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  resendButton: {
    alignItems: "center",
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    color: "#6366f1",
    textDecorationLine: "underline",
  },
})
