import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Portal, RadioButton, Snackbar, TextInput } from 'react-native-paper';
import { authAPI, endPoints } from '../../../configs/APIs';
import { statusCode } from '../../../configs/Constants';
import { UpdateAccountAction } from '../../../store/actions/AccountAction';
import { useAccount, useAccountDispatch } from '../../../store/contexts/AccountContext';
import GlobalStyle from '../../../styles/Style';
import Theme from '../../../styles/Theme';
import { accountFields, userFields } from '../../../utils/Fields';
import {
   formatDate,
   getFirstDayOfYear,
   getLastDayOfYear,
   getTokens,
   refreshAccessToken,
} from '../../../utils/Utilities';
import Loading from '../../common/Loading';

const EditView = ({ navigation, tempAccount, setTempAccount }) => {
   const dispatch = useAccountDispatch();
   const currentAccount = useAccount();

   const [loading, setLoading] = useState(false);
   const [isRendered, setIsRendered] = useState(false);
   const [snackBarMessage, setSnackBarMessage] = useState('');
   const [snackBarVisible, setSnackBarVisible] = useState(false);
   const [snackBarDuration, setSnackBarDuration] = useState(7000);

   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableOpacity
               onPress={handleUpdateProfile}
               style={{
                  ...GlobalStyle.Center,
                  ...GlobalStyle.HeaderButton,
               }}
            >
               <Text style={{ ...GlobalStyle.HeaderButtonText }}>Cập nhật</Text>
            </TouchableOpacity>
         ),
      });

      setIsRendered(true);
   }, [navigation, currentAccount, tempAccount]);

   const handleUpdateProfile = async () => {
      let form = new FormData();
      let size = 0;

      if (currentAccount.data.avatar !== tempAccount.data.avatar) {
         form.append('avatar', {
            uri: tempAccount.data.avatar.uri,
            type: tempAccount.data.avatar.mimeType,
            name: tempAccount.data.avatar.fileName,
         });
         size++;
      }

      for (let key in tempAccount.data.user) {
         if (currentAccount.data.user[key] !== tempAccount.data.user[key]) {
            form.append(key, tempAccount.data.user[key]);
            size++;
         }
      }

      if (size <= 0) return;

      setLoading(true);
      setSnackBarVisible(true);
      setSnackBarDuration(300000);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let response = await authAPI(accessToken).patch(endPoints['me-update'], form);

         if (response.status === statusCode.HTTP_200_OK) {
            dispatch(UpdateAccountAction(response.data));
            setSnackBarMessage('Cập nhật thành công');
         }
      } catch (error) {
         if (
            error.response &&
            (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
               error.response.status === statusCode.HTTP_403_FORBIDDEN)
         ) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) {
               handleUpdateProfile();
            } else {
               setSnackBarMessage('Có lỗi xảy ra khi cập nhật');
            }
         } else {
            console.error('Update profile', error);
         }
      } finally {
         setLoading(false);
         setSnackBarDuration(7000);
      }
   };

   const updateUserOfTempAccount = (field, value) => {
      setTempAccount((prevTempAccount) => ({
         ...prevTempAccount,
         data: {
            ...prevTempAccount.data,
            user: {
               ...prevTempAccount.data.user,
               [field]: value,
            },
         },
      }));
   };

   const handleDatePickerOnChange = (event, selectedDate) => {
      const dateInDesiredFormat = selectedDate.toISOString().split('T')[0];
      updateUserOfTempAccount('date_of_birth', dateInDesiredFormat);
   };

   const renderDatePicker = () => {
      DateTimePickerAndroid.open({
         value: new Date(tempAccount.data.user.date_of_birth),
         onChange: handleDatePickerOnChange,
         mode: 'date',
         is24Hour: true,
         minimumDate: getFirstDayOfYear(new Date(tempAccount.data.user.date_of_birth)),
         maximumDate: getLastDayOfYear(new Date(tempAccount.data.user.date_of_birth)),
      });
   };

   if (!isRendered) return <Loading />;

   return (
      <View style={{ ...EditViewStyle.FormContainer, ...EditViewStyle.SectionContainer }}>
         <Text style={EditViewStyle.Header}>Thông tin cá nhân</Text>
         {accountFields(currentAccount).map((f) => (
            <View key={f.name} style={EditViewStyle.FormWrap}>
               <Text style={EditViewStyle.FormText}>{f.label}</Text>
               <TextInput
                  value={f.value}
                  disabled={f.disabled}
                  placeholder={f.label}
                  style={EditViewStyle.FormData}
                  cursorColor={Theme.PrimaryColor}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  right={<TextInput.Icon icon={f.icon} pointerEvents="none" />}
               />
            </View>
         ))}
         {userFields.map((f) => (
            <View key={f.name} style={EditViewStyle.FormWrap}>
               <Text style={EditViewStyle.FormText}>{f.label}</Text>
               <TextInput
                  value={tempAccount.data.user[f.name]}
                  disabled={f.disabled}
                  placeholder={f.label}
                  style={EditViewStyle.FormData}
                  keyboardType={f.keyboardType}
                  cursorColor={Theme.PrimaryColor}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  onChangeText={(value) => updateUserOfTempAccount(f.name, value)}
                  right={<TextInput.Icon icon={f.icon} pointerEvents="none" />}
               />
            </View>
         ))}
         <View>
            <Text style={EditViewStyle.FormText}>Giới tính</Text>
            <View style={EditViewStyle.FormWrap}>
               <View style={EditViewStyle.RadioGroup}>
                  <View style={EditViewStyle.RadioWrap}>
                     <Text style={EditViewStyle.RadioText}>Nam</Text>
                     <RadioButton
                        value="M"
                        color={Theme.PrimaryColor}
                        status={tempAccount.data.user.gender === 'M' ? 'checked' : 'unchecked'}
                        onPress={() => updateUserOfTempAccount('gender', 'M')}
                     />
                  </View>
                  <View style={EditViewStyle.RadioWrap}>
                     <Text style={EditViewStyle.RadioText}>Nữ</Text>
                     <RadioButton
                        value="F"
                        color={Theme.PrimaryColor}
                        status={tempAccount.data.user.gender === 'F' ? 'checked' : 'unchecked'}
                        onPress={() => updateUserOfTempAccount('gender', 'F')}
                     />
                  </View>
               </View>
            </View>
         </View>
         <Text style={EditViewStyle.FormText}>Ngày sinh</Text>
         <TouchableOpacity onPress={renderDatePicker} style={EditViewStyle.FormWrap}>
            <Text style={{ ...EditViewStyle.FormData, padding: 16, fontSize: 16 }}>
               {formatDate(tempAccount.data.user.date_of_birth)}
            </Text>
         </TouchableOpacity>

         <Portal>
            <Snackbar
               duration={snackBarDuration}
               visible={snackBarVisible}
               onDismiss={() => setSnackBarVisible(false)}
               action={!loading ? { label: 'Tắt', onPress: () => setSnackBarVisible(false) } : null}
            >
               {!loading ? (
                  snackBarMessage
               ) : (
                  <Loading size="small" style={{ flexDirection: 'row' }}>
                     <Text style={EditViewStyle.SnackbarText}>Đang cập nhật...</Text>
                  </Loading>
               )}
            </Snackbar>
         </Portal>
      </View>
   );
};

const EditViewStyle = StyleSheet.create({
   Header: {
      fontSize: 20,
      marginBottom: 12,
      fontFamily: Theme.Bold,
   },
   SectionContainer: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: Theme.PrimaryColor,
      marginHorizontal: 8,
   },
   FormContainer: {
      marginBottom: 6,
      flexDirection: 'column',
   },
   FormWrap: {
      marginVertical: 6,
   },
   FormText: {
      fontSize: 16,
      marginBottom: 4,
      fontFamily: Theme.SemiBold,
   },
   FormData: {
      borderRadius: 0,
      borderWidth: 2,
      backgroundColor: Theme.SecondaryColor,
      borderColor: Theme.PrimaryColor,
   },
   RadioGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
   },
   RadioWrap: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   RadioText: {
      fontSize: 16,
      fontFamily: Theme.SemiBold,
   },
   SnackbarText: {
      fontFamily: Theme.SemiBold,
      color: 'white',
      marginRight: 8,
   },
});

export default EditView;
