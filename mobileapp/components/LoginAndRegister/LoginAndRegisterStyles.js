import {StyleSheet} from "react-native";

const LoginAndRegisterStyles = StyleSheet.create({
    LoginContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white'
    },
    ImageBackground: {
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    LightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute'
    },
    Light1: {
        height: 220,
        width: 90
    },
    Light2: {
        height: 160,
        width: 65
    },
    TitleAndForm: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'space-around',
        paddingTop: 160,
        paddingBottom: 40
    },
    TitleContainer: {
        flex: 1,
        alignItems: 'center'
    },
    Title: {
        color: 'white',
        fontSize: 45,
        marginTop: 100
    },
    Form: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 16
    },
    DropdownSelector: {
        width: '100%',
        borderRadius: 16,
        borderColor: '#3e9ae4',
        borderWidth: 1,
        marginBottom: 20,
        height: 60,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 12
    },
    DropdownArea: {
        width: '100%',
        height: 160,
        borderRadius: 16,
        marginTop: 65,
        backgroundColor: 'white',
        elevation: 5,
        alignSelf: 'center',
        position: 'absolute',
        zIndex: 1
    },
    RoleItem: {
        width: '92%',
        height: 50,
        borderBottomWidth: 0.2,
        borderBottomColor: '#3e9ae4',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    Input: {
        padding: 15,
        borderRadius: 16,
        width: '100%',
        marginBottom: 20,
        borderColor: '#3e9ae4',
        borderWidth: 1,
    },
    Button: {
        width: '100%',
        backgroundColor: '#3e9ae4',
        borderRadius: 16,
        marginBottom: 12,
        padding: 5
    },
    ButtonText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        padding: 10
    }
})

export default LoginAndRegisterStyles;