import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import useRoleMiddleware from '@/hooks/useRoleMiddleware';

const StationLayout = () => {
    const isAuthorized = useRoleMiddleware('owner');
    if (!isAuthorized) return null;
    return (
        <Stack>
        <Stack.Screen name="station-main" options={{ headerShown: false}} />
        <Stack.Screen name="station-details" options={{ headerShown: false}} />
        <Stack.Screen name="add-charger" options={{ headerShown: false}} />
        <Stack.Screen name="edit-charger" options={{ headerShown: false}} />
        <Stack.Screen name="create-station-request" options={{ headerShown: false}} />
        <Stack.Screen name="main" options={{ headerShown: false}} />

      </Stack>
      )
}

export default StationLayout