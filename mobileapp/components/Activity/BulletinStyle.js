import { StyleSheet } from "react-native";
import Theme from '../../styles/Theme'
import { Title } from "react-native-paper";

const BulletinStyle = StyleSheet.create({
    TopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    Text: {
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
    BulletinCardContainer:{
        marginTop: 10,
        marginBottom: 150
    },
    BulletinCard: {
        flexDirection: 'column',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        padding: 15,
        borderRadius: 16
    },
    BulletinCardImage: {
        justifyContent: 'center',
        width:'100%',
        height: 180
    },
    Image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    ImageDetail:{
        width: '100%',
        height: '100%',
    },
    BulletinsCardDetail: {
        width: '100%',
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
        fontFamily: Theme.Bold
    },
    Description:{
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        padding: 10,
        borderRadius: 10
    },
    Content:{
        width: '100%',  
        fontSize: 20,
        marginBottom: 5,
        fontFamily: Theme.Regular,
        lineHeight: 30
    },
    ContentDetail:{
        fontSize: 18,
        fontFamily: Theme.Regular,
        lineHeight: 30,
        marginTop: 20,
        marginBottom: 20,
    },
    Date:{
        fontSize: 18,
        fontFamily: Theme.SemiBold,
        marginTop: 10,
        marginBottom: 10
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
})

export default BulletinStyle;