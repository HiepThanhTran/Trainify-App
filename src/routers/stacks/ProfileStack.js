import { createStackNavigator } from '@react-navigation/stack';
import CreateActivityForm from '../../components/profile/ActivitySettings/CreateActivityForm';
import EditActivityForm from '../../components/profile/ActivitySettings/EditActivityForm';
import ReportForm from '../../components/profile/TrainingPoints/ReportForm';
import ActivitySettings from '../../screens/profile/ActivitySettings';
import EditProfile from '../../screens/profile/EditProfile';
import TrainingPoints from '../../screens/profile/TrainingPoints';
import RegisterAssistants from '../../screens/profile/RegisterAssistants';
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
               name="RegisterAssistants"
               component={RegisterAssistants}
               options={{ title: 'Đăng ký tài khoản' }}
            />
         </Stack.Group>

         <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TrainingPoint" component={TrainingPoints} />
         </Stack.Group>

         <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="ReportForm" component={ReportForm} />
            <Stack.Screen
               name="CreateActivityForm"
               component={CreateActivityForm}
               options={{ title: 'Tạo hoạt động' }}
            />
            <Stack.Screen
               name="EditActivityForm"
               component={EditActivityForm}
               options={{ title: 'Chỉnh sửa hoạt động' }}
            />
         </Stack.Group>
      </Stack.Navigator>
   );
};

export default ProfileStack;
