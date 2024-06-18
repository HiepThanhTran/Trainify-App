import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Portal, RadioButton, Snackbar, TextInput } from 'react-native-paper';
import { authAPI, endPoints } from '../../../Configs/APIs';
import { statusCode } from '../../../Configs/Constants';
import { UpdateAccountAction } from '../../../Store/Actions/AccountAction';
import { useAccount, useAccountDispatch } from '../../../Store/Contexts/AccountContext';
import GlobalStyle from '../../../Styles/Style';
import Theme from '../../../Styles/Theme';
import { accountFields, userFields } from '../../../Utils/Fields';
import { getFirstDayOfYear, getLastDayOfYear, getTokens, refreshAccessToken } from '../../../Utils/Utilities';
import Loading from '../../Common/Loading';

const EditView = ({ navigation, tempAccount, setTempAccount }) => {
   const dispatch = useAccountDispatch();
   const currentAccount = useAccount();

   const [loading, setLoading] = useState(false);
   const [isRendered, setIsRendered] = useState(false);
   const [snackBarMessage, setSnackBarMessage] = useState('');
   const [snackBarVisible, setSnackBarVisible] = useState(false);
   const [snackBarDuration, setSnackBarDuration] = useState(7000);

   useEffect(() => {
      setIsRendered(true);
   }, []);

   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableOpacity
               onPress={handleEditProfile}
               style={{ ...GlobalStyle.Center, ...GlobalStyle.HeaderButton }}
            >
               <Text style={GlobalStyle.HeaderButtonText}>Cập nhật</Text>
            </TouchableOpacity>
         ),
      });
   }, [navigation, currentAccount, tempAccount]);

   const handleEditProfile = async () => {
      let form = new FormData();
      let size = 0;

      if (currentAccount.data.avatar !== tempAccount.data.avatar) {
         form.append('avatar', tempAccount.data.avatar);
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
               handleEditProfile();
            }
         } else {
            console.error('Update profile:', error);
            setSnackBarMessage('Có lỗi xảy ra khi cập nhật');
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

   const handleDatePickerOnChange = (event, selectedDate) =>
      updateUserOfTempAccount('date_of_birth', moment(selectedDate).format('YYYY-MM-DD'));

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
               {moment(tempAccount.data.user.date_of_birth).format('DD/MM/YYYY')}
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
   SectionContainer: {
      borderRadius: 8,
      marginHorizontal: 16,
   },
   FormContainer: {
      marginTop: -20,
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
