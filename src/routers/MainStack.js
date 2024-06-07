import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTab from './MainTab';
import HomeStack from './stacks/HomeStack';
import NotificationStack from './stacks/NotificationStack';
import ProfileStack from './stacks/ProfileStack';

const Stack = createNativeStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTab" component={MainTab} />
            <Stack.Screen name="HomeStack" component={HomeStack} />
            <Stack.Screen name="NotificationStack" component={NotificationStack} />
            <Stack.Screen name="ProfileStack" component={ProfileStack} />
        </Stack.Navigator>
    );
};

export default MainStack;
