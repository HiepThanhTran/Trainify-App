import { Dimensions, StyleSheet } from 'react-native';
import Theme from '../../styles/Theme';

const { width, height } = Dimensions.get('window');

export const ProfileStyle = StyleSheet.create({
    Header: {
        backgroundColor: 'white',
        marginTop: height * 0.1,
        height: height * 0.2,
        borderRadius: 16,
        marginLeft: 12,
        marginRight: 12,
    },
    AvatarContainer: {
        marginTop: -height * 0.07,
        width: width * 0.2,
        height: width * 0.2,
        borderWidth: 3,
        borderRadius: (width * 0.2) / 2,
        borderColor: 'white',
        backgroundColor: '#f1f4ff',
    },
    Avatar: {
        height: width * 0.2,
        width: width * 0.2,
    },
    HeaderButton: {
        backgroundColor: Theme.PrimaryColor,
        padding: 8,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    ButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: Theme.Bold,
        marginLeft: 8,
        marginRight: 8,
    },
    Section: {
        marginTop: 40,
        marginLeft: 12,
        marginRight: 12,
    },
    SectionTitle: {
        fontFamily: Theme.SemiBold,
        fontSize: 30,
    },
    SectionBody: {
        borderWidth: 1,
        marginTop: 24,
        borderRadius: 8,
        borderColor: '#eee',
        overflow: 'hidden',
        borderBottomWidth: 0,
    },
    SectionItem: {
        padding: 8,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'space-between',
    },
    SectionItemLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextItemLeft: {
        marginLeft: 8,
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
    Footer: {
        marginTop: 16,
        marginBottom: 16,
    },
    FooterButton: {
        width: '60%',
        flexDirection: 'row',
        backgroundColor: Theme.PrimaryColor,
        padding: 12,
        borderRadius: 12,
    },
});
