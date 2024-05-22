import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import { HomeStack, NotificationStack, ProfileStack } from './Stacks';

const Tab = createBottomTabNavigator();

const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={() => ({
                tabBarActiveTintColor: 'navy',
                tabBarInactiveTintColor: 'black',
              
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    title: 'Trang chủ',
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="home" />,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="NotificationTab"
                component={NotificationStack}
                options={{
                    title: 'Thông báo',
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="bell" />,
                    tabBarBadge: 3,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="account" />,
                }}
            ></Tab.Screen>
        </Tab.Navigator>
    );
};

export default MainTab;
