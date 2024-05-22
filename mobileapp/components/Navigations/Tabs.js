import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import { HomeStack, NotificationStack, ProfileStack } from './Stacks';

const Tab = createBottomTabNavigator();

const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={() => ({
                tabBarActiveTintColor: '#3e9ae4',
                tabBarInactiveTintColor: 'black',
              
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="home" />,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="Notification"
                component={NotificationStack}
                options={{
                    tabBarBadge: 3,
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="bell" />,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="account" />,
                }}
            ></Tab.Screen>
        </Tab.Navigator>
    );
};

export default MainTab;
