import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationDetail from '../../screens/Notification/NotificationDetail';
import Theme from '../../styles/Theme';

const Stack = createNativeStackNavigator();

const NotificationStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Theme.PrimaryColor },
                headerTintColor: 'white',
            }}
        >
            <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
        </Stack.Navigator>
    );
};

export default NotificationStack;
