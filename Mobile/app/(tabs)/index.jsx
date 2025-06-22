//home.jsx or index.jsx

import { View, Text, TouchableOpacity } from 'react-native'

import { useAuthStore } from '../../store/authStore'

export default function index() {

  const {logout} = useAuthStore();

  return (
    <View>
      <Text>index</Text>

      <TouchableOpacity onPress={logout}>
        <Text>LogOUT </Text>
      </TouchableOpacity>
    </View>
  )
}