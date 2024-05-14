import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MyStyles from "../../styles/MyStyles";
import LoginAndRegisterStyles from "./LoginAndRegisterStyles";

const Roles = [
  { key: 1, role: "Sinh viên" },
  { key: 2, role: "Chuyên viên CTSV" },
  { key: 3, role: "Trợ lý sinh viên" },
]

const Login = () => {
  const [role, setRole] = useState('Chọn vai trò');
  const [click, setClick] = useState(false);
  const [data, setData] = useState(Roles);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={LoginAndRegisterStyles.LoginContainer}>
        <Image style={LoginAndRegisterStyles.ImageBackground} source={require('../../assets/images/background.png')} />

        {/* Light */}
        <View style={LoginAndRegisterStyles.LightContainer}>
          <Image style={LoginAndRegisterStyles.Light1} source={require('../../assets/images/light.png')} />
          <Image style={LoginAndRegisterStyles.Light2} source={require('../../assets/images/light.png')} />
        </View>

        {/* Title And Form */}
        <View style={LoginAndRegisterStyles.TitleAndForm}>
          {/* Title */}
          <View style={LoginAndRegisterStyles.TitleContainer}>
            <Text style={[MyStyles.Bold, LoginAndRegisterStyles.Title]}>Đăng nhập</Text>
          </View>

          {/* Form */}
          <View style={LoginAndRegisterStyles.Form}>
            {/* DropDownList */}
            <View style={{ width: '100%' }}>
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
            </View>
            {/* Input */}
            <View style={LoginAndRegisterStyles.Input}>
              <TextInput placeholder="Email" placeholderTextColor={'gray'} style={MyStyles.Regular} />
            </View>

            <View style={LoginAndRegisterStyles.Input}>
              <TextInput placeholder="Mật khẩu" placeholderTextColor={'gray'} style={MyStyles.Regular} />
            </View>

            {/* Button Login */}
            <View style={{ width: '100%' }}>
              <TouchableOpacity style={LoginAndRegisterStyles.Button}>
                <Text style={[MyStyles.Bold, LoginAndRegisterStyles.ButtonText]}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

export default Login;
