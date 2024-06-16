import { Button, Text, View } from 'react-native';
import GlobalStyle from '../../styles/Style';

const NotificationDetail = ({ navigation }) => {
   return (
      <View style={GlobalStyle.Container}>
         <Text>Notification Detail Screen</Text>
         <View style={{ marginTop: 12 }}>
            <Button title="Go back notification screen" onPress={() => navigation.goBack()} />
         </View>
      </View>
   );
};

export default NotificationDetail;
