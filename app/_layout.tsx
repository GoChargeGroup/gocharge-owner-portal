import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import GlobalProvider from "@/context/GlobalProvider";
import { Stack, useRouter } from "expo-router";
import { icons } from '@/constants';

export default function RootLayout() {
  const router = useRouter();

  // Function to handle redirection to the index page
  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <GlobalProvider>
      <View style={styles.container}>
        {/* Redirect to Index */}
        <TouchableOpacity onPress={handleRedirect} style={styles.redirectButton}>
          <Image 
            source={ icons.light }
            style={styles.logo}
          />
         
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
  },
  redirectButton: {
    alignSelf: 'center',
    padding: 10,
    marginVertical: 20,
  },
  logo: {
    width: 100, 
    height: 100,
    resizeMode: 'contain',
  },
  redirectText: {
    fontSize: 16,
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});
