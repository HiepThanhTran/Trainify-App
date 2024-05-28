import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Theme from '../../styles/Theme';

const AuthFormInput = ({ field, account, updateAccount, passwordVisible, setPasswordVisible }) => {
    return (
        <TextInput
            style={InputStyle.Input}
            cursorColor={Theme.PrimaryColor}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            key={field.name}
            value={account[field.name]}
            placeholder={field.label}
            keyboardType={field.keyboardType}
            secureTextEntry={field.secureTextEntry}
            onChangeText={(value) => updateAccount(field.name, value)}
            right={
                <TextInput.Icon
                    icon={field.icon}
                    onPress={field.name === 'password' || 'confirm' ? () => setPasswordVisible(!passwordVisible) : null}
                />
            }
        />
    );
};

const InputStyle = StyleSheet.create({
    Input: {
        backgroundColor: '#f1f4ff',
        borderWidth: 2,
        marginBottom: 20,
        borderColor: Theme.PrimaryColor,
    },
});

export default AuthFormInput;
