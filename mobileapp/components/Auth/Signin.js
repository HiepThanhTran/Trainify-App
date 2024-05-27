import { CLIENT_ID, CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Keyboard, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { status } from '../../configs/Constants';
import { SigninAction } from '../../store/actions/AccountAction';
import { useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import AuthStyle from './Style';

const Signin = ({ navigation }) => {
    const dispatch = useAccountDispatch();

    const [account, setAccount] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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

    const handleSignin = async () => {
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
            let tokens = await APIs.post(endPoints['token'], {
                ...account,
                grant_type: 'password',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            });

            await AsyncStorage.multiSet([
                ['access-token', tokens.data.access_token],
                ['refresh-token', tokens.data.refresh_token],
            ]);

            setTimeout(async () => {
                let user = await authAPI(tokens.data.access_token).get(endPoints['me']);

                if (user.status === status.HTTP_200_OK) {
                    dispatch(SigninAction(user.data));
                    // navigation.navigate('MainTabs');
                }
            }, 100);
        } catch (error) {
            if (error.response) {
                if (error.response.status === status.HTTP_400_BAD_REQUEST) {
                    setErrorVisible(true);
                    setErrorMsg('Email hoặc mật khẩu không chính xác');
                }
            } else {
                console.error(error);
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
                            <Text style={AuthStyle.HeaderTitle}>Đăng nhập</Text>
                            <Text style={AuthStyle.SubTitle}>
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
                                    cursorColor={Theme.PrimaryColor}
                                    underlineColor="transparent"
                                    activeUnderlineColor="transparent"
                                    onChangeText={(value) => updateAccount(f.name, value)}
                                    right={
                                        <TextInput.Icon
                                            icon={f.icon}
                                            onPress={
                                                f.name === 'password'
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
                                onPress={handleSignin}
                            >
                                <Text variant="headlineLarge" style={AuthStyle.ButtonText}>
                                    Đăng nhập
                                </Text>
                            </Button>

                            <View style={AuthStyle.Footer}>
                                <Text style={GlobalStyle.Bold}>Chưa có tài khoản?</Text>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row' }}
                                    onPress={() => navigation.navigate('Signup')}
                                >
                                    <Text style={AuthStyle.FooterText}>Đăng ký</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Signin;
