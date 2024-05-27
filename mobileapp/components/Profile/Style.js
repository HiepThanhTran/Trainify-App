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
    BackgroundImage: {
        flexWrap: 'wrap',
        margin: 12,
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
        left: width / 5.2,
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
