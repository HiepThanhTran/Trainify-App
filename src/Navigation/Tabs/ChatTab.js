import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import { roles } from '../../Configs/Constants';
import ChatList from '../../Screens/Chat/ChatList';
import ContactList from '../../Screens/Profile/ContactList';
import { useAccount } from '../../Store/Contexts/AccountContext';
import Theme from '../../Styles/Theme';

const Tab = createBottomTabNavigator();

const ChatTab = () => {
   const currentAccount = useAccount();

   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            tabBarActiveTintColor: Theme.PrimaryColor,
            tabBarInactiveTintColor: 'black',
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarStyle: { display: currentAccount.data.role === roles.STUDENT ? 'flex' : 'none' },
            tabBarIcon: ({ focused }) => {
               let iconName, iconColor;

               switch (route.name) {
                  case 'ChatList':
                     iconName = focused ? 'chat' : 'chat-outline';
                     break;
                  case 'ContactList':
                     iconName = focused ? 'account-multiple' : 'account-multiple-outline';
                     break;
                  default:
                     iconName = '';
               }

               iconColor = focused ? Theme.PrimaryColor : 'gray';

               return <Icon color={iconColor} size={36} source={iconName} />;
            },
         })}
      >
         <Tab.Screen name="ChatList" component={ChatList} options={{ tabBarLabel: 'Nhắn tin' }} />
         {currentAccount.data.role === roles.STUDENT && (
            <Tab.Screen name="ContactList" component={ContactList} options={{ tabBarLabel: 'Liên hệ' }} />
         )}
      </Tab.Navigator>
   );
};

export default ChatTab;
