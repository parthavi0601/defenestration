// src/screens/OwnerRegisterScreen.js
"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import authService from '../services/authService'

export default function OwnerRegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    mobileNumber: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const validatePhone = (phone) => {
    return /^\+?[\d\s-()]{10,}$/.test(phone)
  }

  const handleNext = async () => {
    // Validate form
    const requiredFields = ["firstName", "lastName", "email", "username", "password", "mobileNumber"]
    const emptyFields = requiredFields.filter((field) => !formData[field].trim())

    if (emptyFields.length > 0) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    if (!validatePhone(formData.mobileNumber)) {
      Alert.alert("Error", "Please enter a valid phone number")
      return
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    try {
      const result = await authService.registerOwner({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        mobile_number: formData.mobileNumber,
      })

      if (result.success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("ShopSetup", { ownerData: result.data }) }
        ])
      } else {
        Alert.alert("Registration Failed", result.error)
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Owner Account</Text>
            <Text style={styles.subtitle}>Set up your business management account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={[styles.input, loading && styles.inputDisabled]}
                  placeholder="Enter first name"
                  placeholderTextColor="#6b7280"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange("firstName", value)}
                  editable={!loading}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={[styles.input, loading && styles.inputDisabled]}
                  placeholder="Enter last name"
                  placeholderTextColor="#6b7280"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange("lastName", value)}
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, loading && styles.inputDisabled]}
                placeholder="Enter your email"
                placeholderTextColor="#6b7280"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[styles.input, loading && styles.inputDisabled]}
                placeholder="Choose a username"
                placeholderTextColor="#6b7280"
                value={formData.username}
                onChangeText={(value) => handleInputChange("username", value)}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, loading && styles.inputDisabled]}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#6b7280"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[styles.input, loading && styles.inputDisabled]}
                placeholder="Enter your mobile number"
                placeholderTextColor="#6b7280"
                value={formData.mobileNumber}
                onChangeText={(value) => handleInputChange("mobileNumber", value)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleNext} 
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Next</Text>
              )}
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
  form: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
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
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  buttonDisabled: {
    backgroundColor: "#4338ca",
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
})
