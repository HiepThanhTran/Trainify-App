import { StyleSheet } from 'react-native';

const GlobalStyle = StyleSheet.create({
    BackGround:{
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    Center:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    TextCenter:{
        textAlign: 'center'
    },
    ContainerScreen:{
        marginTop: 80,
        marginLeft: 12,
        marginRight: 12
    }
});

export default GlobalStyle;
