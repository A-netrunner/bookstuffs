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
    if (Platform.OS === "android" || Platform.OS === "ios") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos."
        );
        return;
      }
    }

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

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);

      

  //     if (result.assets[0].base64) {
  //       setImageBase64(result.assets[0].base64);
  //     } else {
  //       const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
  //         encoding: FileSystem.EncodingType.Base64,
  //       });
  //       setImageBase64(base64);
  //     }
  //   }
  // } catch (error) {
  //   console.error("Error picking image:", error);
  //   Alert.alert("Error", "Failed to open image picker. Please try again.");
  // }


if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset.uri);

      // Resize and compress the image
      const manipulated = await ImageManipulator.manipulateAsync(
        selectedAsset.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      setImageBase64(manipulated.base64);
    }
  } catch (error) {
    console.error("Error picking image:", error);
    Alert.alert("Error", "Failed to open image picker. Please try again.");
  }


};


  const removeImage = () => {
    setImage(null);
    setImageBase64("");
  };

  const handelSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Error", "Please fill the fields");
      return;
    }

    try {
      setLoading(true);

      const uriparts = image.split(".");
      const filetype = uriparts[uriparts.length - 1];
      const imageType = filetype ? `image/${filetype.toLowerCase()}` : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch('http://localhost:8000/api/books', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          image: imageDataUrl,
        }),
      });

      const Data = await response.json();
      console.log("yippe : ", Data);

      Alert.alert("Success", "Book is posted yippee!!!!");
      setTitle("");
      setCaption("");
      setImage(null);
      setImageBase64(null);
      setRating(3);
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starButton}
            onPress={() => setRating(star)}
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
                  onChangeText={setTitle}
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
                    <Image source={{ uri: image }} style={styles.previewImage} />
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
                onChangeText={setCaption}
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
                <Text style={styles.buttonText}>Publishing...</Text>
              ) : (
                <>
                  <IonIcons
                    name="send-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
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
