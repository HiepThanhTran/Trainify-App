import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, StatusBar, View } from 'react-native';
import { Icon } from 'react-native-paper';
import ActivityDetail from './components/Activity/ActivityDetail';
import Bulletin from './components/Activity/Bulletin';
import BulletinDetail from './components/Activity/BulletinDetail';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Notification from './components/Notification/Notification';
import NotificationDetail from './components/Notification/NotificationDetail';
import EditProfile from './components/Profile/EditProfile';
import Profile from './components/Profile/Profile';
import useFonts from './configs/Fonts';
import Splash from './screens/Splash/Splash';
import { AccountProvider, useAccount } from './store/contexts/AccountContext';
import GlobalStyle from './styles/Style';
import Theme from './styles/Theme';
LogBox.ignoreAllLogs();

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
    const fontsLoaded = useFonts();
    const account = useAccount();

    const [splash, setSplash] = useState(true);

    const checkSplashDone = async () => {
        const splashDone = await AsyncStorage.getItem('splash-done');
        if (splashDone) setSplash(false);
    };

    useEffect(() => {
        checkSplashDone();
    }, []);

    return (
        <>
            {!fontsLoaded || account.loading ? (
                <View style={GlobalStyle.Container}>
                    <ActivityIndicator size="large" color={Theme.PrimaryColor} />
                </View>
            ) : (
                <Stack.Navigator>
                    {account.isLoggedIn === false ? (
                        <>
                            {splash && (
                                <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                            )}
                            <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
                            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen
                                name="MainTabs"
                                component={RootTabsNavigator}
                                options={{ headerShown: false }}
                            />
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
                            <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
                            <Stack.Screen
                                name="EditProfile"
                                component={EditProfile}
                                options={{ title: 'Trang cá nhân' }}
                            />
                        </>
                    )}
                </Stack.Navigator>
            )}
        </>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <AccountProvider>
                <StatusBar />
                <RootStacksNavigator />
            </AccountProvider>
        </NavigationContainer>
    );
}
