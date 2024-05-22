import { StyleSheet } from 'react-native';

const AuthStyle = StyleSheet.create({
    LoginContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
    },
    ImageBackground: {
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
    LightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute',
    },
    Light1: {
        height: 220,
        width: 90,
    },
    Light2: {
        height: 160,
        width: 65,
    },
    TitleAndForm: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'space-around',
        paddingTop: 120,
        paddingBottom: 40,
    },
    TitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    Title: {
        color: 'white',
        fontSize: 45,
        marginTop: 100,
    },
    Form: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 140,
    },
    InputWrap: {
        padding: 4,
        borderRadius: 16,
        width: '100%',
        marginBottom: 20,
        borderColor: '#3e9ae4',
        borderWidth: 1,
    },
    Input: {
        backgroundColor: 'white'
    },
    Button: {
        width: '100%',
        backgroundColor: '#3e9ae4',
        borderRadius: 16,
        marginBottom: 12,
        padding: 5,
    },
    ButtonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        padding: 10,
    },
    Detail: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    Password: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
});

export default AuthStyle;
