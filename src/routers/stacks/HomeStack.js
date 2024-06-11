import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivityDetails from '../../screens/home/ActivityDetails';
import BulletinDetails from '../../screens/home/BulletinDetails';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="BulletinDetail" component={BulletinDetails} />
         <Stack.Screen name="ActivityDetail" component={ActivityDetails} />
      </Stack.Navigator>
   );
};

export default HomeStack;
