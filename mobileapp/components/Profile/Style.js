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
        marginTop: -height * 0.1,
        width: width * 0.2,
        height: width * 0.2,
        borderWidth: 4,
        borderRadius: (width * 0.2) / 2,
        borderColor: 'white',
        backgroundColor: '#f1f4ff',
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
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
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
        borderBottomWidth: 2,
        borderBottomColor: 'black',
    },
    AvatarContainer: {
        marginLeft: 12,
        flexDirection: 'row',
    },
    Avatar: {
        width: 155,
        height: 155,
        marginTop: -90,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: 'lightgrey',
        backgroundColor: '#f1f4ff',
    },
    CameraIcon: {
        position: 'absolute',
        bottom: 0,
        left: width / 3.5,
        zIndex: 999,
        backgroundColor: 'gray',
        borderRadius: 8,
    },
    Header: {
        fontSize: 20,
        marginBottom: 12,
        fontFamily: Theme.Bold,
    },
    SectionContainer: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Theme.PrimaryColor,
        marginHorizontal: 12,
    },
    SchoolContainer: {
        marginVertical: 20,
        backgroundColor: '#f1f4ff',
    },
    SchoolItem: {
        marginBottom: 12,
        flexDirection: 'row',
    },
    SchoolItemText: {
        fontSize: 16,
        marginLeft: 12,
        fontFamily: Theme.SemiBold,
    },
    FormContainer: {
        marginBottom: 6,
        flexDirection: 'column',
    },
    FormWrap: {
        marginVertical: 6,
    },
    FormText: {
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
    FormData: {
        borderRadius: 0,
        borderWidth: 2,
        backgroundColor: '#f1f4ff',
        borderColor: Theme.PrimaryColor,
    },
    RadioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    RadioWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    RadioText: {
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
});
