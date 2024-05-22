import { StyleSheet } from "react-native";
import Home from "./Home";

const HomeStyle = StyleSheet.create({
    HomeContainer: {
        marginTop: 60,
        marginLeft: 10,
        marginRight: 10
    },
    TopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    Text: {
        fontSize: 28,
        color: '#3e9ae4'
    },
    Search: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#3e9ae4',
        borderRadius: 10,
        padding: 12,
        marginTop: 20,
        marginBottom: 20
    },
    SearchInput: {
        width: '100%',
        fontSize: 15,
        color: 'black'
    },
    BulletinsCard: {
        flexDirection: 'row',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#3e9ae4',
        padding: 20,
        borderRadius: 16
    },
    BulletinsCardImage:{
        justifyContent: 'center'
    },
    Image: {
        width: 120,
        height: 120,
        borderRadius: 16,
    },
    BulletinsCardDetail: {
       marginLeft: 20
    },
    Title:{
        fontSize: 20,
        marginBottom: 5
    },
    Content:{
        width: 200,
        fontSize: 18,
        marginBottom: 5
    },
    Date:{
        fontSize: 18,
        marginBottom: 5
    }
})

export default HomeStyle;