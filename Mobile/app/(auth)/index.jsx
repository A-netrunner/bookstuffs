import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
} from "react-native";
import styles from "../../assets/styles/login.styles";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import COLORS from "../../constants/colors";
import { Link } from "expo-router";
import { useAuthStore } from "../../store/authStore.js"; // Import your Zustand store

// Platform-specific imports
const GestureHandlerRootView =
  Platform.OS === "web"
    ? View
    : require("react-native-gesture-handler").GestureHandlerRootView;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
  const {  login } = useAuthStore();

 

  const handleLogin = async () => {
    setError("");

    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Call the login function from your Zustand store
      await login(email.trim(), password);
      console.log("Login successful!", email, password);
    } catch (err) {
      // Handle login errors
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Web-specific container styles
  const webContainerStyle =
    Platform.OS === "web"
      ? {
          flexDirection: "row",
          maxWidth: "100vw",
          alignSelf: "center",
          width: "80%",
          minHeight: "100vh",
        }
      : {};

  const webImageContainerStyle =
    Platform.OS === "web"
      ? {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        }
      : {};

  const webFormContainerStyle =
    Platform.OS === "web"
      ? {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
          maxWidth: 500,
        }
      : {};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container, webContainerStyle]}>
          {/* Image section - left side on web, top on mobile */}
          {Platform.OS === "web" ? (
            <View style={webImageContainerStyle}>
              <Image
                source={require("../../assets/images/Book.png")}
                style={{
                  width: 300,
                  height: 300,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                contentFit="contain"
              />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginTop: 20,
                  textAlign: "center",
                  color: COLORS.primary,
                }}
              >
                Welcome to Bookvers
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 10,
                  textAlign: "center",
                  color: COLORS.text,
                  opacity: 0.7,
                }}
              >
                Share your favorite reads with the community
              </Text>
            </View>
          ) : (
            <View style={styles.topIllustration}>
              <Image
                source={require("../../assets/images/Book.png")}
                style={styles.illustrationImage}
                contentFit="contain"
              />
            </View>
          )}

          {/* Form section - right side on web, normal on mobile */}
          <View style={[Platform.OS === "web" ? webFormContainerStyle : null]}>
            <View style={styles.card}>
              <View style={styles.formContainer}>
                {/* Error message */}
                {error ? (
                  <View style={styles.formContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* email input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={COLORS.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={COLORS.placeholderText}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={email}
                      onChangeText={setEmail}
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* password input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={COLORS.placeholder}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.placeholderText}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      editable={!isLoading}
                    />
                    <Pressable
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={COLORS.primary}
                      />
                    </Pressable>
                  </View>
                </View>

                {/* login button */}
                <Pressable
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </Pressable>

                {/* signup link */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <Link href="/signup" asChild>
                    <Pressable disabled={isLoading}>
                      <Text
                        style={[
                          styles.footerLink,
                          isLoading && styles.linkDisabled,
                        ]}
                      >
                        Sign Up
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  );
}
