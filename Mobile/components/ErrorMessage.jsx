import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import COLORS from "../constants/colors";

const ErrorMessage = ({ message, success = false, onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (message) {
      // Start animation when message appears
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        hideMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const hideMessage = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  if (!message) return null;

  const emoji = success ? "✅" : "❌";

  return (
    <Animated.View
      style={[
        styles.container,
        success ? styles.successContainer : styles.errorContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={success ? "Success message" : "Error message"}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successContainer: {
    backgroundColor: COLORS.primary,
  },
  errorContainer: {
    backgroundColor: "#e17055",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  text: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
});

export default ErrorMessage;
