import { ImageBackground, StyleSheet } from 'react-native';
import { IMGElement } from 'react-native-render-html';

const AuthStyle = StyleSheet.create({
    Container:{
        flex: 1
    },
    Header:{
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 4
    },
    HeaderTitle:{
        fontSize: 30,
        marginTop: 30,
        color: 'white',
        marginBottom: 20
    },
    SubTitle:{
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        lineHeight: 30
    },
    Footer:{
        flex: 3,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 30
    },
    Input:{
        backgroundColor: '#f1f4ff',
        borderWidth: 2,
        borderColor: '#3e9ae4',
        marginBottom: 20
    },
    Button:{
        width: '100%',
        backgroundColor: '#3e9ae4',
        borderRadius: 16,
        marginBottom: 12,
        padding: 8,
    },
    ButtonText:{
        color: 'white',
        fontSize: 20
    },
    Detail:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    }
});

export default AuthStyle;
