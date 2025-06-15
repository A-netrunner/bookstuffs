import { Text, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Expo Router!</Text>
      <Text>Open app/index.jsx to start working on your app!</Text>

      <Link href="/(auth)/signup">Signin page</Link>
      <Link href="/(auth)">Login page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "blue",
    fontSize: 20,
  },
});
