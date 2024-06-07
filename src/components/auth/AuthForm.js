import { StyleSheet, View } from 'react-native';
import { screenHeight } from '../../styles/Style';
import HelperText from '../common/Helper';
import AuthButton from './AuthButton';
import AuthInput from './AuthInput';

const AuthForm = ({ fields, account, setAccount, ...props }) => {
   return (
      <View style={FormStyle.Form}>
         <HelperText type="error" visible={props?.errorVisible} message={props?.errorMessage} />
         {fields.map((f) => (
            <AuthInput field={f} account={account} setAccount={setAccount} />
         ))}
         <AuthButton text={props?.buttonText} loading={props?.loading} onPressFunc={props?.onPressFunc} />
      </View>
   );
};

const FormStyle = StyleSheet.create({
   Form: {
      marginTop: screenHeight / 20,
      backgroundColor: 'white',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 22,
      paddingBottom: 8,
      paddingTop: 32,
   },
});

export default AuthForm;
