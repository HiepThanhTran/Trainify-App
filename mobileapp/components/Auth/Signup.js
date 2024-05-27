import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Keyboard, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import APIs, { endPoints } from '../../configs/APIs';
import { status } from '../../configs/Constants';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import AuthStyle from './Style';

const Signup = ({ navigation }) => {
    const [account, setAccount] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fields = [
        {
            label: 'Mã số sinh viên',
            name: 'code',
            icon: 'badge-account',
            keyboardType: 'numeric',
            errorMsg: 'Mã số sinh viên không được trống',
        },
        {
            label: 'Email',
            name: 'email',
            icon: 'email',
            keyboardType: 'email-address',
            errorMsg: 'Email không được trống',
        },
        {
            label: 'Mật khẩu',
            name: 'password',
            secureTextEntry: !passwordVisible,
            icon: passwordVisible ? 'eye-off' : 'eye',
            errorMsg: 'Mật khẩu không được trống',
        },
        {
            label: 'Xác nhận mật khẩu',
            name: 'confirm',
            secureTextEntry: !passwordVisible,
            icon: passwordVisible ? 'eye-off' : 'eye',
            errorMsg: 'Vui lòng xác nhận mật khẩu!',
        },
    ];

    const handleSignup = async () => {
        for (let field of fields) {
            if (!account[field.name]) {
                setErrorVisible(true);
                setErrorMsg(field.errorMsg);
                return;
            }
        }

        if (account['password'] !== account['confirm']) {
            setErrorVisible(true);
            setErrorMsg('Mật khẩu không khớp');
            return;
        }

        let form = new FormData();
        for (let key in account) if (key !== 'confirm') form.append(key, account[key].trim());

        setErrorMsg('');
        setLoading(true);
        setErrorVisible(false);
        try {
            let res = await APIs.post(endPoints['student-register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) setModalVisible(!modalVisible);
        } catch (error) {
            if (error.response) {
                if (error.response.status === status.HTTP_400_BAD_REQUEST) {
                    setErrorVisible(true);
                    setErrorMsg(error.response.data.detail);
                }
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error(`Error message: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateAccount = (field, value) => {
        setAccount({ ...account, [field]: value });
    };

    return (
        <ScrollView style={GlobalStyle.BackGround}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => Keyboard.dismiss()}>
                <View style={AuthStyle.Container}>
                    <LinearGradient colors={['rgba(62,154,228,1)', 'rgba(62,154,228,0.8)']} style={{ flex: 1 }}>
                        <View style={AuthStyle.Header}>
                            <Text style={AuthStyle.HeaderTitle}>Đăng ký</Text>
                            <Text style={AuthStyle.SubTitle}>Đăng ký để sử dụng hệ thống điểm rèn luyện sinh viên</Text>
                        </View>

                        <View style={AuthStyle.Form}>
                            <HelperText type="error" visible={errorVisible} style={GlobalStyle.HelpText}>
                                {errorMsg}
                            </HelperText>
                            {fields.map((f) => (
                                <TextInput
                                    key={f.name}
                                    value={account[f.name]}
                                    placeholder={f.label}
                                    style={AuthStyle.Input}
                                    keyboardType={f.keyboardType}
                                    secureTextEntry={f.secureTextEntry}
                                    cursorColor={Theme.PrimaryColor}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    onChangeText={(value) => updateAccount(f.name, value)}
                                    right={
                                        <TextInput.Icon
                                            icon={f.icon}
                                            onPress={
                                                f.name === 'password' || 'confirm'
                                                    ? () => setPasswordVisible(!passwordVisible)
                                                    : null
                                            }
                                        />
                                    }
                                />
                            ))}

                            <Button
                                loading={loading}
                                icon="account"
                                textColor="white"
                                style={AuthStyle.Button}
                                onPress={handleSignup}
                            >
                                <Text variant="headlineLarge" style={AuthStyle.ButtonText}>
                                    Đăng ký
                                </Text>
                            </Button>

                            <Modal
                                animationType="fade"
                                visible={modalVisible}
                                transparent={true}
                                onRequestClose={() => setModalVisible(!modalVisible)}
                            >
                                <View style={GlobalStyle.ModalContainer}>
                                    <View style={GlobalStyle.ModalView}>
                                        <Text style={GlobalStyle.ModalTitle}>Đăng ký thành công</Text>
                                        <Button
                                            onPress={() => navigation.navigate('Signin')}
                                            icon="account"
                                            textColor="white"
                                            style={AuthStyle.Button}
                                        >
                                            <Text variant="headlineLarge" style={AuthStyle.ButtonText}>
                                                Đăng nhập
                                            </Text>
                                        </Button>
                                    </View>
                                </View>
                            </Modal>

                            <View style={AuthStyle.Footer}>
                                <Text style={GlobalStyle.Bold}>Đã có tài khoản?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                                    <Text style={AuthStyle.FooterText}>Đăng nhập</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Signup;
