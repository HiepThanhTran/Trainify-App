import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import MainTab from './components/Navigation/Tabs';
import useFonts from './configs/Fonts';
import { AccountProvider, useAccount } from './contexts/AccountContext';
import GlobalStyle from './styles/Style';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
    const account = useAccount();

    return (
        <RootStack.Navigator>
            {/* <RootStack.Screen name="Onboaring" options={{ headerShown: false }} component={Onboarding} /> */}
            {account.isLoggedIn === false ? (
                <>
                    <RootStack.Screen name="Signin" options={{ headerShown: false }} component={Signin} />
                    <RootStack.Screen name="Signup" options={{ headerShown: false }} component={Signup} />
                </>
            ) : (
                <RootStack.Screen name="MainTab" options={{ headerShown: false }} component={MainTab} />
            )}
        </RootStack.Navigator>
    );
};

export default function App() {
    const fontsLoaded = useFonts();

    return (
        <>
            {!fontsLoaded ? (
                <View style={GlobalStyle.Center}>
                    <ActivityIndicator size="large" color="#3e9ae4" />
                </View>
            ) : (
                <NavigationContainer>
                    <AccountProvider>
                        <RootNavigator />
                    </AccountProvider>
                </NavigationContainer>
            )}
        </>
    );
}
