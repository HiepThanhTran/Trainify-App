import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import MainTab from './components/Navigations/Tabs';
import useFonts from './configs/Fonts';
import GlobalStyle from './styles/Style';

export default function App() {
    const fontsLoaded = useFonts();

    return (
        <>
            {!fontsLoaded ? (
                <View style={GlobalStyle.Container}>
                    <ActivityIndicator size="large" color="#3e9ae4" />
                </View>
            ) : (
                <NavigationContainer>
                    <MainTab />
                    {/* <Stack.Navigator initialRouteName="Login">
                        <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={Onboarding} />
                        <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
                        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
                        <Stack.Screen name="Signup" options={{ headerShown: false }} component={Signup} />
                    </Stack.Navigator> */}
                </NavigationContainer>
            )}
        </>
    );
}
