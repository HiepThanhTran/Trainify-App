import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SIGN_OUT } from '../../configs/Constants';
import { useAccount, useAccountDispatch } from '../../configs/Context';
import GlobalStyle from '../../styles/Style';

const Profile = () => {
    const account = useAccount();
    const dispatch = useAccountDispatch();

    return (
        <View style={GlobalStyle.Container}>
            <Text style={{ marginBottom: 10 }}>Profile Screen</Text>
            <Text style={GlobalStyle.Title}>CHÀO {account.data.user.first_name}</Text>
            <Button icon="logout" onPress={() => dispatch({ type: SIGN_OUT })}>
                Đăng xuất
            </Button>
        </View>
    );
};

export default Profile;
