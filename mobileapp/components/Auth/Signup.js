import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput, Button } from 'react-native-paper';
import AuthStyle from './Style';
import GlobalStyle from '../../styles/Style';
import { useNavigation } from '@react-navigation/native';
import Theme from '../../styles/Theme';

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigation();
    return (
        <View style={AuthStyle.Container}>
            <LinearGradient
                colors={["rgba(62,154,228,1)", "rgba(62,154,228,0.8)"]}
                style={{ flex: 1 }}
            >
                <View style={AuthStyle.Header}>
                    <Text style={AuthStyle.HeaderTitle}>Đăng ký</Text>
                    <Text style={AuthStyle.SubTitle}>Đăng ký để sử dụng hệ thống điểm rèn luyện sinh viên</Text>
                </View>

                <View style={AuthStyle.Footer}>
                    <TextInput
                        style={AuthStyle.Input}
                        keyboardType='numeric' // Added keyboardType prop here
                        placeholder='Mã số sinh viên'
                        autoCapitalize='none'
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        cursorColor="#3e9ae4"
                        right={<TextInput.Icon icon="badge-account" />}
                    />

                    <TextInput
                        style={AuthStyle.Input}
                        keyboardType='email-address'
                        placeholder='Email'
                        autoCapitalize='none'
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        cursorColor="#3e9ae4"
                        right={<TextInput.Icon icon="email" />}
                    />

                    <TextInput
                        style={AuthStyle.Input}
                        secureTextEntry={!passwordVisible}
                        placeholder='Mật khẩu'
                        autoCapitalize='none'
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        cursorColor="#3e9ae4"
                        right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)} />}
                    />

                    <TextInput
                        style={AuthStyle.Input}
                        secureTextEntry={!passwordVisible}
                        placeholder='Xác nhận mật khẩu'
                        autoCapitalize='none'
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        cursorColor="#3e9ae4"
                        right={<TextInput.Icon icon={passwordVisible ? "eye-off" : "eye"} onPress={() => setPasswordVisible(!passwordVisible)} />}
                    />

                    <Button style={AuthStyle.Button}>
                        <Text style={AuthStyle.ButtonText}>Đăng ký</Text>
                    </Button>
                  
                    <View style={AuthStyle.Detail}>
                        <Text style={{fontFamily: Theme.Bold}}>Bạn đã có tài khoản?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                            <Text style={{fontFamily: Theme.Bold, marginLeft: 5, color: Theme.PrimaryColor}}>
                                Đăng nhập
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

export default Signup;
