import { CLIENT_ID, CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { SIGN_IN } from '../../configs/Constants';
import { useAccountDispatch } from '../../configs/Context';
import GlobalStyle from '../../styles/Style';
import AuthStyle from './Style';

const Signin = ({ navigation }) => {
    const [account, setAccount] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const dispatch = useAccountDispatch();
    const fields = [
        {
            label: 'Email',
            name: 'username',
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
    ];

    const signin = async () => {
        for (let field of fields) {
            if (!account[field.name]) {
                setErrorVisible(true);
                setErrorMsg(field.errorMsg);
                return;
            }
        }

        setErrorMsg('');
        setLoading(true);
        setErrorVisible(false);
        try {
            let res = await APIs.post(endPoints['login'], {
                ...account,
                grant_type: 'password',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            });

			await AsyncStorage.setItem('token', res.data.access_token);

            setTimeout(async () => {
                let user = await authAPI(res.data.access_token).get(endPoints['me']);

                dispatch({
                    type: SIGN_IN,
                    payload: user.data,
                });

                navigation.navigate('MainTab');
            }, 100);
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                setErrorVisible(true);
                setErrorMsg('Email hoặc mật khẩu không chính xác');
            } else console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const updateAccount = (field, value) => {
        setAccount((current) => {
            return { ...current, [field]: value };
        });
    };

    return (
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => Keyboard.dismiss()}>
            <View style={AuthStyle.Container}>
                <LinearGradient colors={['rgba(62,154,228,1)', 'rgba(62,154,228,0.8)']} style={{ flex: 1 }}>
                    <View style={AuthStyle.Header}>
                        <Text style={[AuthStyle.HeaderTitle, GlobalStyle.Bold]}>Đăng nhập</Text>
                        <Text style={[AuthStyle.SubTitle, GlobalStyle.Bold]}>
                            Chào mừng bạn đến với hệ thống điểm rèn luyện sinh viên
                        </Text>
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
                                cursorColor="#3e9ae4"
                                underlineColor="transparent"
                                activeUnderlineColor="transparent"
                                onChangeText={(value) => updateAccount(f.name, value)}
                                right={
                                    <TextInput.Icon
                                        icon={f.icon}
                                        onPress={
                                            f.name === 'password' ? () => setPasswordVisible(!passwordVisible) : null
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
                            onPress={signin}
                        >
                            <Text variant="headlineLarge" style={[AuthStyle.ButtonText, GlobalStyle.Bold]}>
                                Đăng nhập
                            </Text>
                        </Button>

                        <View style={AuthStyle.Footer}>
                            <Text style={GlobalStyle.Bold}>Chưa có tài khoản?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={[GlobalStyle.Bold, { color: '#1873bc' }, { marginLeft: 5 }]}>Đăng ký</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );
};

export default Signin;
