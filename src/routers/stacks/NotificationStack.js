import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationDetail from '../../screens/notification/NotificationDetail';

const Stack = createNativeStackNavigator();

const NotificationStack = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerStyle: { backgroundColor: Theme.PrimaryColor },
            headerTintColor: 'white',
            headerShown: false,
         }}
      >
         <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
      </Stack.Navigator>
   );
};

export default NotificationStack;
