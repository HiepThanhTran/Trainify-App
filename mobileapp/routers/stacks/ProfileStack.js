import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../../screens/Profile/EditProfile';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Trang cá nhân' }} />
        </Stack.Navigator>
    );
};

export default ProfileStack;
