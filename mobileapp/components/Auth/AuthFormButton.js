import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Theme from '../../styles/Theme';

const AuthFormButton = ({ text, loading, onPress }) => {
    return (
        <Button loading={loading} icon="account" textColor="white" style={ButtonStyle.Button} onPress={onPress}>
            <Text variant="headlineLarge" style={ButtonStyle.ButtonText}>
                {text}
            </Text>
        </Button>
    );
};

const ButtonStyle = StyleSheet.create({
    Button: {
        width: '100%',
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 16,
        marginBottom: 12,
    },
    ButtonText: {
        color: 'white',
        fontSize: 20,
        fontFamily: Theme.Bold,
    },
});

export default AuthFormButton;
