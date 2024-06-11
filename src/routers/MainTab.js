import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import Test from '../screens/Test';
import Bulletin from '../screens/home/Bulletins';
import Notification from '../screens/notification/Notification';
import Profile from '../screens/profile/Profile';
import Theme from '../styles/Theme';

const Tab = createBottomTabNavigator();

const MainTab = () => {
   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            tabBarActiveTintColor: Theme.PrimaryColor,
            tabBarInactiveTintColor: 'black',
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarIcon: ({ focused }) => {
               let iconName, iconColor;

               switch (route.name) {
                  case 'Home':
                     iconName = focused ? 'home' : 'home-outline';
                     break;
                  case 'Notification':
                     iconName = focused ? 'bell' : 'bell-outline';
                     break;
                  case 'Profile':
                     iconName = focused ? 'account' : 'account-outline';
                     break;
                  case 'Test':
                     iconName = 'history';
                     break;
                  default:
                     iconName = '';
               }

               iconColor = focused ? Theme.PrimaryColor : 'gray';

               return <Icon color={iconColor} size={36} source={iconName} />;
            },
         })}
      >
         <Tab.Screen name="Home" component={Bulletin} options={{ tabBarLabel: 'Trang chủ' }} />
         <Tab.Screen
            name="Notification"
            component={Notification}
            options={{ tabBarLabel: 'Thông báo', tabBarBadge: 3 }}
         />
         <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Tôi' }} />
         <Tab.Screen name="Test" component={Test} options={{ tabBarLabel: 'Test Screen' }} />
      </Tab.Navigator>
   );
};

export default MainTab;
