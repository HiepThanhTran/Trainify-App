import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import AuthFooter from '../../components/auth/AuthFooter';
import AuthForm from '../../components/auth/AuthForm';
import AuthHeader from '../../components/auth/AuthHeader';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import APIs, { endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { signUpFields } from '../../utils/Fields';

const SignUp = ({ navigation }) => {
   const [account, setAccount] = useState({});
   const [loading, setLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   const [errorVisible, setErrorVisible] = useState(false);

   const handleSignUp = async () => {
      for (let field of signUpFields) {
         if (!account[field.name]) {
            setErrorVisible(true);
            setErrorMessage(`${field.label} không được trống`);
            return;
         }
      }

      if (account['password'] !== account['confirm']) {
         setErrorVisible(true);
         setErrorMessage('Mật khẩu không khớp');
         return;
      }

      let form = new FormData();
      for (let key in account) {
         if (key !== 'confirm') {
            form.append(key, account[key]);
         }
      }

      setLoading(true);
      setErrorVisible(false);
      try {
         let response = await APIs.post(endPoints['student-register'], form);

         if (response.status === statusCode.HTTP_201_CREATED) {
            Alert.alert(
               'Đăng ký thành công',
               'Chuyển sang đăng nhập?',
               [
                  {
                     text: 'Đăng nhập',
                     onPress: () => navigation.navigate('SignIn'),
                  },
                  {
                     text: 'Hủy',
                     style: 'cancel',
                  },
               ],
               { cancelable: true },
            );
         }
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_400_BAD_REQUEST) {
            setErrorVisible(true);
            setErrorMessage(error.response.data.detail);
         } else {
            console.error('Sign up:', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <ScrollView style={GlobalStyle.BackGround}>
         <DismissKeyboard>
            <LinearGradient colors={Theme.LinearColors2}>
               <AuthHeader title="Đăng ký" content="Đăng ký để sử dụng hệ thống điểm rèn luyện sinh viên" />
               <AuthForm
                  fields={signUpFields}
                  account={account}
                  setAccount={setAccount}
                  errorVisible={errorVisible}
                  errorMessage={errorMessage}
                  loading={loading}
                  onPressFunc={handleSignUp}
                  buttonText="Đăng ký"
               />
               <AuthFooter navigation={navigation} content="Đã có tài khoản?" screen="SignIn" linkText="Đăng nhập" />
            </LinearGradient>
         </DismissKeyboard>
      </ScrollView>
   );
};

export default SignUp;
