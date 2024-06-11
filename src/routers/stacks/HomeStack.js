import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivityDetail from '../../screens/home/ActivityDetail';
import BulletinDetail from '../../screens/home/BulletinDetail';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="BulletinDetail" component={BulletinDetail} />
         <Stack.Screen name="ActivityDetail" component={ActivityDetail} />
      </Stack.Navigator>
   );
};

export default HomeStack;
