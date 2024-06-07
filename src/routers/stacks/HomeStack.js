import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivityDetail from '../../screens/home/ActivityDetail';
import BulletinDetail from '../../screens/home/BulletinDetail';
import Theme from '../../styles/Theme';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerStyle: { backgroundColor: Theme.PrimaryColor },
            headerTintColor: 'white',
         }}
      >
         <Stack.Screen
            name="BulletinDetail"
            component={BulletinDetail}
            options={({ route }) => ({ title: route?.params?.name ?? 'Chi tiết bản tin' })}
         />
         <Stack.Screen
            name="ActivityDetail"
            component={ActivityDetail}
            options={({ route }) => ({ title: route?.params?.name ?? 'Chi tiết hoạt động' })}
         />
      </Stack.Navigator>
   );
};

export default HomeStack;
