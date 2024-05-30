import { StyleSheet } from 'react-native';
import Theme from '../../styles/Theme';

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
        marginLeft: -16,
    },
    CommentImage: {
        width: '100%',
        height: '100%',
    },
    CommentInfo: {
        marginLeft: 3,
    },
    CommentName: {
        fontFamily: Theme.Bold,
        fontSize: 20,
    },
    CommentTime: {
        fontFamily: Theme.Regular,
        fontSize: 15,
    },
});

export default CommentStyle;
