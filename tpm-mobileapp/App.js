import { ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import Fonts from "./assets/fonts/Fonts";
import Onboarding from "./components/Onboarding/Onboarding";
import Home from "./components/Home/Home";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  //Loading Fonts
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadAsyncFonts = async () => {
      await Fonts();
      setFontsLoaded(true);
    };

    loadAsyncFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator />
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={Onboarding} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
