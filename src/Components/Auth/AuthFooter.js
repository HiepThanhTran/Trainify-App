import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';

const AuthFooter = ({ navigation, content, screen, linkText }) => {
   return (
      <View style={FooterSytle.FooterContainer}>
         <Text style={GlobalStyle.Bold}>{content}</Text>
         <TouchableOpacity onPress={() => navigation.navigate(screen)}>
            <Text style={FooterSytle.FooterText}>{linkText}</Text>
         </TouchableOpacity>
      </View>
   );
};

const FooterSytle = StyleSheet.create({
   FooterContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'white',
   },
   FooterText: {
      color: Theme.PrimaryColor,
      marginLeft: 5,
      fontFamily: Theme.Bold,
   },
});

export default AuthFooter;
