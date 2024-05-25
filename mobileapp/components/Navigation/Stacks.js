import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Bulletin from '../Activity/Bulletin';
import BulletinDetail from '../Activity/BulletinDetail';
import Notification from '../Notification/Notification';
import Profile from '../Profile/Profile';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Bulletin" options={{ headerShown: false }} component={Bulletin} />
            <Stack.Screen name="BulletinDetail" options={{ headerShown: false }} component={BulletinDetail} />
        </Stack.Navigator>
    );
};

export const NotificationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Notification" options={{ headerShown: false }} component={Notification} />
        </Stack.Navigator>
    );
};

export const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" options={{ headerShown: false }} component={Profile} />
        </Stack.Navigator>
    );
};
