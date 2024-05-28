import { StyleSheet } from 'react-native';
import { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';

const AuthStyle = StyleSheet.create({
    HeaderContainer: {
        marginTop: screenHeight / 8,
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
    HeaderBody: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        lineHeight: 30,
        fontFamily: Theme.Bold,
    },
    Form: {
        marginTop: screenHeight / 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 30,
    },
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

export default AuthStyle;
