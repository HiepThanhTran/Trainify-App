import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { Icon, TextInput } from 'react-native-paper';
import { UpdateAccountAction } from '../../store/actions/AccountAction';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { EditProfileStyle } from './Style';

const EditProfile = () => {
    const dispatch = useAccountDispatch();
    const currentAccount = useAccount();

    const [tempAccount, setTempAccount] = useState(currentAccount.data);
    const [avatar, setAvatar] = useState(currentAccount.data.avatar);
    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected] = useState('');

    const fields = [
        {
            label: 'Email',
            icon: 'email',
            editable: true,
            value: tempAccount.email,
        },
        {
            label: `Mã số ${tempAccount.original_role}`,
            icon: 'badge-account',
            editable: true,
            value: tempAccount.user.code,
        },
        {
            label: 'Họ',
            icon: '',
            value: tempAccount.user.last_name,
        },
        {
            label: 'Tên đệm',
            icon: '',
            value: tempAccount.user.middle_name,
        },
        {
            label: 'Tên',
            icon: '',
            value: tempAccount.user.first_name,
        },
        {
            label: 'Địa chỉ',
            icon: 'map-marker',
            value: tempAccount.user.address,
        },
        {
            label: 'Số điện thoại',
            icon: 'phone',
            value: currentAccount.data.user.phone_number,
        },
    ];
    const genderData = [
        { key: 'M', value: 'Nam' },
        { key: 'F', value: 'Nữ' },
    ];

    const handleSave = () => {
        dispatch(UpdateAccountAction(tempAccount));
    };

    const updateTempAccount = (field, value) => {
        setTempAccount({ ...tempAccount, [field]: value });
    };

    const handleGallerySelection = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permissions denied!');
        } else {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

            if (!res.canceled) {
                setAvatar(res.assets[0].uri);
            }
        }
        setModalVisible(false);
    };

    const handleCameraSelection = async () => {
        let { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Permissions denied!');
        } else {
            let res = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

            if (!res.canceled) {
                setAvatar(res.assets[0].uri);
            }
        }
        setModalVisible(false);
    };

    return (
        <View style={GlobalStyle.BackGround}>
            <ScrollView>
                <View>
                    {/* <LinearGradient
                        colors={['rgba(62,154,228,1)', 'rgba(255,255,255, 0.8)']}
                        style={EditProfileStyle.CoverImage}
                    /> */}
                    <Image
                        style={EditProfileStyle.CoverImage}
                        source={{
                            uri: 'https://res.cloudinary.com/dtthwldgs/image/upload/v1716737233/default-user-cover.jpg',
                        }}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    style={GlobalStyle.Center}
                    onPress={() => setModalVisible(!modalVisible)}
                >
                    <Image style={EditProfileStyle.Avatar} source={{ uri: avatar }} />
                    <View style={EditProfileStyle.CameraIcon}>
                        <Icon source="camera" color={Theme.PrimaryColor} size={32} />
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(!modalVisible)}
                    >
                        <View style={GlobalStyle.ModalContainer}>
                            <View style={GlobalStyle.ModalView}>
                                <Text style={GlobalStyle.ModalTitle}>Chọn lựa chọn</Text>
                                <TouchableOpacity style={GlobalStyle.ModalButton} onPress={handleGallerySelection}>
                                    <Text style={GlobalStyle.ModalButtonText}>Thư viện</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={GlobalStyle.ModalButton} onPress={handleCameraSelection}>
                                    <Text style={GlobalStyle.ModalButtonText}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={GlobalStyle.ModalButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={GlobalStyle.ModalButtonText}>Hủy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </TouchableOpacity>

                {fields.map((f, index) => (
                    <View key={index}>
                        <View style={EditProfileStyle.InputWrap}>
                            <Text style={EditProfileStyle.InputText}>{f.label}</Text>
                            <View style={EditProfileStyle.Input}>
                                <TextInput
                                    value={f.value}
                                    mode="outlined"
                                    disabled={f.editable}
                                    placeholder={f.label}
                                    right={<TextInput.Icon icon={f.icon} />}
                                />
                            </View>
                        </View>
                    </View>
                ))}
                <View>
                    <View style={EditProfileStyle.InputWrap}>
                        <Text style={EditProfileStyle.InputText}>Giới tính</Text>
                        <View style={EditProfileStyle.Input}>
                            <SelectList
                                data={genderData}
                                search={false}
                                save="value"
                                setSelected={(val) => setSelected(val)}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default EditProfile;
