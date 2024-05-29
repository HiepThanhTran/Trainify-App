import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ActivityDetail from '../../components/Activity/ActivityDetail';
import BulletinDetail from '../../components/Activity/BulletinDetail';
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
