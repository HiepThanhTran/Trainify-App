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
import Splash from './components/Splash/Splash';
import { AccountProvider, useAccount } from './store/contexts/AccountContext';
import GlobalStyle from './styles/Style';
import Theme from './styles/Theme';
LogBox.ignoreAllLogs();

const RootTab = createBottomTabNavigator();

const RootTabsNavigator = () => {
    return (
        <RootTab.Navigator
            screenOptions={() => ({
                tabBarActiveTintColor: Theme.PrimaryColor,
                tabBarInactiveTintColor: 'black',
                tabBarHideOnKeyboard: true,
            })}
        >
            <RootTab.Screen
                name="Home"
                component={Bulletin}
                options={{
                    tabBarLabel: 'Trang chủ',
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="home" />,
                }}
            ></RootTab.Screen>
            <RootTab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarLabel: 'Thông báo',
                    tabBarBadge: 3,
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="bell" />,
                }}
            ></RootTab.Screen>
            <RootTab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Tôi',
                    headerShown: false,
                    tabBarIcon: () => <Icon color="gray" size={35} source="account" />,
                }}
            ></RootTab.Screen>
        </RootTab.Navigator>
    );
};

const RoootStack = createNativeStackNavigator();

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
                <RoootStack.Navigator>
                    {account.isLoggedIn === false ? (
                        <>
                            {splash && (
                                <RoootStack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
                            )}
                            <RoootStack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
                            <RoootStack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
                        </>
                    ) : (
                        <>
                            <RoootStack.Screen
                                name="MainTabs"
                                component={RootTabsNavigator}
                                options={{ headerShown: false }}
                            />
                            <RoootStack.Screen
                                name="BulletinDetail"
                                component={BulletinDetail}
                                options={({ route }) => ({ title: route?.params.title })}
                            />
                            <RoootStack.Screen
                                name="ActivityDetail"
                                component={ActivityDetail}
                                options={({ route }) => ({ title: route?.params.name })}
                            />
                            <RoootStack.Screen name="NotificationDetail" component={NotificationDetail} />
                            <RoootStack.Screen
                                name="EditProfile"
                                component={EditProfile}
                                options={{ title: 'Trang cá nhân' }}
                            />
                        </>
                    )}
                </RoootStack.Navigator>
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
