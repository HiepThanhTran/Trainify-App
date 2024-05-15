import {ActivityIndicator, View} from "react-native";
import {useEffect, useState} from "react";
import Fonts from "./assets/fonts/Fonts";
import Login from "./components/LoginAndRegister/Login";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import MyStyles from "./styles/MyStyles";

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
        return (
            <View style={MyStyles.Container}>
                <ActivityIndicator size="100" color="#1873bc"/>
            </View>
        );
    }
    return (
        // <NavigationContainer>
        //   <Stack.Navigator initialRouteName="Onboarding">
        //     <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={Onboarding} />
        //     <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
        //   </Stack.Navigator>
        // </NavigationContainer>

        <Login/>
    )
}
