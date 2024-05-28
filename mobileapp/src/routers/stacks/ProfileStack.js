import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../../screens/Profile/EditProfile';
import TrainingPoint from '../../screens/Profile/TrainingPoint';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Trang cá nhân' }} />
            <Stack.Screen name="TrainingPoint" component={TrainingPoint} options={{ title: 'Điểm rèn luyện' }} />
        </Stack.Navigator>
    );
};

export default ProfileStack;
