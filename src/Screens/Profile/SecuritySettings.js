import { Ionicons } from '@expo/vector-icons';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import Loading from '../../Components/Common/Loading';
import { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { auth } from '../../Configs/Firebase';
import { SignOutAction } from '../../Store/Actions/AccountAction';
import { useAccountDispatch } from '../../Store/Contexts/AccountContext';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { initialResetPassword } from '../../Utils/Fields';
import { getTokens, refreshAccessToken } from '../../Utils/Utilities';

const SecuritySettings = () => {
   const dispatch = useAccountDispatch();

   const [resetPassword, setResetPassword] = useState(initialResetPassword);
   const [showPassword, setShowPassword] = useState(false);
   const [modalVisible, setModalVisible] = useState(false);

   const handleResetPassword = async () => {
      for (let key in resetPassword) {
         if (!resetPassword[key].value) {
            Alert.alert('Thông báo', `${resetPassword[key].label} không được trống`);
            return;
         }
      }

      if (resetPassword['new_password'].value !== resetPassword['confirm'].value) {
         Alert.alert('Thông báo', 'Mật khẩu không trùng nhau');
         return;
      }

      if (resetPassword['new_password'].value.length < 6) {
         Alert.alert('Thông báo', 'Vui lòng nhập mật khẩu ít nhất 6 kí tự');
         return;
      }

      let form = new FormData();
      for (let key in resetPassword) {
         if (key !== 'confirm') {
            form.append(key, resetPassword[key].value);
         }
      }

      setModalVisible(true);
      const { accessToken, refreshToken } = await getTokens();
      try {
         await reauthenticateUser(resetPassword['old_password'].value);

         await changePassword(resetPassword['new_password'].value);

         await updateUserInfo(accessToken, form);

         Alert.alert('Thông báo', 'Đổi mật khẩu thành công, vui lòng đăng nhập lại!', [
            {
               text: 'OK',
               onPress: () => dispatch(SignOutAction()),
            },
         ]);
      } catch (error) {
         console.error('Reset password:', error);
         if (error.response) {
            if (
               error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
               error.response.status === statusCode.HTTP_403_FORBIDDEN
            ) {
               const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
               if (newAccessToken) {
                  handleResetPassword();
               }
            } else if (error.response && error.response.status === statusCode.HTTP_400_BAD_REQUEST) {
               Alert.alert('Thông báo', error.response.data.detail);
            }
         } else if (error.message && error.message.includes('auth/invalid-credential')) {
            Alert.alert('Thông báo', 'Mật khẩu hiện tại không đúng');
         } else {
            Alert.alert('Thông báo', 'Có lỗi xảy ra khi thực hiện thao tác.');
         }
      } finally {
         setModalVisible(false);
      }
   };

   const reauthenticateUser = async (oldPassword) => {
      const user = auth?.currentUser;
      if (!user?.email) throw new Error('User not authenticated');

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
   };

   const changePassword = async (newPassword) => {
      const user = auth?.currentUser;
      if (!user) throw new Error('User not authenticated');

      await updatePassword(user, newPassword);
   };

   const updateUserInfo = async (accessToken, form) => {
      const response = await authAPI(accessToken).patch(endPoints['me-update'], form);
      if (response.status !== statusCode.HTTP_200_OK) {
         throw new Error('Update failed');
      }
   };

   const updateNewPassword = (field, value) => {
      setResetPassword((prevPassword) => ({
         ...prevPassword,
         [field]: {
            ...prevPassword[field],
            value,
         },
      }));
   };

   return (
      <View style={GlobalStyle.BackGround}>
         <DismissKeyboard>
            <View style={GlobalStyle.Container}>
               <View style={RegisterAssistantStyles.FormRegister}>
                  <Text style={RegisterAssistantStyles.FormRegisterTitle}>Đổi mật khẩu</Text>
                  <View style={RegisterAssistantStyles.RegisterAssistantImageContainer}>
                     <Image
                        style={RegisterAssistantStyles.RegisterAssistantImage}
                        source={require('../../Assets/Images/FormBackground.png')}
                     />
                  </View>
                  <View style={RegisterAssistantStyles.Field}>
                     <View style={RegisterAssistantStyles.InputContainer}>
                        <TextInput
                           value={resetPassword.old_password.value}
                           style={RegisterAssistantStyles.TextInput}
                           placeholder="Mật khẩu hiện tại"
                           secureTextEntry={!showPassword}
                           onChangeText={(value) => updateNewPassword('old_password', value)}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                           <Ionicons
                              name={showPassword ? 'eye-off' : 'eye'}
                              size={24}
                              color="black"
                              style={RegisterAssistantStyles.Icon}
                           />
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View style={RegisterAssistantStyles.Field}>
                     <View style={RegisterAssistantStyles.InputContainer}>
                        <TextInput
                           value={resetPassword.new_password.value}
                           style={RegisterAssistantStyles.TextInput}
                           placeholder="Mật khẩu mới"
                           secureTextEntry={!showPassword}
                           onChangeText={(value) => updateNewPassword('new_password', value)}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                           <Ionicons
                              name={showPassword ? 'eye-off' : 'eye'}
                              size={24}
                              color="black"
                              style={RegisterAssistantStyles.Icon}
                           />
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View style={RegisterAssistantStyles.Field}>
                     <View style={RegisterAssistantStyles.InputContainer}>
                        <TextInput
                           value={resetPassword.confirm.value}
                           style={RegisterAssistantStyles.TextInput}
                           placeholder="Xác nhận mật khẩu mới"
                           secureTextEntry={!showPassword}
                           onChangeText={(value) => updateNewPassword('confirm', value)}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                           <Ionicons
                              name={showPassword ? 'eye-off' : 'eye'}
                              size={24}
                              color="black"
                              style={RegisterAssistantStyles.Icon}
                           />
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View style={RegisterAssistantStyles.ButtonContainer}>
                     <TouchableOpacity style={RegisterAssistantStyles.Button} onPress={handleResetPassword}>
                        <Text style={RegisterAssistantStyles.ButtonText}>Đổi mật khẩu</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </DismissKeyboard>

         <Portal>
            <Modal visible={modalVisible} style={GlobalStyle.Container}>
               <Loading />
            </Modal>
         </Portal>
      </View>
   );
};

const RegisterAssistantStyles = StyleSheet.create({
   FormRegister: {
      width: '100%',
      marginBottom: 50,
   },
   FormRegisterTitle: {
      fontFamily: Theme.Italic,
      fontSize: 18,
      textAlign: 'center',
   },
   RegisterAssistantImageContainer: {
      width: '100%',
      height: 260,
   },
   RegisterAssistantImage: {
      width: '100%',
      height: '100%',
   },
   Field: {
      marginVertical: 10,
      marginLeft: 16,
      marginRight: 16,
   },
   InputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: Theme.PrimaryColor,
      borderRadius: 8,
      padding: 6,
   },
   TextInput: {
      flex: 1,
      height: 40,
      fontSize: 16,
      paddingHorizontal: 12,
   },
   Icon: {
      marginLeft: 10,
   },
   ButtonContainer: {
      alignItems: 'center',
      marginTop: 20,
   },
   Button: {
      backgroundColor: Theme.PrimaryColor,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
   },
   ButtonText: {
      color: 'white',
      fontSize: 18,
      fontFamily: Theme.Bold,
   },
});

export default SecuritySettings;
