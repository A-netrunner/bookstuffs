import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSegments } from "expo-router";
import { useAuthStore } from "../store/authStore.js";
import { useEffect, useState, useLayoutEffect } from "react";
import {useFonts} from "expo-font"
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  

  const { checkAuth, user, token } = useAuthStore();

const [fontsLoaded] = useFonts({
  "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
})

useEffect (()=> {
  if(fontsLoaded) SplashScreen.hideAsync();
},[fontsLoaded])

  const [isLoading, setIsLoading] = useState(true);

  // Using useEffect to check authentication after the component mounts
  useEffect(() => {
    const authenticate = async () => {
      await checkAuth(); // Check authentication status
      setIsLoading(false); // Set loading to false once the check is done
    };
    
    authenticate();
  }, []); // Only run on initial mount

  useLayoutEffect(() => {
    if (isLoading) return; // Don't redirect until auth check is complete

    const isAuthenticated = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (isAuthenticated && isSignedIn) {
      // If the user is authenticated and signed in, redirect to the home screen
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !isSignedIn) {
      // If the user is not authenticated and not signed in, redirect to the auth screen
      router.replace("/(auth)");
    }
  }, [user, token, segments, isLoading]); // Only run when auth status is checked and isLoading is false

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
