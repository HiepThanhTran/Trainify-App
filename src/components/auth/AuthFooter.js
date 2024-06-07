import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';

const AuthFooter = ({ navigation, content, screen, linkText }) => {
   const handleNavigate = () => {
      if (screen === 'SignIn') navigation.goBack();
      else navigation.navigate(screen);
   };

   return (
      <View style={FooterSytle.FooterContainer}>
         <Text style={GlobalStyle.Bold}>{content}</Text>
         <TouchableOpacity onPress={handleNavigate}>
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
