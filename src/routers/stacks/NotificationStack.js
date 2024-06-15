import { createStackNavigator } from '@react-navigation/stack';
import NotificationDetail from '../../screens/notification/NotificationDetail';

const Stack = createStackNavigator();

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
