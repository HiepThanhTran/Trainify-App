import { createStackNavigator } from '@react-navigation/stack';
import Theme from '../../Styles/Theme';

const Stack = createStackNavigator();

const NotificationStack = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerStyle: { backgroundColor: Theme.PrimaryColor },
            headerTintColor: 'white',
            headerShown: false,
         }}
      ></Stack.Navigator>
   );
};

export default NotificationStack;
