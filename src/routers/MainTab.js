import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
// import Bulletin from '../screens/home/Bulletins';
import Activity from '../screens/home/Activity';
import Notification from '../screens/notification/Notification';
import Profile from '../screens/profile/Profile';
import Theme from '../styles/Theme';

const Tab = createBottomTabNavigator();

const MainTab = () => {
   return (
      <Tab.Navigator
         screenOptions={() => ({
            tabBarActiveTintColor: Theme.PrimaryColor,
            tabBarInactiveTintColor: 'black',
            tabBarHideOnKeyboard: true,
            headerShown: false,
         })}
      >
         <Tab.Screen
            name="Home"
            component={Activity}
            options={{
               tabBarLabel: 'Trang chủ',
               tabBarIcon: () => <Icon color="gray" size={35} source="home" />,
            }}
         ></Tab.Screen>
         <Tab.Screen
            name="Notification"
            component={Notification}
            options={{
               tabBarLabel: 'Thông báo',
               tabBarBadge: 3,
               tabBarIcon: () => <Icon color="gray" size={35} source="bell" />,
            }}
         ></Tab.Screen>
         <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
               tabBarLabel: 'Tôi',
               tabBarIcon: () => <Icon color="gray" size={35} source="account" />,
            }}
         ></Tab.Screen>
      </Tab.Navigator>
   );
};

export default MainTab;
