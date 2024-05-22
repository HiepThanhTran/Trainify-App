import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import { HomeStack, ProfileStack } from './Stacks';

const Tab = createBottomTabNavigator();

const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={() => ({
                tabBarActiveTintColor: 'navy',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    title: 'Trang chủ',
                    tabBarIcon: () => <Icon color="gray" size={35} source="home" />,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="Notification"
                component={HomeStack}
                options={{
                    title: 'Thông báo',
                    tabBarIcon: () => <Icon color="gray" size={35} source="bell" />,
                    tabBarBadge: 3,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    title: 'Profile',
                    tabBarIcon: () => <Icon color="gray" size={35} source="account" />,
                }}
            ></Tab.Screen>
        </Tab.Navigator>
    );
};

export default MainTab;
