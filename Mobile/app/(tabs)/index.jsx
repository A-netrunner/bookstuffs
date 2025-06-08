import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(168, 153, 153)',
  },

  text: {
    color: 'white',
    fontSize: 60,
    fontVariant: ['tabular-nums'],
    fontWeight: 'bold',
  },
});