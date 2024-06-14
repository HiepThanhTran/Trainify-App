import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivitySettings from '../../screens/profile/ActivitySettings';
import EditProfile from '../../screens/profile/EditProfile';
import TrainingPoint from '../../screens/profile/TrainingPoint';
import Theme from '../../styles/Theme';
import CreateActivityForm from '../../components/profile/CreateActivityForm';
import UpdateAndDeleteActivity from '../../components/profile/UpdateAnDeleteActivity';

const Stack = createNativeStackNavigator();
const ProfileStack = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerStyle: { backgroundColor: Theme.PrimaryColor },
            headerTintColor: 'white',
         }}
      >
         <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={({ route }) => ({ title: route?.params?.full_name ?? 'Trang cá nhân' })}
         />
         <Stack.Screen name="TrainingPoint" component={TrainingPoint} options={{ title: 'Điểm rèn luyện' }} />
         <Stack.Screen name="ActivitySettings" component={ActivitySettings} options={{ title: 'Quản lý hoạt động' }} />
         <Stack.Screen name="CreateActivityForm" component={CreateActivityForm} options={{ title: 'Tạo hoạt động' }} />
         <Stack.Screen name="UpdateAndDeleteActivity" component={UpdateAndDeleteActivity} options={{ title: 'Chi tiết hoạt động' }} />
      </Stack.Navigator>
   );
};

export default ProfileStack;