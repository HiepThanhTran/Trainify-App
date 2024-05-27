import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import { useEffect, useState } from 'react';
import { Image, Keyboard, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, RadioButton, TextInput } from 'react-native-paper';
import { authAPI, endPoints } from '../../configs/APIs';
import { DEFAULT_USER_COVER, status } from '../../configs/Constants';
import { UpdateAccountAction } from '../../store/actions/AccountAction';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { formatDate } from '../Utils/Utils';
import { EditProfileStyle } from './Style';

const EditProfile = ({ navigation }) => {
    const dispatch = useAccountDispatch();
    const currentAccount = useAccount();

    const [tempAccount, setTempAccount] = useState(currentAccount.data);
    const [modalVisible, setModalVisible] = useState(false);

    const accountFields = [
        {
            label: 'Email',
            name: 'email',
            value: currentAccount.data.email,
            icon: 'email',
            disabled: true,
        },
        {
            label: `Mã số ${currentAccount.data.original_role.toLowerCase()}`,
            name: 'code',
            value: currentAccount.data.user.code,
            icon: 'badge-account',
            disabled: true,
        },
    ];
    const userFields = [
        {
            label: 'Họ',
            name: 'last_name',
            icon: 'account-eye',
        },
        {
            label: 'Tên đệm',
            name: 'middle_name',
            icon: 'account-eye',
        },
        {
            label: 'Tên',
            name: 'first_name',
            icon: 'account-eye',
        },
        {
            label: 'Địa chỉ',
            name: 'address',
            icon: 'map-marker',
        },
        {
            label: 'Số điện thoại',
            name: 'phone_number',
            icon: 'phone',
            keyboardType: 'numeric',
        },
    ];

    const handleSelection = async (requestPermission, launchFunction) => {
        let { status } = await requestPermission();
        if (status !== 'granted') {
            alert('Permissions denied!');
        } else {
            let res = await launchFunction({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

            if (!res.canceled) {
                setTempAccount((current) => ({
                    ...current,
                    avatar: res.assets[0],
                }));
            }
        }
        setModalVisible(false);
    };

    const handleGallerySelection = () =>
        handleSelection(ImagePicker.requestMediaLibraryPermissionsAsync, ImagePicker.launchImageLibraryAsync);

    const handleCameraSelection = () =>
        handleSelection(ImagePicker.requestCameraPermissionsAsync, ImagePicker.launchCameraAsync);

    const handleDatePickerOnChange = (event, selectedDate) => {
        const dateInDesiredFormat = selectedDate.toISOString().split('T')[0];
        updateUserOfTempAccount('date_of_birth', dateInDesiredFormat);
    };

    const getFirstDayOfMoth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const getLastDayOfMoth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: new Date(tempAccount.user.date_of_birth),
            onChange: handleDatePickerOnChange,
            mode: 'date',
            is24Hour: true,
            minimumDate: getFirstDayOfMoth(new Date(tempAccount.user.date_of_birth)),
            maximumDate: getLastDayOfMoth(new Date(tempAccount.user.date_of_birth)),
        });
    };

    const updateUserOfTempAccount = (field, value) => {
        setTempAccount((current) => ({
            ...current,
            user: {
                ...current.user,
                [field]: value,
            },
        }));
    };

    const handleUpdateProfile = async () => {
        let form = new FormData();
        let count = 0;
        if (currentAccount.data.avatar !== tempAccount.avatar) {
            const newUri = 'file:///' + tempAccount.avatar.uri.split('file:/').join('');

            form.append('avatar', {
                uri: tempAccount.avatar.uri,
                type: mime.getType(tempAccount.avatar.uri),
                name: tempAccount.avatar.fileName,
            });
            count++;
        }
        for (let key in tempAccount.user) {
            if (currentAccount.data.user[key] !== tempAccount.user[key]) {
                form.append(key, tempAccount.user[key]);
                count++;
            }
        }

        try {
            if (count > 0) {
                const accessToken = await AsyncStorage.getItem('access-token');
                let res = await authAPI(accessToken).patch(endPoints['me-update'], form);

                if (res.status === status.HTTP_200_OK) {
                    dispatch(UpdateAccountAction(res.data));
                }
            }
        } catch (error) {
            if (error.response) {
                console.error('Response:', error.response.data);
            } else {
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleUpdateProfile} style={[GlobalStyle.Center, GlobalStyle.HeaderButton]}>
                    <Text style={GlobalStyle.HeaderButtonText}>Cập nhật</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, tempAccount]);

    return (
        <View style={GlobalStyle.BackGround}>
            <ScrollView>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => Keyboard.dismiss()}>
                    <View>
                        <Image style={EditProfileStyle.CoverImage} source={{ uri: DEFAULT_USER_COVER }} />
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={GlobalStyle.Center}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Image
                            style={EditProfileStyle.Avatar}
                            source={{
                                uri:
                                    typeof tempAccount.avatar === 'string'
                                        ? tempAccount.avatar
                                        : tempAccount.avatar.uri,
                            }}
                        />
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

                    <View style={EditProfileStyle.FormContainer}>
                        {accountFields.map((f) => (
                            <>
                                <Text style={EditProfileStyle.FormText}>{f.label}</Text>
                                <View style={EditProfileStyle.FormWrap}>
                                    <TextInput
                                        key={f.name}
                                        value={f.value}
                                        disabled={f.disabled}
                                        placeholder={f.label}
                                        style={EditProfileStyle.FormData}
                                        cursorColor={Theme.PrimaryColor}
                                        underlineColor="transparent"
                                        activeUnderlineColor="transparent"
                                        right={<TextInput.Icon icon={f.icon} />}
                                    />
                                </View>
                            </>
                        ))}
                        {userFields.map((f) => (
                            <>
                                <Text style={EditProfileStyle.FormText}>{f.label}</Text>
                                <View style={EditProfileStyle.FormWrap}>
                                    <TextInput
                                        key={f.name}
                                        value={tempAccount.user[f.name]}
                                        disabled={f.disabled}
                                        placeholder={f.label}
                                        style={EditProfileStyle.FormData}
                                        keyboardType={f.keyboardType}
                                        cursorColor={Theme.PrimaryColor}
                                        underlineColor="transparent"
                                        activeUnderlineColor="transparent"
                                        onChangeText={(value) => updateUserOfTempAccount(f.name, value)}
                                        right={<TextInput.Icon icon={f.icon} />}
                                    />
                                </View>
                            </>
                        ))}
                    </View>
                    <View>
                        <View style={EditProfileStyle.FormContainer}>
                            <Text style={EditProfileStyle.FormText}>Giới tính</Text>
                            <View style={EditProfileStyle.FormWrap}>
                                <View style={EditProfileStyle.RadioGroup}>
                                    <View style={EditProfileStyle.RadioWrap}>
                                        <Text style={EditProfileStyle.RadioText}>Nam</Text>
                                        <RadioButton
                                            value="M"
                                            color={Theme.PrimaryColor}
                                            status={tempAccount.user.gender === 'M' ? 'checked' : 'unchecked'}
                                            onPress={() => updateUserOfTempAccount('gender', 'M')}
                                        />
                                    </View>
                                    <View style={EditProfileStyle.RadioWrap}>
                                        <Text style={EditProfileStyle.RadioText}>Nữ</Text>
                                        <RadioButton
                                            value="F"
                                            color={Theme.PrimaryColor}
                                            status={tempAccount.user.gender === 'F' ? 'checked' : 'unchecked'}
                                            onPress={() => updateUserOfTempAccount('gender', 'F')}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={EditProfileStyle.FormContainer}>
                        <Text style={EditProfileStyle.FormText}>Ngày sinh</Text>
                        <TouchableOpacity onPress={showDatePicker} style={EditProfileStyle.FormWrap}>
                            <Text style={{ ...EditProfileStyle.FormData, padding: 16, fontSize: 16 }}>
                                {formatDate(tempAccount.user['date_of_birth'])}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default EditProfile;
