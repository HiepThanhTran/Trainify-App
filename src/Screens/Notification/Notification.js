import { Text, View } from 'react-native';
import GlobalStyle from '../../Styles/Style';

const Notification = ({ navigation }) => {
   return (
      <View style={GlobalStyle.Container}>
         <Text>Notification Screen</Text>
      </View>
   );
};

export default Notification;
