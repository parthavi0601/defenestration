// src/screens/StaffLoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import staffService from '../services/staffService';

export default function StaffLoginScreen({ navigation }) {
  const [contact, setContact] = useState('');
  const [shopId, setShopId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Test backend connection
  const testConnection = async () => {
    try {
      console.log('🧪 Testing backend connection...');
      
      const response = await fetch('http://10.0.2.2:8002/');
      console.log(`📊 Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend response:', data);
        Alert.alert('✅ Success', 'Backend is connected!');
      } else {
        Alert.alert('❌ Error', `Backend returned status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      Alert.alert('❌ Connection Failed', `Error: ${error.message}\n\nMake sure your FastAPI backend is running on port 8002`);
    }
  };

  // Fill test data
  const fillTestData = () => {
    setShopId('4');
    setContact('+918369855073');
    Alert.alert('✅ Test Data Set', 'Shop ID: 4 (Jane\'s Bakery)\nPhone: +918369855073 (Sarah Wilson)');
  };

  const sendOTP = async () => {
    if (!contact.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!shopId.trim()) {
      Alert.alert('Error', 'Please enter shop ID');
      return;
    }

    // Validate phone format
    if (!/^\+[\d]{10,15}$/.test(contact.trim())) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter phone number with country code.\n\nExample: +918369855073'
      );
      return;
    }

    setLoading(true);
    try {
      console.log('📱 Attempting to send OTP...');
      
      const result = await staffService.sendOTP(parseInt(shopId.trim()), contact.trim());
      
      if (result.success) {
        setOtpSent(true);
        Alert.alert(
          '✅ OTP Sent Successfully!',
          `Verification code sent to ${contact.trim()}.\n\nCheck your SMS and enter the 6-digit code.`
        );
      } else {
        Alert.alert('❌ Failed to Send OTP', result.error);
      }
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      Alert.alert('❌ Network Error', 'Unable to send OTP. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.trim().length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting to verify OTP...');
      
      const result = await staffService.login(parseInt(shopId.trim()), contact.trim(), otp.trim());
      
      if (result.success) {
        const staffData = result.data;
        Alert.alert(
          '✅ Login Successful!',
          `Welcome ${staffData.name}!\nRole: ${staffData.role}`,
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('StaffDashboard', { staffData }),
            },
          ]
        );
      } else {
        Alert.alert('❌ Login Failed', result.error);
        setOtp(''); // Clear OTP for retry
      }
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      Alert.alert('❌ Login Error', 'Unable to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp('');
  };

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/[^\d+]/g, '');
    if (cleaned.length > 0 && !cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Staff Login</Text>
            <Text style={styles.subtitle}>
              {otpSent
                ? 'Enter the verification code sent to your phone'
                : 'Enter your details to access your schedule'}
            </Text>
          </View>

          <View style={styles.form}>
            {/* Test Buttons */}
            <View style={styles.testSection}>
              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: '#10b981' }]}
                onPress={testConnection}
              >
                <Text style={styles.testButtonText}>🧪 Test Connection</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: '#f59e0b' }]}
                onPress={fillTestData}
              >
                <Text style={styles.testButtonText}>📝 Fill Test Data</Text>
              </TouchableOpacity>
            </View>

            {/* Shop ID Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop ID</Text>
              <TextInput
                style={[styles.input, (loading || otpSent) && styles.inputDisabled]}
                placeholder="Enter shop ID (e.g., 4)"
                placeholderTextColor="#6b7280"
                value={shopId}
                onChangeText={setShopId}
                keyboardType="numeric"
                editable={!otpSent && !loading}
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, (loading || otpSent) && styles.inputDisabled]}
                placeholder="Enter phone (+918369855073)"
                placeholderTextColor="#6b7280"
                value={contact}
                onChangeText={(text) => setContact(formatPhoneNumber(text))}
                keyboardType="phone-pad"
                editable={!otpSent && !loading}
              />
            </View>

            {/* OTP Input */}
            {otpSent && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  style={[styles.input, styles.otpInput, loading && styles.inputDisabled]}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#6b7280"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                  editable={!loading}
                  autoFocus={true}
                  textAlign="center"
                />
              </View>
            )}

            {/* Main Action Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={otpSent ? verifyOTP : sendOTP}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.loadingText}>
                    {otpSent ? 'Verifying...' : 'Sending OTP...'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>
                  {otpSent ? 'Verify & Login' : 'Send OTP'}
                </Text>
              )}
            </TouchableOpacity>

            {/* OTP Actions */}
            {otpSent && (
              <View style={styles.otpActions}>
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={sendOTP}
                  disabled={loading}
                >
                  <Text style={[styles.resendText, loading && styles.disabledText]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetForm}
                  disabled={loading}
                >
                  <Text style={[styles.resetText, loading && styles.disabledText]}>
                    Change Details
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
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
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  testSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  testButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  testButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#374151',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  resendButton: {
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  resetButton: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#6366f1',
    textDecorationLine: 'underline',
  },
  resetText: {
    fontSize: 14,
    color: '#f59e0b',
    textDecorationLine: 'underline',
  },
  disabledText: {
    opacity: 0.6,
  },
});
