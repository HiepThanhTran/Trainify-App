import { createStackNavigator } from '@react-navigation/stack';
import CreateActivityForm from '../../components/profile/CreateActivityForm';
import ReportForm from '../../components/profile/TrainingPoints/ReportForm';
import ActivitySettings from '../../screens/profile/ActivitySettings';
import EditProfile from '../../screens/profile/EditProfile';
import TrainingPoints from '../../screens/profile/TrainingPoints';
import Theme from '../../styles/Theme';

const Stack = createStackNavigator();

const ProfileStack = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerStyle: { backgroundColor: Theme.PrimaryColor },
            headerTintColor: 'white',
         }}
      >
         <Stack.Group>
            <Stack.Screen
               name="EditProfile"
               component={EditProfile}
               options={({ route }) => ({ title: route?.params?.fullName ?? 'Trang cá nhân' })}
            />
            <Stack.Screen
               name="ActivitySettings"
               component={ActivitySettings}
               options={{ title: 'Quản lý hoạt động' }}
            />
            <Stack.Screen
               name="CreateActivityForm"
               component={CreateActivityForm}
               options={{ title: 'Tạo hoạt động' }}
            />
         </Stack.Group>

         <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TrainingPoint" component={TrainingPoints} />
         </Stack.Group>

         <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="ReportForm" component={ReportForm} />
         </Stack.Group>
      </Stack.Navigator>
   );
};

export default ProfileStack;
