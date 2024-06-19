import { createStackNavigator } from '@react-navigation/stack';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Theme from '../../Styles/Theme';
import ChatTab from '../Tabs/ChatTab';
import MainTab from '../Tabs/MainTab';
import ChatStack from './ChatStack';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';

const Stack = createStackNavigator();

const MainStack = () => {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="MainTab" component={MainTab} />
         <Stack.Screen name="HomeStack" component={HomeStack} />
         <Stack.Screen name="ProfileStack" component={ProfileStack} />
         <Stack.Screen name="ChatStack" component={ChatStack} />
         <Stack.Screen
            name="ChatTab"
            component={ChatTab}
            options={({ navigation, route }) => ({
               title: '',
               headerShown: true,
               headerTintColor: 'white',
               headerStyle: { backgroundColor: Theme.PrimaryColor },
               headerRight: () => (
                  <TouchableOpacity
                     style={{ marginRight: 12 }}
                     onPress={() =>
                        navigation.navigate('ProfileStack', {
                           screen: 'EditProfile',
                        })
                     }
                  >
                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: Theme.Bold, fontSize: 20, color: '#fff', marginRight: 12 }}>
                           {route?.params?.fullName}
                        </Text>
                        <Image
                           source={{ uri: route?.params?.avatar }}
                           style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.SecondaryColor }}
                        />
                     </View>
                  </TouchableOpacity>
               ),
            })}
         />
      </Stack.Navigator>
   );
};

export default MainStack;
