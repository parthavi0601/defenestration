import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"

// Import screens
import DualLoginScreen from "./src/screens/DualLoginScreen"
import StaffLoginScreen from "./src/screens/StaffLoginScreen"
import OwnerLoginScreen from "./src/screens/OwnerLoginScreen"
import OwnerRegisterScreen from "./src/screens/OwnerRegisterScreen"
import ShopSetupScreen from "./src/screens/ShopSetupScreen"
import StaffDashboardScreen from "./src/screens/StaffDashboardScreen"
import OwnerDashboardScreen from "./src/screens/OwnerDashboardScreen"
import StaffInsightsScreen from "./src/screens/StaffInsightsScreen"
import ShopInsightsScreen from "./src/screens/ShopInsightsScreen"
import LeaveRequestsScreen from "./src/screens/LeaveRequestsScreen"
import RequestLeaveScreen from "./src/screens/RequestLeaveScreen"
const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="DualLogin"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0a0a0a",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen name="DualLogin" component={DualLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StaffLogin" component={StaffLoginScreen} options={{ title: "Staff Login" }} />
        <Stack.Screen name="OwnerLogin" component={OwnerLoginScreen} options={{ title: "Owner Login" }} />
        <Stack.Screen name="OwnerRegister" component={OwnerRegisterScreen} options={{ title: "Create Account" }} />
        <Stack.Screen name="ShopSetup" component={ShopSetupScreen} options={{ title: "Shop Setup" }} />
        <Stack.Screen name="StaffDashboard" component={StaffDashboardScreen} options={{ title: "Staff Dashboard" }} />
        <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} options={{ title: "Owner Dashboard" }} />
        <Stack.Screen name="ShopInsights" component={ShopInsightsScreen} options={{title:"Shop Insights"}}/>
        <Stack.Screen name="LeaveRequests" component={LeaveRequestsScreen} options={{title:"Leave Requsts"}}/>
        <Stack.Screen name="StaffInsights" component={StaffInsightsScreen} options={{ title: "Staff Insights" }} />
        <Stack.Screen name="RequestLeave" component={RequestLeaveScreen} options={{titel:"Request Leave"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
