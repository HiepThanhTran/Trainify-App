import { createStackNavigator } from '@react-navigation/stack';
import MainTab from './MainTab';
import ChatStack from './Stacks/ChatStack';
import HomeStack from './Stacks/HomeStack';
import NotificationStack from './Stacks/NotificationStack';
import ProfileStack from './Stacks/ProfileStack';

const Stack = createStackNavigator();

const MainStack = () => {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="MainTab" component={MainTab} />
         <Stack.Screen name="HomeStack" component={HomeStack} />
         <Stack.Screen name="NotificationStack" component={NotificationStack} />
         <Stack.Screen name="ProfileStack" component={ProfileStack} />
         <Stack.Screen name="ChatStack" component={ChatStack} />
      </Stack.Navigator>
   );
};

export default MainStack;
