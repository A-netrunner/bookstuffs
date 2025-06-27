import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import styles from "../../assets/styles/login.styles";
import { useState } from "react";
import { Image } from "expo-image";
import COLORS from "../../constants/colors";
import { Link } from "expo-router";
import { useAuthStore } from "../../store/authStore.js";

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
  const { login, isCheckingAuth } = useAuthStore();

  // Get window dimensions for responsive design
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLargeScreen = windowWidth >= 768; // Tablet/Desktop breakpoint
  const isDesktop = windowWidth >= 1024; // Desktop breakpoint

  const handleLogin = async () => {
    setError("");

    if (isCheckingAuth) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4CAD50" />
    </View>
  );
}
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
      await login(email.trim(), password);
      console.log("Login successful!", email, password);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic styles based on platform and screen size
  const getContainerStyles = () => {
    if (Platform.OS === "web") {
      if (isDesktop) {
        // Desktop: Side-by-side layout
        return {
          flexDirection: "row",
          minHeight: windowHeight,
          backgroundColor: COLORS.background,
        };
      } else if (isLargeScreen) {
        // Tablet: Centered with max width
        return {
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
          minHeight: windowHeight,
        };
      } else {
        // Mobile web: Similar to native mobile
        return {
          flex: 1,
          backgroundColor: COLORS.background,
          padding: 20,
          minHeight: windowHeight,
        };
      }
    }
    return styles.container;
  };

  const getImageSectionStyles = () => {
    if (Platform.OS === "web" && isDesktop) {
      return {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        backgroundColor: COLORS.primaryLight || COLORS.background,
        minHeight: windowHeight,
      };
    }
    return styles.topIllustration;
  };

  const getFormSectionStyles = () => {
    if (Platform.OS === "web") {
      if (isDesktop) {
        return {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
          backgroundColor: COLORS.background,
          minHeight: windowHeight,
        };
      } else if (isLargeScreen) {
        return {
          width: "100%",
          maxWidth: 480,
        };
      } else {
        return {
          width: "100%",
          marginTop: 20,
        };
      }
    }
    return null;
  };

  const getCardStyles = () => {
    if (Platform.OS === "web") {
      if (isDesktop) {
        return [
          styles.card,
          {
            width: "100%",
            maxWidth: 400,
            marginTop: 0,
            shadowColor: COLORS.black,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
          },
        ];
      } else if (isLargeScreen) {
        return [
          styles.card,
          {
            marginTop: -40,
            marginHorizontal: 0,
          },
        ];
      } else {
        return [
          styles.card,
          {
            marginTop: -20,
            marginHorizontal: 0,
          },
        ];
      }
    }
    return styles.card;
  };

  const getImageStyles = () => {
    if (Platform.OS === "web" && isDesktop) {
      return {
        width: Math.min(350, windowWidth * 0.3),
        height: Math.min(350, windowWidth * 0.3),
        maxWidth: "100%",
        maxHeight: "100%",
      };
    } else if (Platform.OS === "web" && isLargeScreen) {
      return {
        width: windowWidth * 0.4,
        height: windowWidth * 0.4,
        maxWidth: 300,
        maxHeight: 300,
      };
    } else if (Platform.OS === "web") {
      return {
        width: windowWidth * 0.6,
        height: windowWidth * 0.6,
        maxWidth: 250,
        maxHeight: 250,
      };
    }
    return styles.illustrationImage;
  };

  const renderImageSection = () => (
    <View style={getImageSectionStyles()}>
      <Image
        source={require("../../assets/images/Woman reading-bro.png")}
        style={getImageStyles()}
        contentFit="contain"
      />
      {Platform.OS === "web" && (
        <>
          <Text
            style={{
              fontSize: isDesktop ? 28 : 24,
              fontWeight: "bold",
              marginTop: 24,
              textAlign: "center",
              color: COLORS.primary,
              maxWidth: 300,
            }}
          >
            Welcome to Bookvers
          </Text>
          <Text
            style={{
              fontSize: isDesktop ? 18 : 16,
              marginTop: 12,
              textAlign: "center",
              color: COLORS.textSecondary,
              opacity: 0.8,
              maxWidth: 280,
              lineHeight: 24,
            }}
          >
            Share your favorite reads with the community
          </Text>
        </>
      )}
    </View>
  );

  const renderForm = () => (
    <View style={getFormSectionStyles()}>
      <View style={getCardStyles()}>
        {/* Header - only show on mobile web and native */}
        {(!Platform.OS === "web" || !isDesktop) && (
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>
          </View>
        )}

        {/* Desktop header */}
        {Platform.OS === "web" && isDesktop && (
          <View style={[styles.header, { marginBottom: 32 }]}>
            <Text style={[styles.title, { fontSize: 28 }]}>Login</Text>
            <Text style={[styles.subtitle, { fontSize: 16 }]}>
              Welcome back! Please Login to your account
            </Text>
          </View>
        )}

        <View style={styles.formContainer}>
          {/* Error message */}
          {error ? (
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.errorText, { textAlign: "center" }]}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, error && styles.inputError]}>
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

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, error && styles.inputError]}>
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

          {/* Login button */}
          <Pressable
            style={[
              styles.button,
              isLoading && styles.buttonDisabled,
              Platform.OS === "web" && {
                cursor: isLoading ? "not-allowed" : "pointer",
              },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>

          {/* Signup link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/signup" asChild>
              <Pressable
                disabled={isLoading}
                style={Platform.OS === "web" && { cursor: "pointer" }}
              >
                <Text
                  style={[
                    styles.link,
                    isLoading && { opacity: 0.5 },
                    Platform.OS === "web" && {
                      textDecorationLine: "underline",
                    },
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
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        {Platform.OS === "web" && !isLargeScreen ? (
          // Mobile web: Use ScrollView for better UX
          <ScrollView
            contentContainerStyle={getContainerStyles()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderImageSection()}
            {renderForm()}
          </ScrollView>
        ) : Platform.OS === "web" && isDesktop ? (
          // Desktop web: Side-by-side layout
          <View style={getContainerStyles()}>
            {renderImageSection()}
            {renderForm()}
          </View>
        ) : Platform.OS === "web" && isLargeScreen ? (
          // Tablet web: Centered layout
          <ScrollView
            contentContainerStyle={getContainerStyles()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderImageSection()}
            {renderForm()}
          </ScrollView>
        ) : (
          // Native mobile: Original layout
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderImageSection()}
            {renderForm()}
          </ScrollView>
        )}
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  );
}
