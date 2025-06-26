import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../store/authStore'

export default function profile() {

  const {logout} = useAuthStore();
  return (
    <View>
      <Text onPress={logout}>logout</Text>
    </View>
  )
}