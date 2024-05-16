import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import MyStyles from "./styles/MyStyles";
import useFonts from "./configs/Fonts";
import Home from "./components/Home/Home";
import Onboarding from "./components/Onboarding/Onboarding";
import Login from "./components/LoginAndSignup/Login";
import Signup from "./components/LoginAndSignup/Signup";


const Stack = createNativeStackNavigator();

export default function App() {
    const fontsLoaded = useFonts();
    if (!fontsLoaded) {
        return (
            <View style={MyStyles.Container}>
                <ActivityIndicator size="large" color="#3e9ae4" />
            </View>
        );
    }
    else
    {
        return (
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login">
                {/* <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={Onboarding} /> */}
                {/* <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} /> */}
                <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
                <Stack.Screen name="Signup" options={{ headerShown: false }} component={Signup} />
              </Stack.Navigator>
            </NavigationContainer>
        )
    }
}
