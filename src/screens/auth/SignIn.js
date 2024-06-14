import { CLIENT_ID, CLIENT_SECRET } from '@env';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import AuthFooter from '../../components/auth/AuthFooter';
import AuthForm from '../../components/auth/AuthForm';
import AuthHeader from '../../components/auth/AuthHeader';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { SignInAction } from '../../store/actions/AccountAction';
import { useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { signInFields } from '../../utils/Fields';
import { setTokens } from '../../utils/Utilities';

const SignIn = ({ navigation }) => {
   const dispatch = useAccountDispatch();

   const [account, setAccount] = useState({});
   const [loading, setLoading] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   const [errorVisible, setErrorVisible] = useState(false);

   const handleSignIn = async () => {
      for (let field of signInFields) {
         if (!account[field.name]) {
            setErrorVisible(true);
            setErrorMessage(field.errorMessage);
            return;
         }
      }

      setLoading(true);
      setErrorVisible(false);
      try {
         let tokens = await APIs.post(
            endPoints['token'],
            {
               ...account,
               grant_type: 'password',
               client_id: CLIENT_ID,
               client_secret: CLIENT_SECRET,
            },
            {
               headers: {
                  'Content-Type': 'application/json',
               },
            },
         );

         const { accessToken } = await setTokens(tokens);

         setTimeout(async () => {
            let response = await authAPI(accessToken).get(endPoints['me']);

            if (response.status === statusCode.HTTP_200_OK) {
               dispatch(SignInAction(response.data));
            }
         }, 100);
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_400_BAD_REQUEST) {
            setErrorVisible(true);
            setErrorMessage('Email hoặc mật khẩu không chính xác');
         } else {
            console.error('Sign in', error);
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
