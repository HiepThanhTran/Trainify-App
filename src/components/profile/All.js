import { StyleSheet } from "react-native";
import Theme from "../../styles/Theme";

export default All = StyleSheet.create({
    AcvitityFormContainer:{
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 16,
        marginRight: 16
    },
    TextInputContainer:{
        marginBottom: 20,
    },
    TextInputWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Theme.PrimaryColor,
        borderRadius: 8,
        paddingHorizontal: 10
    },
    TextInputTitle:{
        fontFamily: Theme.Bold,
        fontSize: 16,
        marginBottom: 10
    },
    TextInput:{
        flex: 1,
        color: 'black',
        padding: 10
    },
    TextInputIcon:{
        marginLeft: 10
    },
    TextInputFlex:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    Flex:{
        flex: 1,
        marginRight: 10
    },
    TextInputDate:{
        color: 'black'
    },
    PickerWrapper:{
        flex: 1,
        color: 'black',
        height: 48,
        justifyContent: 'center'
    },
    Picker:{
        height: '100%',
        width: '100%',
        color: 'black',
    },
    ImageContainer:{
        borderWidth: 2,
        borderColor: Theme.PrimaryColor,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Image:{
        width: '100%',
        height: '100%',
    },
    ImageTitle:{
        fontFamily: Theme.SemiBold,
        fontSize: 16,
    },
    RichEditor:{
        borderWidth : 2,
        borderColor: Theme.PrimaryColor,
        height: 200,
    },
    RichEditorToolbar:{
        backgroundColor: Theme.PrimaryColor,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    },
   
    ButtonContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    ButtonText:{
        fontFamily: Theme.Bold,
        fontSize: 16,
        color: 'white'
    },
    Button:{
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 8,
    },
});
