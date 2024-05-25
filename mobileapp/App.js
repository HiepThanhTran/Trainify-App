import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import Bulletin from './components/Activity/Bulletin';
import BulletinDetail from './components/Activity/BulletinDetail';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Notification from './components/Notification/Notification';
import NotificationDetail from './components/Notification/NotificationDetail';
import Personal from './components/Profile/Personal';
import Profile from './components/Profile/Profile';
import useFonts from './configs/Fonts';
import { AccountProvider, useAccount } from './contexts/AccountContext';
import GlobalStyle from './styles/Style';
import Theme from './styles/Theme';
import { Icon } from 'react-native-paper';

const Tab = createBottomTabNavigator();

const RootTabsNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={() => ({
                tabBarActiveTintColor: Theme.PrimaryColor,
                tabBarInactiveTintColor: 'black',
                tabBarHideOnKeyboard: true,
            })}
        >
            <Tab.Screen
                name="Home"
                component={Bulletin}
                options={{
                    tabBarLabel: 'Trang chủ',
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="home" />,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarLabel: 'Thông báo',
                    tabBarBadge: 3,
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="bell" />,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Tôi',
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="account" />,
                }}
            ></Tab.Screen>
        </Tab.Navigator>
    );
};

const Stack = createNativeStackNavigator();

const RootStacksNavigator = () => {
    const account = useAccount();

    return (
        <Stack.Navigator>
            {/* <RootStack.Screen name="Onboaring" options={{ headerShown: false }} component={Onboarding} /> */}
            {account.isLoggedIn === false ? (
                <>
                    <Stack.Screen name="Signin" options={{ headerShown: false }} component={Signin} />
                    <Stack.Screen name="Signup" options={{ headerShown: false }} component={Signup} />
                </>
            ) : (
                <>
                    <Stack.Screen name="MainTabs" options={{ headerShown: false }} component={RootTabsNavigator} />
                    <Stack.Screen name="BulletinDetail" component={BulletinDetail} />
                    <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
                    <Stack.Screen name="Personal" component={Personal} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    const fontsLoaded = useFonts();

    return (
        <>
            {!fontsLoaded ? (
                <View style={GlobalStyle.Center}>
                    <ActivityIndicator size="large" color="#3e9ae4" />
                </View>
            ) : (
                <NavigationContainer>
                    <AccountProvider>
                        <RootStacksNavigator />
                    </AccountProvider>
                </NavigationContainer>
            )}
        </>
    );
}
