import { StyleSheet } from 'react-native';
import Theme from '../../styles/Theme';
import { screenWidth } from '../../styles/Style';

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
        width: 60,
        height: 60,
        marginLeft: -16,
        borderRadius: screenWidth/2,
        overflow: 'hidden'
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
        fontSize: 20,
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
        fontSize: 25,
        position: 'relative'
    },
    FormEdit: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'absolute',
        bottom: -80,
        zIndex: 1
    },
    FormEditText:{
        fontFamily: Theme.Bold,
        fontSize: 15,
        marginTop: 12
    },
    ButtonEditContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    ButtonEdit: {
        padding: 8,
        borderWidth: 1,
        marginHorizontal: 10,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
    },
    ButtonText:{
        fontFamily: Theme.Bold,
    },
})

export default CommentStyle;
