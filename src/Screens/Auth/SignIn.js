import { CLIENT_ID, CLIENT_SECRET } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import AuthFooter from '../../Components/Auth/AuthFooter';
import AuthForm from '../../Components/Auth/AuthForm';
import AuthHeader from '../../Components/Auth/AuthHeader';
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import APIs, { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { auth } from '../../Configs/Firebase';
import { SignInAction } from '../../Store/Actions/AccountAction';
import { useAccountDispatch } from '../../Store/Contexts/AccountContext';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { signInFields } from '../../Utils/Fields';
import { setTokens } from '../../Utils/Utilities';

const SignIn = ({ navigation }) => {
   const dispatch = useAccountDispatch();

   const [account, setAccount] = useState({});
   const [loading, setLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   const [errorVisible, setErrorVisible] = useState(false);

   const handleSignIn = async () => {
      for (const field of signInFields) {
         if (!account[field.name]) {
            setErrorVisible(true);
            setErrorMessage(`${field.label} không được trống`);
            return;
         }
      }

      setLoading(true);
      setErrorVisible(false);

      const data = {
         ...account,
         grant_type: 'password',
         client_id: CLIENT_ID,
         client_secret: CLIENT_SECRET,
      };

      try {
         const tokens = await APIs.post(endPoints['token'], data, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         if (tokens.status !== statusCode.HTTP_200_OK) {
            setErrorVisible(true);
            setErrorMessage('Đăng nhập thất bại');
            throw new Error('Token request failed');
         }

         const response = await authAPI(tokens.data.access_token).get(endPoints['me']);

         if (response.status !== statusCode.HTTP_200_OK) {
            setErrorVisible(true);
            setErrorMessage('Lấy thông tin người dùng thất bại');
            throw new Error('User data fetch failed');
         }

         await signInWithEmailAndPassword(auth, account['username'], account['password']);

         await setTokens(tokens);
         dispatch(SignInAction(response.data));
      } catch (error) {
         if (error.message.includes('auth/invalid-credential')) {
            createUserWithEmailAndPassword(auth, account['username'], account['password'])
               .then(() => handleSignIn())
               .catch((error) => {
                  console.error(`Error sign in: ${error}`);
                  Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
               });
         } else if (error.response && error.response.status === statusCode.HTTP_400_BAD_REQUEST) {
            setErrorVisible(true);
            setErrorMessage('Email hoặc mật khẩu không chính xác');
         } else {
            console.error('Sign in:', error);
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
               <AuthHeader title="Đăng nhập" content="Đăng nhập để sử dụng hệ thống điểm rèn luyện sinh viên" />
               <AuthForm
                  navigation={navigation}
                  fields={signInFields}
                  account={account}
                  setAccount={setAccount}
                  errorVisible={errorVisible}
                  errorMessage={errorMessage}
                  loading={loading}
                  onPressFunc={handleSignIn}
                  buttonText="Đăng nhập"
               />
               <AuthFooter navigation={navigation} content="Chưa có tài khoản?" screen="SignUp" linkText="Đăng ký" />
            </LinearGradient>
         </DismissKeyboard>
      </ScrollView>
   );
};

export default SignIn;
