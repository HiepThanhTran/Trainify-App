import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../Auth/Profile';
import Notification from '../Home/Notification';
import Bulletin from '../Activity/Bulletin';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeStack" options={{ headerShown: false }} component={Bulletin} />
        </Stack.Navigator>
    );
};

export const NotificationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="NotificationStack" options={{ headerShown: false }} component={Notification} />
        </Stack.Navigator>
    );
};

export const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileStack" options={{ headerShown: false }} component={Profile} />
        </Stack.Navigator>
    );
};
