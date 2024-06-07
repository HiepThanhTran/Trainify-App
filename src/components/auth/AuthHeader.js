import { StyleSheet, Text, View } from 'react-native';
import { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';

const AuthHeader = ({ title, content }) => {
   return (
      <View style={HeaderStyle.HeaderContainer}>
         <Text style={HeaderStyle.HeaderTitle}>{title}</Text>
         <Text style={HeaderStyle.HeaderContent}>{content}</Text>
      </View>
   );
};

const HeaderStyle = StyleSheet.create({
   HeaderContainer: {
      marginTop: screenHeight / 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingBottom: 4,
   },
   HeaderTitle: {
      fontSize: 30,
      color: 'white',
      marginBottom: 20,
      fontFamily: Theme.Bold,
   },
   HeaderContent: {
      fontSize: 20,
      textAlign: 'center',
      color: 'white',
      lineHeight: 30,
      fontFamily: Theme.Bold,
   },
});

export default AuthHeader;
