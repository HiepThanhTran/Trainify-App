import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import SignIn from '../../screens/Auth/SignIn';
import SignUp from '../../screens/Auth/SignUp';
import Splash from '../../screens/Splash/Splash';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    const [splash, setSplash] = useState(true);

    const checkSplashDone = async () => {
        const splashDone = await AsyncStorage.getItem('splash-done');
        if (splashDone) setSplash(false);
    };

    useEffect(() => {
        checkSplashDone();
    }, []);

    return (
        <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
            {splash && <Stack.Screen name="Splash" component={Splash} />}
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
    );
}
