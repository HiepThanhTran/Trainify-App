import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import Activities from '../../Screens/Home/Activities';
import Bulletins from '../../Screens/Home/Bulletins';
import Profile from '../../Screens/Profile/Profile';
import Theme from '../../Styles/Theme';

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
                  case 'Activites':
                     iconName = focused ? 'newspaper-variant' : 'newspaper-variant-outline';
                     break;
                  default:
                     iconName = '';
               }

               iconColor = focused ? Theme.PrimaryColor : 'gray';

               return <Icon color={iconColor} size={36} source={iconName} />;
            },
         })}
      >
         <Tab.Screen name="Home" component={Bulletins} options={{ tabBarLabel: 'Trang chủ' }} />
         <Tab.Screen name="Activites" component={Activities} options={{ tabBarLabel: 'Hoạt động' }} />
         <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Tôi' }} />
      </Tab.Navigator>
   );
};

export default MainTab;
