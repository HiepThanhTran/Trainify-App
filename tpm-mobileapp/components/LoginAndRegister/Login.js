import { View, Text, Image } from "react-native";
import MyStyles from "../../styles/MyStyles";
import LoginAndRegisterStyles from "./LoginAndRegisterStyles";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";

const Login = () => {
  return (
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
          <View style={LoginAndRegisterStyles.Input}>
            <TextInput placeholder="Email" placeholderTextColor={'gray'} />
          </View>

          <View style={LoginAndRegisterStyles.Input}>
            <TextInput placeholder="Mật khẩu" placeholderTextColor={'gray'} />
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
  )
}

export default Login;