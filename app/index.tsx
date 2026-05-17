import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/run");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Image source={require("../assets/images/run_logo.png")}
        style={{
          width: "50%",
          height: 240,
          marginHorizontal: "auto",
        }}
        resizeMode="cover"
      />
      <Text
        style={{
          fontSize: 32,
          color: "#444",
          textAlign: "center",
          marginTop: 20,
          fontFamily: "Kanit_600SemiBold"
        }}
      >Run Tracker</Text>
      <Text
        style={{
          fontSize: 20,
          color: "#666",
          textAlign: "center",
          fontFamily: "Kanit_400Regular"
        }}
      >วิ่งเพื่อสุขภาพ</Text>
      <ActivityIndicator
        size="large"
        color="#555"
        style={{
          marginTop: 30,
        }}
      />
    </View>
  );
}
