import { Text, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Expo Router!</Text>
      <Text>Open app/index.jsx to start working on your app!</Text>

      <Image source={require("../assets/images/Bibliophile-bro.svg")}
        style={{ width: 200, height: 200, marginTop: 20 }}
        contentFit="cover"
        transition={1000}
      />
    </View>
      
    
  );
}


const styles  =  StyleSheet.create({
container:{
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}, title: {
  color: "blue",
  fontSize: 20,
},
})