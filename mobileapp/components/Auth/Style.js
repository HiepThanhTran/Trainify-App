import { StyleSheet } from 'react-native';
import Theme from '../../styles/Theme';

const AuthStyle = StyleSheet.create({
    // Auth Style
    Container: {
        flex: 1,
    },
    Header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 4,
    },
    HeaderTitle: {
        fontSize: 30,
        marginTop: 30,
        color: 'white',
        marginBottom: 20,
        fontFamily: Theme.Bold,
    },
    SubTitle: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        lineHeight: 30,
        fontFamily: Theme.Bold,
    },
    Form: {
        flex: 3,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 30,
    },
    Input: {
        backgroundColor: '#f1f4ff',
        borderWidth: 2,
        marginBottom: 20,
        borderColor: Theme.PrimaryColor,
        marginBottom: 20,
    },
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
    Footer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    FooterText: {
        color: Theme.PrimaryColor,
        marginLeft: 5,
        fontFamily: Theme.Bold,
    },
});

export default AuthStyle;
