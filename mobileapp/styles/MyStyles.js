import { StyleSheet } from "react-native";

const MyStyles = StyleSheet.create({
    Bold:{
        fontFamily: 'OpenSansBold'
    },
    SemiBold:{
        fontFamily: 'OpenSansSemiBold'
    },
    Light:{
        fontFamily:'OpenSansLight'
    },
    Medium:{
        fontFamily: 'OpenSansMedium'
    },
    Regular:{
        fontFamily: "OpenSansRegular"
    },
    Italic:{
        fontFamily:"OpenSansItalic"
    },
    Container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default MyStyles;