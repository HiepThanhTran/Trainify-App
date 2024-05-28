import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';

const borderRadiusHeader = 16;

export const ProfileStyle = StyleSheet.create({
    Header: {
        backgroundColor: 'white',
        marginTop: screenHeight * 0.1,
        height: screenHeight * 0.2,
        borderRadius: borderRadiusHeader,
        marginHorizontal: 12,
    },
    Avatar: {
        marginTop: -screenHeight * 0.1,
        width: screenWidth * 0.2,
        height: screenWidth * 0.2,
        borderWidth: 4,
        borderRadius: (screenWidth * 0.2) / 2,
        borderColor: 'white',
        backgroundColor: Theme.SecondaryColor,
    },
    HeaderButton: {
        backgroundColor: Theme.PrimaryColor,
        padding: 8,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        borderBottomLeftRadius: borderRadiusHeader,
        borderBottomRightRadius: borderRadiusHeader,
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
    AvatarContainer: {
        flexWrap: 'wrap',
        marginHorizontal: 12,
        marginVertical: 20,
        padding: 4,
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e1e1e',
    },
    FullName: {
        flex: 1,
        fontSize: 24,
        fontFamily: Theme.Bold,
        textAlign: 'center',
    },
    Avatar: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'lightgrey',
    },
    CameraIcon: {
        position: 'absolute',
        bottom: -2,
        left: screenWidth / 5.2,
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
        marginBottom: 20,
        backgroundColor: Theme.SecondaryColor,
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
        backgroundColor: Theme.SecondaryColor,
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
    SnackbarText: {
        fontFamily: Theme.SemiBold,
        color: 'white',
        marginRight: 8,
    },
});
