import { StyleSheet } from 'react-native';

const GlobalStyle = StyleSheet.create({
    Bold: {
        fontFamily: 'OpenSansBold',
    },
    SemiBold: {
        fontFamily: 'OpenSansSemiBold',
    },
    Light: {
        fontFamily: 'OpenSansLight',
    },
    Medium: {
        fontFamily: 'OpenSansMedium',
    },
    Regular: {
        fontFamily: 'OpenSansRegular',
    },
    Italic: {
        fontFamily: 'OpenSansItalic',
    },
    PrimaryColor: {
        color: '#3e9ae4',
    },
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    HelpText: {
        marginBottom: 12,
        marginTop:-16,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    Title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'blue',
    },
    BackGround: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
});

export default GlobalStyle;
