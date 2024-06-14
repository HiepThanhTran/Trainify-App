import { Button, Text, View } from 'react-native';
import GlobalStyle from '../../styles/Style';

const Notification = ({ navigation }) => {
   return (
      <View style={GlobalStyle.Container}>
         <Text>Notification Screen</Text>
         <Button
            title="Go to detail"
            onPress={() => navigation.navigate('NotificationStack', { screen: 'NotificationDetail' })}
         />
      </View>
   );
};

export default Notification;
