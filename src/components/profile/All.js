import { StyleSheet } from "react-native";
import Theme from "../../styles/Theme";

export default All = StyleSheet.create({
    Container: {
        marginTop: 30,
        marginRight: 16,
        marginLeft: 16,
    },
    FormCreateActivity: {
        
    },
    TextInputTitle:{
        fontSize: 16,
        fontFamily: Theme.SemiBold,
        marginBottom: 10,
    },
    TextInputContainer: {
        marginBottom: 20,
    },
    TextInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    TextInput: {
        flex: 1,
        color: 'gray',
        padding: 10,
    },
    Icon: {
        marginLeft: 10,
    },
});