import { createStackNavigator } from '@react-navigation/stack';
import ActivityDetails from '../../screens/home/ActivityDetails';
import BulletinDetails from '../../screens/home/BulletinDetails';

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
