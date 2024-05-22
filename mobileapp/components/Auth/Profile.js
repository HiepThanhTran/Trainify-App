import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import GlobalStyle from '../../styles/Style';

const Profile = ({ navigation }) => {
    const goToSignIn = () => {
        navigation.navigate('Signin');
    }

    return (
        <View style={GlobalStyle.Container}>
            <Text>Profile Screen</Text>
            <Button onPress={goToSignIn}>Đăng nhập</Button>
        </View>
    );
};

export default Profile;
