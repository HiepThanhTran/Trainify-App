import { StyleSheet } from "react-native";
import Theme from "../../styles/Theme";

const CommentStyle = StyleSheet.create({
    CommentContainer: {
        marginTop: 20,
    },
    CommentTitle: {
        fontSize: 25,
        marginBottom: 15,
        fontFamily: Theme.Bold,
    },
    CommentTop: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    CommentCardImage: {
        width: 90,
        height: 90,
        marginLeft: -16
    },
    CommentImage: {
        width: '100%',
        height: '100%',
    },
    CommentInfo: {
        marginLeft: 3
    },
    CommentName: {
        fontFamily: Theme.Bold,
        fontSize: 20
    },
    CommentTime: {
        fontFamily: Theme.Regular,
        fontSize: 15
    },
    CommentEditContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    CommentEdit: {
        fontFamily: Theme.Bold,
        fontSize: 20,
        position: 'relative'
    },
    FormEdit: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'absolute',
        bottom: -80
    },
    FormEditText:{
        fontFamily: Theme.Bold,
        fontSize: 15,
        marginTop: 9
    }
})

export default CommentStyle;