import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../../screens/Profile/EditProfile';
import TrainingPoint from '../../screens/Profile/TrainingPoint';
import Test from '../../screens/Test';
import Theme from '../../styles/Theme';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Theme.PrimaryColor },
                headerTintColor: 'white',
            }}
        >
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Trang cá nhân' }} />
            <Stack.Screen name="TrainingPoint" component={TrainingPoint} options={{ title: 'Điểm rèn luyện' }} />
            <Stack.Screen name="Test" component={Test} options={{ title: 'Test' }} />
        </Stack.Navigator>
    );
};

export default ProfileStack;
