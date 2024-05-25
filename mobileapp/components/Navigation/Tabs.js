import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import Theme from '../../styles/Theme';
import { HomeStack, NotificationStack, ProfileStack } from './Stacks';

const Tab = createBottomTabNavigator();

const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={() => ({
                tabBarActiveTintColor: Theme.PrimaryColor,
                tabBarInactiveTintColor: 'black',
                tabBarHideOnKeyboard: true,
                tabBarStyle: {},
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    tabBarLabel: "Trang chủ",
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="home" />,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="NotificationTab"
                component={NotificationStack}
                options={{
                    tabBarLabel: "Thông báo",
                    tabBarBadge: 3,
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="bell" />,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{
                    tabBarLabel: "Tôi",
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="account" />,
                }}
            ></Tab.Screen>
        </Tab.Navigator>
    );
};

export default MainTab;
