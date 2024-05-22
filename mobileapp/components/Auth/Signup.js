import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import APIs, { endPoints } from '../../configs/APIs';
import GlobalStyle from '../../styles/Style';
import AuthStyle from './Style';

const Signup = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const fields = [
        {
            label: 'Mã số sinh viên',
            name: 'code',
            icon: 'account',
            entering: FadeInDown.delay(200).duration(1000).springify(),
        },
        {
            label: 'Email',
            name: 'email',
            icon: 'email',
            entering: FadeInDown.delay(400).duration(1000).springify(),
        },
        {
            label: 'Mật khẩu',
            name: 'password',
            secureTextEntry: !showPassword,
            icon: showPassword ? 'eye-off' : 'eye',
            entering: FadeInDown.delay(600).duration(1000).springify(),
        },
        {
            label: 'Xác nhận mật khẩu',
            name: 'confirm',
            secureTextEntry: !showPassword,
            icon: showPassword ? 'eye-off' : 'eye',
            entering: FadeInDown.delay(800).duration(1000).springify(),
        },
    ];

    const signup = async () => {
        setLoading(true);
        try {
            let form = new FormData();
            for (let key in user) {
                if (key !== 'confirm') {
                    form.append(key, user[key]);
                }
            }

            let res = await APIs.post(endPoints['student-register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) navigation.navigate('Signin');
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (field, value) => {
        setUser((current) => {
            return { ...current, [field]: value };
        });
    };

    return (
        <View style={AuthStyle.LoginContainer}>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Image style={AuthStyle.ImageBackground} source={require('../../assets/images/background.png')} />
                    {/* Light */}
                    <View style={AuthStyle.LightContainer}>
                        <Animated.Image
                            entering={FadeInUp.delay(200).duration(1000).springify()}
                            style={AuthStyle.Light1}
                            source={require('../../assets/images/light.png')}
                        />
                        <Animated.Image
                            entering={FadeInUp.delay(400).duration(1000).springify()}
                            style={AuthStyle.Light2}
                            source={require('../../assets/images/light.png')}
                        />
                    </View>

                    {/* Title And Form */}
                    <View style={AuthStyle.TitleAndForm}>
                        {/* Title */}
                        <View style={AuthStyle.TitleContainer}>
                            <Animated.Text
                                entering={FadeInUp.duration(1000).springify()}
                                style={[GlobalStyle.Bold, AuthStyle.Title]}
                            >
                                Đăng ký
                            </Animated.Text>
                        </View>

                        {/* Form */}
                        <View style={AuthStyle.Form}>
                            {fields.map((f) => (
                                <Animated.View entering={f.entering} style={AuthStyle.InputWrap}>
                                    <TextInput
                                        onChangeText={(value) => updateUser(f.name, value)}
                                        style={(GlobalStyle.Regular, AuthStyle.Input)}
                                        key={f.name}
                                        value={user[f.name]}
                                        placeholder={f.label}
                                        cursorColor="#3e9ae4"
                                        underlineColor="white"
                                        activeUnderlineColor="white"
                                        secureTextEntry={f.secureTextEntry}
                                        right={
                                            <TextInput.Icon
                                                icon={f.icon}
                                                onPress={() => setShowPassword(!showPassword)}
                                            />
                                        }
                                    />
                                </Animated.View>
                            ))}

                            <Animated.View
                                entering={FadeInDown.delay(800).duration(1000).springify()}
                                style={{ width: '100%' }}
                            >
                                <TouchableOpacity style={AuthStyle.Button}>
                                    <Text style={[GlobalStyle.Bold, AuthStyle.ButtonText, { letterSpacing: 1 }]}>
                                        Đăng ký
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>

                            {/* Login */}
                            <Animated.View
                                entering={FadeInDown.delay(800).duration(1000).springify()}
                                style={AuthStyle.Detail}
                            >
                                <Text style={GlobalStyle.SemiBold}>Bạn đã có tài khoản?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                                    <Text style={[GlobalStyle.Bold, { color: '#1873bc' }, { marginLeft: 5 }]}>
                                        Đăng nhập
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

export default Signup;
