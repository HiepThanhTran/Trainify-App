import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Home/Home';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
        </Stack.Navigator>
    );
};

export const NotificationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Notification" options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }} component={Home} />
            {/* <Stack.Screen name="Login" options={{ headerShown: false }} component={Signin} />
            <Stack.Screen name="Signup" options={{ headerShown: false }} component={Signup} /> */}
        </Stack.Navigator>
    );
};
