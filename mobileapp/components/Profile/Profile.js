import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { SignOutAction } from '../../store/actions/AccountAction';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { ProfileStyle } from './Style';

const Profile = ({ navigation }) => {
    const dispatch = useAccountDispatch();
    const currentAccount = useAccount();

    const Sections = [
        {
            title: 'Tiện ích',
            items: [
                { label: 'Điểm rèn luyện', icon: 'star-outline' },
                { label: 'Hoạt động đã đăng ký', icon: 'ticket-account' },
                { label: 'Hoạt động đã tham gia', icon: 'check-decagram-outline' },
            ],
        },
        {
            title: 'Cài đặt',
            items: [
                { label: 'Cài đặt bảo mật', icon: 'shield-account' },
                { label: 'Cài đặt thông báo', icon: 'bell-outline' },
                { label: 'Cài đặt chung', icon: 'cog-outline' },
            ],
        },
        {
            title: 'Trợ giúp',
            items: [
                { label: 'Trung tâm trợ giúp', icon: 'help-circle-outline' },
                // { label: '', icon: '' },
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

    const goToScreen = (name) => navigation.navigate(name);

    return (
        <LinearGradient
            end={{ x: 0.5, y: 0.5 }}
            colors={['rgba(62,154,228,1)', 'rgba(255,255,255, 0.8)']}
            style={{ flex: 1 }}
        >
            <ScrollView>
                <View style={[GlobalStyle.Container, ProfileStyle.Header]}>
                    <Image style={ProfileStyle.Avatar} source={{ uri: currentAccount.data.avatar }} />
                    <View style={GlobalStyle.Center}>
                        <Text style={[GlobalStyle.Bold, { fontSize: 24 }]}>
                            {currentAccount.data.user.last_name} {currentAccount.data.user.middle_name}{' '}
                            {currentAccount.data.user.first_name}
                        </Text>
                        <Text style={[GlobalStyle.Medium, { color: 'gray', fontSize: 16 }]}>
                            {currentAccount.data.user.code}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => goToScreen('EditProfile')}
                        style={[GlobalStyle.Center, ProfileStyle.HeaderButton]}
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
                                <TouchableOpacity key={itemIndex} onPress={null} style={ProfileStyle.SectionItem}>
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
                <View style={[GlobalStyle.Center, ProfileStyle.Footer]}>
                    <TouchableOpacity onPress={handleSignout} style={[GlobalStyle.Center, ProfileStyle.FooterButton]}>
                        <Icon color="white" source="logout" size={20} />
                        <Text style={ProfileStyle.ButtonText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default Profile;
