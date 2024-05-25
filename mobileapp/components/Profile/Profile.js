import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Icon, PaperProvider, Portal, Text } from 'react-native-paper';
import { useAccount, useAccountDispatch } from '../../contexts/AccountContext';
import { SIGN_OUT } from '../../reducers/AccountReducer';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { ProfileStyle } from './Style';

const Profile = ({ navigation }) => {
    const [dialogVisible, setDialogVisible] = useState(false);

    const dispatch = useAccountDispatch();
    const account = useAccount();

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

    const handleSignout = () => dispatch({ type: SIGN_OUT });

    const toggleDialog = () => setDialogVisible(!dialogVisible);

    const goToScreen = (name) => navigation.navigate(name)

    return (
        <LinearGradient
            end={{ x: 0.5, y: 0.5 }}
            colors={['rgba(62,154,228,1)', 'rgba(255,255,255, 0.8)']}
            style={{ flex: 1 }}
        >
            <ScrollView>
                <PaperProvider>
                    <View style={[GlobalStyle.Container, ProfileStyle.Header]}>
                        <View style={[GlobalStyle.Center, ProfileStyle.AvatarContainer]}>
                            <Image style={ProfileStyle.Avatar} source={{ uri: account.data.avatar }} />
                        </View>
                        <View style={GlobalStyle.Center}>
                            <Text style={[GlobalStyle.Bold, { fontSize: 24 }]}>
                                {account.data.user.last_name} {account.data.user.middle_name}{' '}
                                {account.data.user.first_name}
                            </Text>
                            <Text style={[GlobalStyle.Medium, { color: 'gray', fontSize: 16 }]}>
                                {account.data.user.code}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => goToScreen('Personal')}
                            style={[GlobalStyle.Center, ProfileStyle.HeaderButton]}
                        >
                            <Text style={ProfileStyle.ButtonText}>Trang cá nhân</Text>
                            <Icon color="white" source="chevron-right" size={20} />
                        </TouchableOpacity>
                    </View>
                    {Sections.map((section) => (
                        <View style={ProfileStyle.Section}>
                            <Text style={ProfileStyle.SectionTitle}>{section.title}</Text>
                            <View style={ProfileStyle.SectionBody}>
                                {section.items.map((item) => (
                                    <TouchableOpacity onPress={null} style={ProfileStyle.SectionItem}>
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
                        <TouchableOpacity
                            onPress={toggleDialog}
                            style={[GlobalStyle.Center, ProfileStyle.FooterButton]}
                        >
                            <Icon color="white" source="logout" size={20} />
                            <Text style={ProfileStyle.ButtonText}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </View>

                    <Portal>
                        <Dialog style={{ backgroundColor: 'white' }} visible={dialogVisible} onDismiss={toggleDialog}>
                            <Dialog.Title>Đăng xuất</Dialog.Title>
                            <Dialog.Content>
                                <Text variant="bodyLarge">Bạn chắc chắn muốn đăng xuất?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button textColor={Theme.PrimaryColor} onPress={handleSignout}>
                                    Đăng xuất
                                </Button>
                                <Button textColor={Theme.PrimaryColor} onPress={toggleDialog}>
                                    Hủy
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </PaperProvider>
            </ScrollView>
        </LinearGradient>
    );
};

export default Profile;
