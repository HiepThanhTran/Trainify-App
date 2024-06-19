import { createStackNavigator } from '@react-navigation/stack';
import Chat from '../../Screens/Chat/Chat';
import Theme from '../../Styles/Theme';

const Stack = createStackNavigator();

const ChatStack = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerStyle: { backgroundColor: Theme.PrimaryColor },
            headerTintColor: 'white',
         }}
      >
         <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
   );
};

export default ChatStack;
