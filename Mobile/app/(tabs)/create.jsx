import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles.js";
import IonIcons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import COLORS from "../../constants/colors";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/authStore.js";
import { API_URL } from "../../constants/api.js";
import * as ImageManipulator from "expo-image-manipulator";

export default function create() {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const router = useRouter();

  const { token } = useAuthStore();

 const pickImage = async () => {
    try {
      console.log("🖼️ Starting image picker...");

      if (Platform.OS === "android" || Platform.OS === "ios") {
        console.log("📱 Requesting media library permissions...");
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        console.log("🔐 Permission status:", status);

        if (status !== "granted") {
          console.log("❌ Permission denied");
          Alert.alert(
            "Permission Required",
            "Camera permission is required to take photos."
          );
          return;
        }
      }

      console.log("🚀 Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
        ...(Platform.OS === "web" && {
          allowsMultipleSelection: false,
        }),
      });

      console.log("📸 Image picker result:", {
        canceled: result.canceled,
        assetsCount: result.assets?.length || 0,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        console.log("🖼️ Selected asset details:", {
          uri: selectedAsset.uri,
          width: selectedAsset.width,
          height: selectedAsset.height,
          fileSize: selectedAsset.fileSize,
        });

        setImage(selectedAsset.uri);

        console.log("🔄 Starting image manipulation...");
        // Resize and compress the image
        const manipulated = await ImageManipulator.manipulateAsync(
          selectedAsset.uri,
          [{ resize: { width: 800 } }],
          {
            compress: 0.4,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        console.log("✨ Image manipulation complete:", {
          base64Length: manipulated.base64?.length || 0,
        });

        setImageBase64(manipulated.base64);
        console.log("✅ Image processing successful");
      } else {
        console.log("🚫 Image selection canceled by user");
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
      Alert.alert("Error", "Failed to open image picker. Please try again.");
    }
  };

  const removeImage = () => {
    console.log("🗑️ Removing selected image");
    setImage(null);
    setImageBase64("");
    console.log("✅ Image removed successfully");
  };

  const renderStars = () => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starButton}
            onPress={() => {
              console.log(`⭐ Rating set to: ${star}`);
              setRating(star);
            }}
          >
            <IonIcons
              name={star <= rating ? "star" : "star-outline"}
              size={24}
              color={star <= rating ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const showSuccessAlert = () => {
    Alert.alert(
      "🎉 Success!",
      "Your book recommendation has been published successfully! 📚✨",
      [
        {
          text: "okey",
          onPress: () => {
            console.log("✅ User acknowledged success");
            router.push("/");
          },
          style: "default",
        },
      ],
      { cancelable: false }
    );
  };

  const handelSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      console.log("❌ Form validation failed - missing required fields");
      Alert.alert("Error", "Please fill the fields");
      return;
    }

    try {
      console.log("⏳ Setting loading state to true");
      setLoading(true);

      console.log("🔍 Processing image details...");
      const uriparts = image.split(".");
      const filetype = uriparts[uriparts.length - 1];
      const imageType = filetype
        ? `image/${filetype.toLowerCase()}`
        : "image/jpeg";

      console.log("🖼️ Image processing details:", {
        originalUri: image,
        filetype: filetype,
        imageType: imageType,
        base64Length: imageBase64?.length || 0,
      });

      const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;

      const requestBody = {
        title,
        caption,
        rating: rating.toString(),
        image: imageDataUrl,
      };

      console.log("📤 Preparing API request:", {
        url: `${API_URL}/books`,
        method: "POST",
        bodySize: JSON.stringify(requestBody).length,
        hasToken: !!token,
      });

      console.log("🌐 Making API call...");
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const Data = await response.json();

      if (!response.ok) {
        console.error("❌ Backend error:", {
          status: response.status,
          data: Data,
          message: Data.message || "Unknown error",
        });
        throw new Error(Data.message || "Upload failed");
      }

      console.log("✅ API Success:", Data);
      console.log("🎉 Upload completed successfully!");

      // Show enhanced success alert
      showSuccessAlert();

      // Reset form
      console.log("🔄 Resetting form fields...");
      setTitle("");
      setCaption("");
      setImage(null);
      setImageBase64("");
      setRating(0);
      console.log("✅ Form reset complete");
    } catch (error) {
      console.error("❌ Error creating post:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      Alert.alert(
        "❌ Upload Failed",
        error.message || "Something went wrong. Please try again.",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      console.log("🏁 Setting loading state to false");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite book with the community
            </Text>
          </View>

          <View style={styles.form}>
            {/* Book title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <View style={styles.inputContainer}>
                <IonIcons
                  name="book-outline"
                  size={24}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                  }}
                />
              </View>
            </View>

            {/* Rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderStars()}
            </View>

            {/* Image upload */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Cover</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.previewImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={removeImage}
                    >
                      <IonIcons
                        name="close-circle"
                        size={24}
                        color={COLORS.danger || "#FF6B6B"}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <IonIcons
                      name="image-outline"
                      size={48}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      {Platform.OS === "web"
                        ? "Tap to select book cover from gallery"
                        : "Tap to select book cover"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>About the Book</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us what you loved about this book, why you'd recommend it, key themes, or anything that might help others decide if it's for them..."
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={(text) => {
                  setCaption(text);
                }}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Publish Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handelSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesome
                    name="spinner"
                    size={20}
                    color={COLORS.white}
                    style={[styles.buttonIcon, { marginRight: 8 }]}
                  />
                  <Text style={styles.buttonText}>Publishing...</Text>
                </>
              ) : (
                <>
                  <FontAwesome
                    name="send"
                    size={18}
                    color={COLORS.white}
                    style={[styles.buttonIcon, { marginRight: 8 }]}
                  />
                  <Text style={styles.buttonText}>Publish your book</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
