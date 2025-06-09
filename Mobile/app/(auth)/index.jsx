//login page
import { TextInput } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "../../assets/styles/login.styles";
import { useState } from "react";
import { Image } from "expo-image";
import COLORS from "../../constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Pressable } from "react-native";
import { Link } from "expo-router";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/Book.png")}
            style={styles.illustrationImage}
            resizemode="contain"
          />
        </View>
        <View style={styles.card}>
          <View style={styles.formContainer}>
            {/*email input*/}
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
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/*password input*/}
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
                  secureTextEntry={!showpassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showpassword)}
                >
                  <Ionicons
                    name={showpassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </Pressable>
              </View>
            </View>

            {/*login button*/}
            <Pressable
              style={styles.button}
              onPress={handleLogin}
              disabled={isloading}
            >
              {isloading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </Pressable>
            {/*forgot password link*/}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Link href="/signup" asChild>
                <Pressable>
                  <Text style={styles.footerLink}>Sign Up</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
