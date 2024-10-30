import GlobalProvider from "@/context/GlobalProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GlobalProvider>

    <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="(auth)" options={{headerShown: false}} />
        <Stack.Screen name="(station)" options={{headerShown: false}} />
        <Stack.Screen name="profile" options={{headerShown: false}} />
        <Stack.Screen name="main" options={{headerShown: false}} />
    </Stack>
    </GlobalProvider>
  );
}
