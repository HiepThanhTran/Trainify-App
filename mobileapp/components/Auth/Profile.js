import { useContext } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { AccountContext, DispatchContext } from '../../configs/Contexts';
import GlobalStyle from '../../styles/Style';

const Profile = ({ navigation }) => {
    const account = useContext(AccountContext);
    const dispatch = useContext(DispatchContext);

    const goToSignIn = () => navigation.navigate('Signin');

    return (
        <View style={GlobalStyle.Container}>
            <Text style={{ marginBottom: 10 }}>Profile Screen</Text>
            {account === null ? (
                <>
                    <Button onPress={goToSignIn}>Đăng nhập</Button>
                </>
            ) : (
                <>
                    <Text style={GlobalStyle.Title}>CHÀO {account.user.first_name}!</Text>
                    <Button icon="logout" onPress={() => dispatch({ type: 'logout' })}>
                        Đăng xuất
                    </Button>
                </>
            )}
        </View>
    );
};

export default Profile;
