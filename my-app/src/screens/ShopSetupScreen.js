"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const SHOP_TYPES = ["Bakery", "Cafe", "Electronics", "Laundromat", "Footwear", "Book Store"]

const SHOP_ROLES = {
  Bakery: ["Baker", "Cashier", "Decorator", "Assistant"],
  Cafe: ["Barista", "Cashier", "Chef", "Server", "Manager"],
  Electronics: ["Sales Associate", "Technician", "Cashier", "Manager"],
  Laundromat: ["Attendant", "Maintenance", "Cashier"],
  Footwear: ["Sales Associate", "Cashier", "Stock Clerk", "Manager"],
  "Book Store": ["Sales Associate", "Cashier", "Librarian", "Manager"],
}

const TIME_SLOTS = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
]

const Dropdown = ({ label, value, options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(true)} activeOpacity={0.8}>
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>{value || placeholder}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsOpen(false)} activeOpacity={1}>
          <View style={styles.dropdownModal}>
            <ScrollView style={styles.dropdownList}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => {
                    onSelect(option)
                    setIsOpen(false)
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default function ShopSetupScreen({ navigation, route }) {
  const { ownerData } = route.params
  const [shops, setShops] = useState([])
  const [currentShop, setCurrentShop] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    shopType: "",
    maxCapacity: "",
    open: "",
    close: "",
    staff: [],
  })

  const addShop = () => {
    if (
      !currentShop.name.trim() ||
      !currentShop.address.trim() ||
      !currentShop.phoneNumber.trim() ||
      !currentShop.shopType ||
      !currentShop.maxCapacity.trim() ||
      !currentShop.open ||
      !currentShop.close
    ) {
      Alert.alert("Error", "Please fill in all shop details")
      return
    }

    const newShop = {
      ...currentShop,
      id: shops.length + 1,
    }

    setShops([...shops, newShop])
    setCurrentShop({
      name: "",
      address: "",
      phoneNumber: "",
      shopType: "",
      maxCapacity: "",
      open: "",
      close: "",
      staff: [],
    })

    Alert.alert("Success", `Shop ${newShop.id} added successfully!`)
  }

  const addStaff = (shopIndex) => {
    const newStaff = {
      id: Date.now(),
      firstName: "",
      lastName: "",
      availability: "8-2",
      payRate: "",
      weeklyConstraint: "42",
      role: "",
    }

    const updatedShops = [...shops]
    updatedShops[shopIndex].staff.push(newStaff)
    setShops(updatedShops)
  }

  const updateStaff = (shopIndex, staffIndex, field, value) => {
    const updatedShops = [...shops]
    updatedShops[shopIndex].staff[staffIndex][field] = value
    setShops(updatedShops)
  }

  const finishSetup = () => {
    if (shops.length === 0) {
      Alert.alert("Error", "Please add at least one shop")
      return
    }

    Alert.alert("Setup Complete", "Your account has been created successfully!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("DualLogin"),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#0a0a0a", "#1a1a1a"]} style={styles.gradient}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Shop Setup</Text>
            <Text style={styles.subtitle}>Add your shops and configure staff</Text>
          </View>

          {/* Add New Shop Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Shop</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter shop name"
                placeholderTextColor="#6b7280"
                value={currentShop.name}
                onChangeText={(value) => setCurrentShop({ ...currentShop, name: value })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter shop address"
                placeholderTextColor="#6b7280"
                value={currentShop.address}
                onChangeText={(value) => setCurrentShop({ ...currentShop, address: value })}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#6b7280"
                value={currentShop.phoneNumber}
                onChangeText={(value) => setCurrentShop({ ...currentShop, phoneNumber: value })}
                keyboardType="phone-pad"
              />
            </View>

            <Dropdown
              label="Shop Type"
              value={currentShop.shopType}
              options={SHOP_TYPES}
              onSelect={(value) => setCurrentShop({ ...currentShop, shopType: value })}
              placeholder="Select shop type"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Max Capacity</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter maximum capacity"
                placeholderTextColor="#6b7280"
                value={currentShop.maxCapacity}
                onChangeText={(value) => setCurrentShop({ ...currentShop, maxCapacity: value })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Dropdown
                  label="Opening Time"
                  value={currentShop.open}
                  options={TIME_SLOTS}
                  onSelect={(value) => setCurrentShop({ ...currentShop, open: value })}
                  placeholder="Select opening time"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Dropdown
                  label="Closing Time"
                  value={currentShop.close}
                  options={TIME_SLOTS}
                  onSelect={(value) => setCurrentShop({ ...currentShop, close: value })}
                  placeholder="Select closing time"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addShop} activeOpacity={0.8}>
              <Text style={styles.addButtonText}>Add Shop</Text>
            </TouchableOpacity>
          </View>

          {/* Existing Shops */}
          {shops.map((shop, shopIndex) => (
            <View key={shop.id} style={styles.shopCard}>
              <Text style={styles.shopTitle}>Shop {shop.id}</Text>
              <Text style={styles.shopDetails}>Name: {shop.name}</Text>
              <Text style={styles.shopDetails}>Type: {shop.shopType}</Text>
              <Text style={styles.shopDetails}>Address: {shop.address}</Text>
              <Text style={styles.shopDetails}>Phone: {shop.phoneNumber}</Text>
              <Text style={styles.shopDetails}>Capacity: {shop.maxCapacity}</Text>
              <Text style={styles.shopDetails}>
                Hours: {shop.open} - {shop.close}
              </Text>

              <TouchableOpacity style={styles.addStaffButton} onPress={() => addStaff(shopIndex)} activeOpacity={0.8}>
                <Text style={styles.addStaffButtonText}>Add Staff</Text>
              </TouchableOpacity>

              {/* Staff List */}
              {shop.staff.map((staff, staffIndex) => (
                <View key={staff.id} style={styles.staffCard}>
                  <Text style={styles.staffTitle}>Staff {staffIndex + 1}</Text>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.label}>First Name</Text>
                      <TextInput
                        style={styles.smallInput}
                        placeholder="First name"
                        placeholderTextColor="#6b7280"
                        value={staff.firstName}
                        onChangeText={(value) => updateStaff(shopIndex, staffIndex, "firstName", value)}
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                      <Text style={styles.label}>Last Name</Text>
                      <TextInput
                        style={styles.smallInput}
                        placeholder="Last name"
                        placeholderTextColor="#6b7280"
                        value={staff.lastName}
                        onChangeText={(value) => updateStaff(shopIndex, staffIndex, "lastName", value)}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Availability</Text>
                    <View style={styles.availabilityButtons}>
                      <TouchableOpacity
                        style={[
                          styles.availabilityButton,
                          staff.availability === "8-2" && styles.availabilityButtonActive,
                        ]}
                        onPress={() => updateStaff(shopIndex, staffIndex, "availability", "8-2")}
                      >
                        <Text
                          style={[
                            styles.availabilityButtonText,
                            staff.availability === "8-2" && styles.availabilityButtonTextActive,
                          ]}
                        >
                          8-2
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.availabilityButton,
                          staff.availability === "2-10" && styles.availabilityButtonActive,
                        ]}
                        onPress={() => updateStaff(shopIndex, staffIndex, "availability", "2-10")}
                      >
                        <Text
                          style={[
                            styles.availabilityButtonText,
                            staff.availability === "2-10" && styles.availabilityButtonTextActive,
                          ]}
                        >
                          2-10
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.label}>Pay Rate</Text>
                      <TextInput
                        style={styles.smallInput}
                        placeholder="$/hour"
                        placeholderTextColor="#6b7280"
                        value={staff.payRate}
                        onChangeText={(value) => updateStaff(shopIndex, staffIndex, "payRate", value)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                      <Dropdown
                        label="Role"
                        value={staff.role}
                        options={SHOP_ROLES[shop.shopType] || []}
                        onSelect={(value) => updateStaff(shopIndex, staffIndex, "role", value)}
                        placeholder="Select role"
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity style={styles.finishButton} onPress={finishSetup} activeOpacity={0.8}>
            <Text style={styles.finishButtonText}>Finish Setup</Text>
          </TouchableOpacity>
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
  row: {
    flexDirection: "row",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
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
  smallInput: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#374151",
  },
  dropdown: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#ffffff",
    flex: 1,
  },
  placeholderText: {
    color: "#6b7280",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#9ca3af",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    width: "80%",
    maxHeight: "60%",
    borderWidth: 1,
    borderColor: "#374151",
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#ffffff",
  },
  addButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  shopCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#374151",
  },
  shopTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  shopDetails: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 4,
  },
  addStaffButton: {
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  addStaffButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  staffCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  staffTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 12,
  },
  availabilityButtons: {
    flexDirection: "row",
    gap: 12,
  },
  availabilityButton: {
    flex: 1,
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  availabilityButtonActive: {
    backgroundColor: "#6366f1",
  },
  availabilityButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9ca3af",
  },
  availabilityButtonTextActive: {
    color: "#ffffff",
  },
  finishButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
})
