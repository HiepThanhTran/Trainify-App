import { StyleSheet } from "react-native";
import Theme from "../../styles/Theme";

export default AllStyle = StyleSheet.create({
    ContainerScreen:{
        marginHorizontal: 12,
        marginTop: 80
    },
    ContainerScreenDetail:{
        marginHorizontal: 12,
    },
    BulletinTopContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    BulletinTitle:{
        fontSize: 28,
        color: Theme.PrimaryColor,
        fontFamily: Theme.Bold
    },
    Search: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Theme.PrimaryColor,
        borderRadius: 10,
        padding: 12,
        marginTop: 20,
        marginBottom: 20
    },
    SearchInput: {
        width: '100%',
        fontSize: 15,
        fontFamily: Theme.SemiBold,
    },
    Container:{
        marginBottom: 135
    },
    Card:{
        flexDirection: 'column',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        padding: 15,
        borderRadius: 16
    },
    CardImage:{
        justifyContent: 'center',
        width:'100%',
        height: 180
    },
    Image:{
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    CardDetail: {
        width: '100%',
    },
    CardDetailTitle:{
        fontSize: 25,
        marginTop: 20,
        marginBottom: 10,
        fontFamily: Theme.Bold
    },
    Content:{
        width: '100%',  
        fontSize: 20,
        marginBottom: 5,
        fontFamily: Theme.Regular,
        lineHeight: 30
    },
    Date:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
        marginTop: 10,
        marginBottom: 10
    }, 
    Description:{
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        padding: 10,
        borderRadius: 10
    },
    ContentDetail:{
        fontSize: 18,
        fontFamily: Theme.Regular,
        lineHeight: 30,
        marginTop: 20,
        marginBottom: 20,
    },
    DateDetail:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
        marginBottom: 10
    },
    DateUpdate:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
    },
    Title:{
        fontSize: 25,
        marginTop: 20,
        marginBottom: 10,
        fontFamily: Theme.Bold
    },
    TitleDetail:{
        fontSize: 25,
        marginBottom: 15,
        fontFamily: Theme.Bold,
    },
    ImageDetail:{
        width: '100%',
        height: '100%'
    },
    ActivitContainer:{
        marginTop: 20
    },
    ActivityTitle:{
        fontFamily: Theme.Bold,
        fontSize: 20,
        marginBottom: 10
    },
    ActivityImage:{
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    AcitivityDetailText:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
        marginBottom: 10
    }
});
