import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Button, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Bulletin from './components/Activity/Bulletin';
import BulletinDetail from './components/Activity/BulletinDetail';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Notification from './components/Notification/Notification';
import NotificationDetail from './components/Notification/NotificationDetail';
import Personal from './components/Profile/Personal';
import Profile from './components/Profile/Profile';
import useFonts from './configs/Fonts';
import { AccountProvider, useAccount } from './store/contexts/AccountContext';
import GlobalStyle from './styles/Style';
import Theme from './styles/Theme';
import ActivityDetail from './components/Activity/ActivityDetail';

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
const test = 1;
const RootStacksNavigator = () => {
    const account = useAccount();

    return (
        <Stack.Navigator>
            {/* <RootStack.Screen name="Onboaring" options={{ headerShown: false }} component={Onboarding} /> */}
            {account.isLoggedIn === false ? (
                <>
                    <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} />
                    <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
                </>
            ) : (
                <>
                    <Stack.Screen name="MainTabs" component={RootTabsNavigator} options={{ headerShown: false }} />
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
                        name="Personal"
                        component={Personal}
                        options={{
                            title: 'Trang cá nhân',
                            headerRight: () => (
                                <TouchableOpacity style={[GlobalStyle.Center, GlobalStyle.HeaderButton]}>
                                    <Text style={GlobalStyle.HeaderButtonText}>Cập nhật</Text>
                                </TouchableOpacity>
                            ),
                        }}
                    />
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
