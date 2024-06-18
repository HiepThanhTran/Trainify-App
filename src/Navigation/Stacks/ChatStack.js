import { createStackNavigator } from '@react-navigation/stack';
import Chat from '../../Screens/Chat/Chat';
import ChatList from '../../Screens/Chat/ChatList';
import Theme from '../../Styles/Theme';

const Stack = createStackNavigator();

const ChatStack = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerStyle: { backgroundColor: Theme.PrimaryColor },
            headerTintColor: 'white',
            // headerShown: false,
         }}
      >
         <Stack.Screen name="ChatList" component={ChatList} options={{ title: 'Trung tâm hỗ trợ' }} />
         <Stack.Screen name="Chat" component={Chat} options={{ title: '' }} />
      </Stack.Navigator>
   );
};

export default ChatStack;
