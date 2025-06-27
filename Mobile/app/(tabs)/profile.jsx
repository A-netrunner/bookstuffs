import { View, Text, Alert, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import { Image } from "expo-image";
import styles from "../../assets/styles/profile.styles.js";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import COLORS from "../../constants/colors.js";
import moment from "moment";

export default function ProfileScreen() {
  const { token, user, logout } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch books");
      setBooks(data);
    } catch (error) {
      console.error("Error fetching profile books:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
     if (typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        console.log("Logout confirmed"); // Debug log
        logout();
      }
    } else {
      // Mobile/native Alert
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => {
            console.log("Logout pressed"); // Debug log
            logout();
          }
        },
      ]);
    }
  };

  const handleDelete = (id) => {
  if (typeof window !== 'undefined' && window.confirm) {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (confirmed) {
      deleteBook(id);
    }
  } else {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteBook(id),
      },
    ]);
  }
};

const deleteBook = async (id) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Delete failed");
    setBooks((prev) => prev.filter((book) => book._id !== id));
  } catch (error) {
    console.error("Delete error:", error);
  }
};


  useEffect(() => {
    if (token) fetchUserBooks();
  }, [token]);

  const renderStars = (count) => (
    <View style={styles.ratingContainer}>
      {Array.from({ length: Number(count) }, (_, i) => (
        <FontAwesome
          key={i}
          name="star"
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user?.profilePic }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.memberSince}>
            Member since {moment(user?.createdAt).format("MMMM YYYY")}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </Text>
      </View>

      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No books shared yet</Text>
          <Text style={styles.emptyText}>Start sharing your favorites!</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Your First Book</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.booksList} showsVerticalScrollIndicator={false}>
          {books.map((item) => (
            <View key={item._id} style={styles.bookItem}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.bookImage} 
                contentFit="cover" 
              />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {renderStars(item.rating)}
                <Text style={styles.bookCaption} numberOfLines={2}>
                  {item.caption}
                </Text>
                <Text style={styles.bookDate}>
                  {moment(item.createdAt).format("MMM DD, YYYY")}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleDelete(item._id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}