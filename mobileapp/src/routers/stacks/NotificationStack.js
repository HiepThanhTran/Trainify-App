import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationDetail from '../../screens/Notification/NotificationDetail';

const Stack = createNativeStackNavigator();

const NotificationStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
        </Stack.Navigator>
    );
};

export default NotificationStack;
