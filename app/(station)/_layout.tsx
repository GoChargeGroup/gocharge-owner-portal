import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const StationLayout = () => {
    return (
        <Stack>
        <Stack.Screen name="station-main" options={{ headerShown: false}} />
        <Stack.Screen name="create-station-request" options={{ headerShown: false}} />
      </Stack>
      )
}

export default StationLayout