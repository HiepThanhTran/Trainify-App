import React, { useState } from 'react';
import { FlatList, Image, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import MyStyles from "../../styles/MyStyles";
import LoginAndRegisterStyles from "./LoginAndRegisterStyles";
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import Signup from './Signup';

const Roles = [
    { key: 'STU', role: "Sinh viên" },
    { key: 'ASST', role: "Trợ lý sinh viên" },
    { key: 'SPC', role: "Chuyên viên cộng tác sinh viên" },
]

const Login = () => {
    const [role, setRole] = useState('Chọn vai trò');
    const [click, setClick] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    // Function to hide keyboard
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* Add TouchableOpacity to hide keyboard */}
            <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={dismissKeyboard}
            >
                <View style={LoginAndRegisterStyles.LoginContainer}>
                    <Image style={LoginAndRegisterStyles.ImageBackground} source={require('../../assets/images/background.png')} />

                    {/* Light */}
                    <View style={LoginAndRegisterStyles.LightContainer}>
                        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} style={LoginAndRegisterStyles.Light1} source={require('../../assets/images/light.png')} />
                        <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} style={LoginAndRegisterStyles.Light2} source={require('../../assets/images/light.png')} />
                    </View>

                    {/* Title And Form */}
                    <View style={LoginAndRegisterStyles.TitleAndForm}>
                        {/* Title */}
                        <View style={LoginAndRegisterStyles.TitleContainer}>
                            <Animated.Text entering={FadeInUp.duration(1000).springify()} style={[MyStyles.Bold, LoginAndRegisterStyles.Title]}>Đăng nhập</Animated.Text>
                        </View>

                        {/* Form */}
                        <View style={LoginAndRegisterStyles.Form}>
                            {/* DropDownList */}
                            <Animated.View entering={FadeInDown.duration(1000).springify()} style={{ width: '100%', position: 'relative', zIndex: 1 }}>
                                <TouchableOpacity style={LoginAndRegisterStyles.DropdownSelector} onPress={() => {
                                    setClick(!click);
                                }}>
                                    <Text style={[MyStyles.Regular, { color: 'black' }]}>{role}</Text>
                                    {click ? (
                                        <AntDesign name="up" size={20} color="black" />
                                    ) : (
                                        <AntDesign name="down" size={24} color="black" />
                                    )}
                                </TouchableOpacity>
                                {click ?
                                    <View style={LoginAndRegisterStyles.DropdownArea}>
                                        <FlatList
                                            data={Roles}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <TouchableOpacity style={LoginAndRegisterStyles.RoleItem} onPress={() => {
                                                        setRole(item.role);
                                                        setClick(false);
                                                    }}>
                                                        <Text>{item.role}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                    </View> : null
                                }
                            </Animated.View>
                            {/* Input */}
                            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} style={LoginAndRegisterStyles.Input}>
                                <TextInput 
                                    placeholder="Email" 
                                    placeholderTextColor={'gray'} 
                                    style={MyStyles.Regular}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                />
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} style={LoginAndRegisterStyles.Input}>
                                <View style={LoginAndRegisterStyles.Password}>
                                    <TextInput
                                        placeholder="Mật khẩu"
                                        placeholderTextColor={'gray'}
                                        style={[MyStyles.Regular, { position: 'relative', width: '90%' }]}
                                        secureTextEntry={!showPassword}
                                    />

                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <AntDesign name={showPassword ? "eye" : "eyeo"} size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>

                            {/* Button Login */}
                            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={{ width: '100%' }}>
                                <TouchableOpacity style={LoginAndRegisterStyles.Button}>
                                    <Text style={[MyStyles.Bold, LoginAndRegisterStyles.ButtonText]}>Đăng nhập</Text>
                                </TouchableOpacity>
                            </Animated.View>

                            {/* Register */}
                            <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} style={LoginAndRegisterStyles.Detail}>
                                <Text style={MyStyles.SemiBold}>Bạn chưa có tài khoản?</Text>
                                <TouchableOpacity onPress={() => navigation.push('Signup')}>
                                    <Text style={[MyStyles.Bold, { color: '#1873bc' }, { marginLeft: 5 }]}>Đăng ký</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </GestureHandlerRootView>
    )
}

export default Login;
