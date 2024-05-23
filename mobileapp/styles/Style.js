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
        marginTop: -16,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    Title: {
        color: '#3e9ae4',
        fontSize: 20,
        fontWeight: 'bold',
    },
    BackGround: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
    ModalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
});

export default GlobalStyle;
