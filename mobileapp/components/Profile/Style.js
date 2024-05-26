import { Dimensions, StyleSheet } from 'react-native';
import Theme from '../../styles/Theme';

const { width, height } = Dimensions.get('window');

export const ProfileStyle = StyleSheet.create({
    Header: {
        backgroundColor: 'white',
        marginTop: height * 0.1,
        height: height * 0.2,
        borderRadius: 16,
        marginHorizontal: 12,
    },
    Avatar: {
        marginTop: -height * 0.07,
        width: width * 0.2,
        height: width * 0.2,
        borderWidth: 4,
        borderRadius: (width * 0.2) / 2,
        borderColor: 'white',
        backgroundColor: '#f1f4ff',
    },
    HeaderButton: {
        backgroundColor: Theme.PrimaryColor,
        padding: 4,
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
        marginHorizontal: 8,
    },
    Section: {
        marginTop: 40,
        marginHorizontal: 12,
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
        marginVertical: 16,
    },
    FooterButton: {
        width: '60%',
        flexDirection: 'row',
        backgroundColor: Theme.PrimaryColor,
        padding: 12,
        borderRadius: 12,
    },
});

export const EditProfileStyle = StyleSheet.create({
    CoverImage: {
        flex: 1,
        height: height / 5,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    Avatar: {
        width: 155,
        height: 155,
        marginTop: -90,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: 'white',
        backgroundColor: '#f1f4ff',
    },
    CameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: width / 3,
        zIndex: 999,
    },
    InputWrap: {
        marginBottom: 6,
        marginHorizontal: 12,
        flexDirection: 'column',
    },
    InputText: {
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
    Input: {
        marginVertical: 6,
        justifyContent: 'center',
    },
});
