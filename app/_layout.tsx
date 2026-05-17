import {
  Kanit_400Regular,
  Kanit_600SemiBold,
  Kanit_700Bold,
  useFonts
} from "@expo-google-fonts/kanit";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_600SemiBold,
    Kanit_700Bold
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: "#2595ff"
      },
      headerTitleStyle: {
        fontSize: 24,
        color: "#fff",
        fontFamily: "Kanit_600SemiBold"
      },
      headerTitleAlign: "center",
      headerTintColor: "#fff",
      headerBackButtonDisplayMode: "minimal"
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ title: "เพิ่มรายการวิ่ง" }} />
      <Stack.Screen name="run" options={{ title: "Run Tracker V.1.0.0" }} />
      <Stack.Screen name="[id]" options={{ title: "รายละเอียดการวิ่ง" }} />
    </Stack>
  )
}
