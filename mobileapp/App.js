import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import MainTab from './components/Navigations/Tabs';
import { AccountProvider, useAccount } from './configs/Context';
import useFonts from './configs/Fonts';
import { persistor, store } from './configs/Store';
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
                <>
                    <RootStack.Screen name="MainTab" options={{ headerShown: false }} component={MainTab} />
                    <RootStack.Screen
                        name="BulletinDetail"
                        options={{ headerShown: false }}
                        component={BulletinDetail}
                    />
                </>
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
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <NavigationContainer>
                            <AccountProvider>
                                <RootNavigator />
                            </AccountProvider>
                        </NavigationContainer>
                    </PersistGate>
                </Provider>
            )}
        </>
    );
}
