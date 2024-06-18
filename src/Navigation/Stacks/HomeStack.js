import { createStackNavigator } from '@react-navigation/stack';
import ActivityDetails from '../../Screens/Home/ActivityDetails';
import BulletinDetails from '../../Screens/Home/BulletinDetails';

const Stack = createStackNavigator();

const HomeStack = () => {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="BulletinDetail" component={BulletinDetails} />
         <Stack.Screen name="ActivityDetail" component={ActivityDetails} />
      </Stack.Navigator>
   );
};

export default HomeStack;
