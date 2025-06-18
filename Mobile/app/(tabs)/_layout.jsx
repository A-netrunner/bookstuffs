import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Tabs } from "expo-router";
export default function _layout() {
  return (
    <Tabs headerShown={false} tabBarStyle={{ display: "none", tabBarIcon: ({color,size}) => (<Ionicons name="home-outline" size={size} color={color}/>) }} >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="create" options={{ title: "Create" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
