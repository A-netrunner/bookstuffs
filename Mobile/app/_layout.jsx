// fix the error : (0 , _authStore.default) is not a function


import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSegments } from "expo-router";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";




export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  console.log("Current segments:", segments);

  const {  checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    // Check authentication status when the app starts
     checkAuth();
  }, []);

  useEffect(() => {
    const isAuthenticated = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (isAuthenticated && isSignedIn) {
      // If the user is authenticated and signed in, redirect to the home screen
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !isSignedIn) {
      // If the user is not authenticated and not signed in, redirect to the auth screen
      router.replace("/(auth)");
    }
  }, [user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="/(tabs)" />
          <Stack.Screen name="/(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
