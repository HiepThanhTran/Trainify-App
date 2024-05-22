import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import MainTab from './components/Navigations/Tabs';
import useFonts from './configs/Fonts';
import GlobalStyle from './styles/Style';

const RootStack = createNativeStackNavigator();

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
                    <RootStack.Navigator>
                        <RootStack.Screen name="MainTab" options={{ headerShown: false }} component={MainTab} />
                        <RootStack.Screen name="Signin" options={{ headerShown: false }} component={Signin} />
                        <RootStack.Screen name="Signup" options={{ headerShown: false }} component={Signup} />
                    </RootStack.Navigator>
                </NavigationContainer>
            )}
        </>
    );
}
