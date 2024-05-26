import { StyleSheet } from "react-native";
import Theme from "../../styles/Theme";
const ActivityStyle = StyleSheet.create({
    ActivityContainer:{
        marginTop: -18
    },
    ActivitySearch:{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Theme.PrimaryColor,
        borderRadius: 10,
        padding: 12,
        marginTop: 20,
        marginBottom: 20
    },
    ActivitySearchInput:{
        width: '100%',
        fontSize: 15,
        fontFamily: Theme.SemiBold,
    },
    ActivityCard:{
        flexDirection: 'column',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        padding: 15,
        borderRadius: 16
    },
    ActivityTitle:{
        fontFamily: Theme.Bold,
        fontSize: 20,
        marginBottom: 10
    },
    ActivityTitleDetail:{
        fontSize: 25,
        marginBottom: 15,
        fontFamily: Theme.Bold
    },
    ActivityCardImage:{
        justifyContent: 'center',
        width:'100%',
        height: 180
    },
    ActivityDes:{
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        padding: 10,
        borderRadius: 10
    },
    ActivityImage:{
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    ActivityImageDetail:{
        width: '100%',
        height: '100%',
    },
    ActivityContent:{
        width: '100%',  
        fontSize: 18,
        marginBottom: 5,
        fontFamily: Theme.Regular,
        lineHeight: 30,
        marginTop: 10
    },
    ActivityContentDetail:{
        fontSize: 18,
        fontFamily: Theme.Regular,
        lineHeight: 30,
        marginTop: 20,
        marginBottom: 20,
    },
    Text:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
        marginBottom: 10
    },
    ActivityStartDate:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
        marginBottom: 10
    },
    ActivityEndDate:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
    },
    ActivityCreateDate:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
        marginBottom: 10,
        marginTop: 20
    },
    ActivityUpdateDate:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
    },
})

export default ActivityStyle;