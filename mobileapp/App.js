import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useReducer } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import MainTab from './components/Navigations/Tabs';
import { AccountContext, DispatchContext } from './configs/Contexts';
import useFonts from './configs/Fonts';
import { UserReducer } from './configs/Reducers';
import GlobalStyle from './styles/Style';

const RootStack = createNativeStackNavigator();

export default function App() {
    const [user, dispatch] = useReducer(UserReducer, null);
    const fontsLoaded = useFonts();

    return (
        <>
            {!fontsLoaded ? (
                <View style={GlobalStyle.Container}>
                    <ActivityIndicator size="large" color="#3e9ae4" />
                </View>
            ) : (
                <NavigationContainer>
                    <AccountContext.Provider value={user}>
                        <DispatchContext.Provider value={dispatch}>
                            <RootStack.Navigator>
                                {/* <RootStack.Screen name="Onboaring" options={{ headerShown: false }} component={Onboarding} /> */}
                                <RootStack.Screen name="Signin" options={{ headerShown: false }} component={Signin} />
                                <RootStack.Screen name="Signup" options={{ headerShown: false }} component={Signup} />
                                <RootStack.Screen name="MainTab" options={{ headerShown: false }} component={MainTab} />
                            </RootStack.Navigator>
                        </DispatchContext.Provider>
                    </AccountContext.Provider>
                </NavigationContainer>
            )}
        </>
    );
}
