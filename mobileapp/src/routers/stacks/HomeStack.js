import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivityDetail from '../../components/Activity/ActivityDetail';
import BulletinDetail from '../../components/Activity/BulletinDetail';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BulletinDetail"
                component={BulletinDetail}
                options={({ route }) => ({ title: route?.params.title })}
            />
            <Stack.Screen
                name="ActivityDetail"
                component={ActivityDetail}
                options={({ route }) => ({ title: route?.params.name })}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
