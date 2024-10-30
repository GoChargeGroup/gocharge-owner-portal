import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import GlobalProvider from "@/context/GlobalProvider";
import { Stack, useRouter } from "expo-router";
import { icons } from '@/constants';

export default function RootLayout() {
  const router = useRouter();

  // Function to handle redirection to the index page
  const handleRedirectToIndex = () => {
    router.push('/');
  };
  const handleRedirectToMain = () => {
    router.push('(station)/main');
  };
  return (
    <GlobalProvider>
      <View style={styles.container}>
        {/* Top Left - Redirect to Index */}
        <TouchableOpacity onPress={handleRedirectToIndex} style={styles.topLeftIcon}>
          <Image source={icons.light} style={styles.iconImage} />
        </TouchableOpacity>

        {/* Top Right - Redirect to Main */}
        <TouchableOpacity onPress={handleRedirectToMain} style={styles.topRightIcon}>
          <Image source={icons.home} style={styles.iconImage} />
        </TouchableOpacity>

        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(station)" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
      </View>
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  topLeftIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  topRightIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  iconImage: {
    width: 30, 
    height: 30,
    resizeMode: 'contain',
  },
});
