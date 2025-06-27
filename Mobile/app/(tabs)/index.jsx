import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_URL } from "../../constants/api";
import { Image } from "expo-image";
import styles from "../../assets/styles/home.styles";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import Loader from "../../components/Loader";

export default function index() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
 


  const fetchBooks = async (pageNum = 1, refresh = false) => {
   

    try {

      if (!token) return;

      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=2`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "faild to fetch books data");

      const uniqueBooks =
        refresh || pageNum === 1
          ? data.books
          : Array.from(
              new Set([...books, ...data.books].map((book) => book._id))
            ).map((id) =>
              [...books, ...data.books].find((book) => book._id === id)
            );
      setBooks(uniqueBooks);

      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.log("error fetching books 2 ", error);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
    
  };

  useEffect(() => {
    if (token) fetchBooks();
  }, [token]);

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
    const nextPage = page + 1;
    await sleep(1000);
    await fetchBooks(nextPage);
    setPage(nextPage); 
  }
  };

  const renderStars = (count) => {
    return (
      <View style={{ flexDirection: "row", marginTop: 4 }}>
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
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user?.profilePic }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image
          source={item.image}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>

      <Text style={styles.bookTitle}> {item.title}</Text>
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.rating}>{renderStars(item.rating)}</Text>
    </View>
  );

  if (loading) return <Loader size="large" />;
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        refreshControl={<RefreshControl
        refreshing={refreshing}
        onRefresh={()=> fetchBooks(1,true)}
        
        />}
        onEndReachedThreshold={0.8}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}

        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bookverse</Text>
            <Text>Welcome to Bookverse</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            ></Ionicons>
            <Text style={styles.emptyText}> No recommendations yet</Text>
            <Text style={styles.emptySubtext}>be first to share a book!</Text>
          </View>
        }
      />
    </View>
  );
}
