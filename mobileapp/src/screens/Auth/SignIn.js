import { CLIENT_ID, CLIENT_SECRET } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Keyboard, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import AuthFormButton from '../../components/Auth/AuthFormButton';
import AuthFormInput from '../../components/Auth/AuthFormInput';
import Helper from '../../components/Helper';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { status } from '../../configs/Constants';
import { SignInAction } from '../../store/actions/AccountAction';
import { useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle from '../../styles/Style';
import AuthStyle from './Style';

const SignIn = ({ navigation }) => {
    const dispatch = useAccountDispatch();

    const [account, setAccount] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

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

    const handleSignIn = async () => {
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

                if (user.status === status.HTTP_200_OK) dispatch(SignInAction(user.data));
            }, 100);
        } catch (error) {
            if (error.response) {
                if (error.response.status === status.HTTP_400_BAD_REQUEST) {
                    setErrorVisible(true);
                    setErrorMsg('Email hoặc mật khẩu không chính xác');
                }
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
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
                <LinearGradient colors={['rgba(62,154,228,1)', 'rgba(62,154,228,0.8)']} style={{ flex: 1 }}>
                    <View style={AuthStyle.HeaderContainer}>
                        <Text style={AuthStyle.HeaderTitle}>Đăng nhập</Text>
                        <Text style={AuthStyle.HeaderBody}>
                            Chào mừng bạn đến với hệ thống điểm rèn luyện sinh viên{' '}
                        </Text>
                    </View>

                    <View style={AuthStyle.Form}>
                        <Helper type="error" visible={errorVisible} message={errorMsg} />
                        {fields.map((f) => (
                            <AuthFormInput
                                field={f}
                                account={account}
                                updateAccount={updateAccount}
                                passwordVisible={passwordVisible}
                                setPasswordVisible={setPasswordVisible}
                            />
                        ))}

                        <AuthFormButton text="Đăng nhập" loading={loading} onPress={handleSignIn} />
                    </View>

                    <View style={AuthStyle.FooterContainer}>
                        <Text style={GlobalStyle.Bold}>Chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={AuthStyle.FooterText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SignIn;
