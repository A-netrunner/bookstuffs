import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import styles from "../../assets/styles/signup.styles";
import COLORS from "../../constants/colors";
import { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore.js";
import ErrorMessage from "../../components/ErrorMessage.jsx";

export default function Signup() {
  // State hooks
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, register, error, successMessage, clearMessages } =
    useAuthStore();

  const router = useRouter();

  // Clear messages when component mounts
  useEffect(() => {
    clearMessages();
  }, []);

  // Handle sign up process
  const handleSignUp = async () => {
    // Clear previous messages
    clearMessages();

    // Basic client-side validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      // This will be handled by backend, but we can add client-side validation if needed
      return;
    }

    // Call register function - it will handle errors internally
    await register(username, email, password);
  };

  // Handle message dismissal
  const handleDismissMessage = () => {
    clearMessages();
  };

  // Web-specific container styles
  const webContainerStyle =
    Platform.OS === "web"
      ? {
          maxWidth: 400,
          alignSelf: "center",
          width: "100%",
          paddingHorizontal: 20,
          justifyContent: "center",
        }
      : {};

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={[styles.container, webContainerStyle]}>
        <View style={styles.card}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>Bookvers</Text>
            <Text style={styles.subtitle}>Share your fav reads</Text>
          </View>

          {/* Error message */}
          {error && (
            <ErrorMessage
              message={error}
              success={false}
              onDismiss={handleDismissMessage}
            />
          )}

          {/* Success message */}
          {successMessage && (
            <ErrorMessage
              message={successMessage}
              success={true}
              onDismiss={handleDismissMessage}
            />
          )}

          <View style={styles.formContainer}>
            {/* username input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={COLORS.placeholderText}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* email input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* password input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* submit button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
