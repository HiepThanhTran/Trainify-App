import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import GlobalStyle from '../../styles/Style';
import AuthStyle from './Style';

const Signup = () => {
    const [role, setRole] = useState('Chọn vai trò');
    const [click, setClick] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    // Hide keyboard
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Add TouchableOpacity to hide keyboard */}
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={dismissKeyboard}>
                <View style={AuthStyle.LoginContainer}>
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
                            {/* Input */}
                            <Animated.View
                                entering={FadeInDown.delay(200).duration(1000).springify()}
                                style={AuthStyle.Input}
                            >
                                <TextInput
                                    placeholder="Email"
                                    placeholderTextColor={'gray'}
                                    style={GlobalStyle.Regular}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Animated.View>

                            <Animated.View
                                entering={FadeInDown.delay(400).duration(1000).springify()}
                                style={AuthStyle.Input}
                            >
                                <View style={AuthStyle.Password}>
                                    <TextInput
                                        placeholder="Mật khẩu"
                                        placeholderTextColor={'gray'}
                                        style={[GlobalStyle.Regular, { position: 'relative', width: '90%' }]}
                                        secureTextEntry={!showPassword}
                                    />

                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <AntDesign name={showPassword ? 'eye' : 'eyeo'} size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>

                            <Animated.View
                                entering={FadeInDown.delay(600).duration(1000).springify()}
                                style={AuthStyle.Input}
                            >
                                <TextInput placeholder="Mã số sinh viên" placeholderTextColor={'gray'} />
                            </Animated.View>
                            {/* Button Signup */}
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
                                <TouchableOpacity onPress={() => navigation.push('Login')}>
                                    <Text style={[GlobalStyle.Bold, { color: '#1873bc' }, { marginLeft: 5 }]}>
                                        Đăng nhập
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </GestureHandlerRootView>
    );
};

export default Signup;
