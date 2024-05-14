import {StyleSheet } from "react-native";

const LoginAndRegisterStyles = StyleSheet.create({
    LoginContainer:{
        height: '100%',
        width: '100%',
        backgroundColor: 'white'
    },
    ImageBackground:{
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    LightContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute'
    },
    Light1:{
        height: 220,
        width: 90
    },
    Light2:{
        height: 160,
        width: 65
    },
    TitleAndForm:{
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'space-around',
        paddingTop: 160,
        paddingBottom: 40
    },
    TitleContainer:{
        flex: 1,
        alignItems: 'center'
    },
    Title:{
        color: 'white',
        fontSize: 45,
        marginTop: 100
    },
    Form:{
        flex: 1,
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 16
    },
    Input:{
        backgroundColor: 'rgba(0,0,0,0.06)',
        padding: 20,
        borderRadius: 16,
        width: '100%',
        marginBottom: 20
    },
    Button:{
        width: '100%',
        backgroundColor: '#1873bc',
        borderRadius: 16,
        marginBottom: 12,
        padding: 12
    },
    ButtonText:{
        fontSize: 20,
        lineHeight: 28,
        textAlign: 'center',
        color: 'white'
    }
})

export default LoginAndRegisterStyles;