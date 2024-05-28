import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { SignOutAction } from '../../store/actions/AccountAction';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle, { screenHeight, screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';

const Profile = ({ navigation }) => {
    const dispatch = useAccountDispatch();
    const currentAccount = useAccount();

    const Sections = [
        {
            title: 'Tiện ích',
            items: [
                { label: 'Điểm rèn luyện', icon: 'star-outline', screen: 'TrainingPoint' },
                { label: 'Hoạt động của sinh viên', icon: 'ticket', screen: '' },
            ]
        },
        {
            title: 'Cài đặt',
            items: [
                { label: 'Cài đặt bảo mật', icon: 'shield-account', screen: '' },
                { label: 'Cài đặt thông báo', icon: 'bell-outline', screen: '' },
                // { label: 'Cài đặt chung', icon: 'cog-outline', screen: '' },
            ],
        },
        {
            title: 'Trợ giúp',
            items: [
                { label: 'Trung tâm trợ giúp', icon: 'help-circle-outline', screen: '' },
                // { label: '', icon: '', screen: '' },
            ],
        },
    ];

    const handleSignout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn chắc chắn muốn đăng xuất?',
            [
                { text: 'Đăng xuất', onPress: () => dispatch(SignOutAction()) },
                { text: 'Hủy', style: 'cancel' },
            ],
            { cancelable: true },
        );
    };

    const goToScreen = (name) =>
        navigation.navigate('ProfileStack', {
            screen: name,
        });

    return (
        <LinearGradient
            end={{ x: 0.5, y: 0.5 }}
            colors={['rgba(62,154,228,1)', 'rgba(255,255,255, 0.8)']}
            style={{ flex: 1 }}
        >
            <ScrollView>
                <View style={{ ...GlobalStyle.Container, ...ProfileStyle.Header }}>
                    <Image style={ProfileStyle.Avatar} source={{ uri: currentAccount.data.avatar }} />
                    <View style={GlobalStyle.Center}>
                        <Text style={{ ...GlobalStyle.Bold, fontSize: 24 }}>
                            {currentAccount.data.user.last_name} {currentAccount.data.user.middle_name}{' '}
                            {currentAccount.data.user.first_name}
                        </Text>
                        <Text style={{ ...GlobalStyle.Medium, color: 'gray', fontSize: 16 }}>
                            {currentAccount.data.user.code}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => goToScreen('EditProfile')}
                        style={{ ...GlobalStyle.Center, ...ProfileStyle.HeaderButton }}
                    >
                        <Text style={ProfileStyle.ButtonText}>Trang cá nhân</Text>
                        <Icon color="white" source="chevron-right" size={20} />
                    </TouchableOpacity>
                </View>
                {Sections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={ProfileStyle.Section}>
                        <Text style={ProfileStyle.SectionTitle}>{section.title}</Text>
                        <View style={ProfileStyle.SectionBody}>
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    key={itemIndex}
                                    onPress={() => goToScreen(item.screen)}
                                    style={ProfileStyle.SectionItem}
                                >
                                    <View style={ProfileStyle.SectionItemLeft}>
                                        <Icon color={Theme.PrimaryColor} source={item.icon} size={24} />
                                        <Text style={ProfileStyle.TextItemLeft}>{item.label}</Text>
                                    </View>
                                    <View>
                                        <Icon source="chevron-right" size={24} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
                <View style={{ ...GlobalStyle.Center, ...ProfileStyle.Footer }}>
                    <TouchableOpacity
                        onPress={handleSignout}
                        style={{ ...GlobalStyle.Center, ...ProfileStyle.FooterButton }}
                    >
                        <Icon color="white" source="logout" size={20} />
                        <Text style={ProfileStyle.ButtonText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const borderRadiusHeader = 16;

const ProfileStyle = StyleSheet.create({
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

export default Profile;
