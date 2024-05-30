import { Dimensions, StyleSheet } from 'react-native';
import Theme from './Theme';

export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GlobalStyle = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Center: {
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
    ModalView: {
        width: '90%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
    },
    ModalTitle: {
        color: Theme.PrimaryColor,
        fontSize: 20,
        fontFamily: Theme.Bold,
        marginBottom: 20,
    },
    ModalButton: {
        width: screenWidth / 3,
        padding: 10,
        marginTop: 15,
        borderRadius: 16,
        backgroundColor: Theme.PrimaryColor,
    },
    ModalButtonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: Theme.Bold,
    },
    HeaderButton: {
        height: 40,
        padding: 8,
        borderRadius: 16,
        backgroundColor: '#eee',
    },
    HeaderButtonText: {
        color: 'black',
        fontFamily: Theme.Bold,
    },
});

export default GlobalStyle;
