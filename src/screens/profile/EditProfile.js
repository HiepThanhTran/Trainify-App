import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon, Portal, RadioButton, Snackbar, TextInput } from 'react-native-paper';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Loading from '../../components/common/Loading';
import { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { UpdateAccountAction } from '../../store/actions/AccountAction';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import GlobalStyle, { screenHeight, screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { accountFields, schoolFields, tabsEditForm, userFields } from '../../utils/Fields';
import { formatDate, getFirstDayOfYear, getLastDayOfYear, getTokens, refreshAccessToken } from '../../utils/Utilities';

const SchoolInformation = ({ navigation, currentAccount }) => {
   useEffect(() => {
      navigation.setOptions({ headerRight: null });
   }, [navigation]);

   return (
      <View style={{ ...EditProfileStyle.SchoolContainer, ...EditProfileStyle.SectionContainer }}>
         <Text style={EditProfileStyle.Header}>Thông tin trường</Text>
         {schoolFields.map((f) => {
            const name = currentAccount?.data?.user[f.name] ?? 'Không có';
            return (
               <View key={f.name} style={EditProfileStyle.SchoolItem}>
                  <Icon color={Theme.PrimaryColor} source={f.icon} size={28} />
                  <View style={{ flex: 1 }}>
                     <Text style={EditProfileStyle.SchoolItemText}>{`${f.label}: ${name}`}</Text>
                  </View>
               </View>
            );
         })}
      </View>
   );
};

const EditForm = ({ navigation, currentAccount, loading, setLoading }) => {
   const dispatch = useAccountDispatch();

   const [tempAccount, setTempAccount] = useState(currentAccount);
   const [snackBarMessage, setSnackBarMessage] = useState('');
   const [snackBarVisible, setSnackBarVisible] = useState(false);
   const [snackBarDuration, setSnackBarDuration] = useState(7000);

   useEffect(() => {
      renderHeaderButton();
   }, [navigation, currentAccount, tempAccount]);

   const handleUpdateProfile = async () => {
      let form = new FormData();
      let size = 0;

      if (currentAccount.data.avatar !== tempAccount.data.avatar) {
         form.append('avatar', {
            uri: tempAccount.data.avatar.uri,
            type: mime.getType(tempAccount.data.avatar.uri),
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
         let res = await authAPI(accessToken).patch(endPoints['me-update'], form, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === statusCode.HTTP_200_OK) {
            dispatch(UpdateAccountAction(res.data));
            setSnackBarMessage('Cập nhật thành công');
         }
      } catch (error) {
         if (
            error.response &&
            (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
               error.response.status === statusCode.HTTP_403_FORBIDDEN)
         ) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) handleUpdateProfile();
            else setSnackBarMessage('Có lỗi xảy ra khi cập nhật');
         } else console.error(error);
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

   const renderHeaderButton = () => {
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
   };

   const renderDatePicker = () => {
      DateTimePickerAndroid.open({
         value: new Date(tempAccount.data.user.date_of_birth),
         onChange: handleDatePickerOnChange,
         mode: 'date',
         is24Hour: true,
         display: 'spinner',
         minimumDate: getFirstDayOfYear(new Date(tempAccount.data.user.date_of_birth)),
         maximumDate: getLastDayOfYear(new Date(tempAccount.data.user.date_of_birth)),
      });
   };

   return (
      <View style={{ ...EditProfileStyle.FormContainer, ...EditProfileStyle.SectionContainer }}>
         <Text style={EditProfileStyle.Header}>Thông tin cá nhân</Text>
         {accountFields(currentAccount).map((f) => (
            <View key={f.name} style={EditProfileStyle.FormWrap}>
               <Text style={EditProfileStyle.FormText}>{f.label}</Text>
               <TextInput
                  value={f.value}
                  disabled={f.disabled}
                  placeholder={f.label}
                  style={EditProfileStyle.FormData}
                  cursorColor={Theme.PrimaryColor}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  right={<TextInput.Icon icon={f.icon} pointerEvents="none" />}
               />
            </View>
         ))}
         {userFields.map((f) => (
            <View key={f.name} style={EditProfileStyle.FormWrap}>
               <Text style={EditProfileStyle.FormText}>{f.label}</Text>
               <TextInput
                  value={tempAccount.data.user[f.name]}
                  disabled={f.disabled}
                  placeholder={f.label}
                  style={EditProfileStyle.FormData}
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
            <Text style={EditProfileStyle.FormText}>Giới tính</Text>
            <View style={EditProfileStyle.FormWrap}>
               <View style={EditProfileStyle.RadioGroup}>
                  <View style={EditProfileStyle.RadioWrap}>
                     <Text style={EditProfileStyle.RadioText}>Nam</Text>
                     <RadioButton
                        value="M"
                        color={Theme.PrimaryColor}
                        status={tempAccount.data.user.gender === 'M' ? 'checked' : 'unchecked'}
                        onPress={() => updateUserOfTempAccount('gender', 'M')}
                     />
                  </View>
                  <View style={EditProfileStyle.RadioWrap}>
                     <Text style={EditProfileStyle.RadioText}>Nữ</Text>
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
         <Text style={EditProfileStyle.FormText}>Ngày sinh</Text>
         <TouchableOpacity onPress={renderDatePicker} style={EditProfileStyle.FormWrap}>
            <Text style={{ ...EditProfileStyle.FormData, padding: 16, fontSize: 16 }}>
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
                     <Text style={EditProfileStyle.SnackbarText}>Đang cập nhật...</Text>
                  </Loading>
               )}
            </Snackbar>
         </Portal>
      </View>
   );
};

const EditProfile = ({ navigation }) => {
   const { loading, setLoading } = useGlobalContext();
   const currentAccount = useAccount();

   const sheetRef = useRef(BottomSheet);
   const [choice, setChoice] = useState(1);
   const [isEdit, setIsEdit] = useState(false);

   const handleGallerySelection = () =>
      handleSelection(ImagePicker.requestMediaLibraryPermissionsAsync, ImagePicker.launchImageLibraryAsync);

   const handleCameraSelection = () =>
      handleSelection(ImagePicker.requestCameraPermissionsAsync, ImagePicker.launchCameraAsync);

   const handleSelection = async (requestPermission, launchFunction) => {
      let { status } = await requestPermission();
      if (status !== 'granted') {
         Alert.alert('Thông báo', 'Không có quyền truy cập!');
      } else {
         let res = await launchFunction({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
         });

         if (!res.canceled) {
            setTempAccount((prevTempAccount) => ({
               ...prevTempAccount,
               data: {
                  ...prevTempAccount.data,
                  avatar: res.assets[0],
               },
            }));
            setCanUpdate(true);
         }
      }
      sheetRef?.current?.close();
   };

   return (
      <GestureHandlerRootView>
         <View style={GlobalStyle.BackGround}>
            <ScrollView showsVerticalScrollIndicator={false}>
               <DismissKeyboard onPress={() => sheetRef?.current?.close()}>
                  <LinearGradient
                     colors={Theme.LinearColors4}
                     start={{ x: 0, y: 1 }}
                     end={{ x: 1, y: 0 }}
                     style={EditProfileStyle.AvatarContainer}
                  >
                     <View style={EditProfileStyle.AvatarTouch}>
                        <TouchableOpacity
                           activeOpacity={0.5}
                           disabled={!isEdit}
                           onPress={() => sheetRef?.current?.expand()}
                        >
                           <Image style={EditProfileStyle.Avatar} source={{ uri: currentAccount.data.avatar }} />
                           {isEdit && (
                              <View style={EditProfileStyle.CameraIcon}>
                                 <Icon source="camera" color="white" size={24} />
                              </View>
                           )}
                        </TouchableOpacity>
                     </View>
                  </LinearGradient>

                  <View style={EditProfileStyle.ChoiceContainer}>
                     {tabsEditForm.map((f) => (
                        <TouchableOpacity
                           key={f.id}
                           style={EditProfileStyle.ChoiceButton}
                           disabled={f.id === choice ? true : false}
                           onPress={() => {
                              setChoice(f.id);
                              setIsEdit(!isEdit);
                              sheetRef?.current?.close();
                           }}
                        >
                           <Text
                              style={{
                                 ...EditProfileStyle.ChoiceText,
                                 ...(f.id === choice ? { fontFamily: Theme.Bold, color: 'black' } : {}),
                              }}
                           >
                              {f.label}
                           </Text>
                           <View
                              style={{ ...EditProfileStyle.ChoiceDot, ...(f.id === choice ? { opacity: 1 } : {}) }}
                           />
                        </TouchableOpacity>
                     ))}
                  </View>

                  {isEdit ? (
                     <EditForm
                        navigation={navigation}
                        currentAccount={currentAccount}
                        loading={loading}
                        setLoading={setLoading}
                     />
                  ) : (
                     <SchoolInformation navigation={navigation} currentAccount={currentAccount} />
                  )}
               </DismissKeyboard>
            </ScrollView>
         </View>

         <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={['25%']}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: '#273238' }}
            handleIndicatorStyle={{ backgroundColor: 'white' }}
         >
            <BottomSheetView style={EditProfileStyle.AvatarSelection}>
               <TouchableOpacity style={EditProfileStyle.Selection} onPress={handleGallerySelection}>
                  <Icon source="image-multiple" color="white" size={24} />
                  <Text style={EditProfileStyle.AvatarSelectionText}>Chọn ảnh từ thư viện</Text>
               </TouchableOpacity>
            </BottomSheetView>
            <BottomSheetView style={EditProfileStyle.AvatarSelection}>
               <TouchableOpacity style={EditProfileStyle.Selection} onPress={handleCameraSelection}>
                  <Icon source="camera" color="white" size={24} />
                  <Text style={EditProfileStyle.AvatarSelectionText}>Chụp ảnh từ camera</Text>
               </TouchableOpacity>
            </BottomSheetView>
         </BottomSheet>
      </GestureHandlerRootView>
   );
};

const EditProfileStyle = StyleSheet.create({
   AvatarContainer: {
      height: screenHeight / 4,
   },
   AvatarTouch: {
      position: 'absolute',
      alignItems: 'center',
      left: 0,
      right: 0,
      bottom: -screenHeight / 20,
   },
   Avatar: {
      width: 140,
      height: 140,
      borderWidth: 4,
      borderRadius: 140 / 2,
      borderColor: Theme.SecondaryColor,
      backgroundColor: Theme.SecondaryColor,
   },
   CameraIcon: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 4,
      left: screenWidth / 4,
      zIndex: 999,
      backgroundColor: '#273238',
      borderRadius: 36 / 2,
   },
   AvatarSelection: {
      padding: 16,
      marginBottom: 12,
      backgroundColor: '#273238',
   },
   Selection: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   AvatarSelectionText: {
      fontFamily: Theme.SemiBold,
      fontSize: 20,
      color: 'white',
      marginLeft: 16,
   },
   ChoiceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginTop: 40,
   },
   ChoiceButton: {
      padding: 8,
      alignItems: 'center',
   },
   ChoiceText: {
      fontSize: 16,
      color: 'gray',
      marginBottom: 8,
      fontFamily: Theme.SemiBold,
   },
   ChoiceDot: {
      width: 6,
      height: 6,
      opacity: 0,
      borderRadius: 12,
      backgroundColor: 'black',
   },
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
      marginHorizontal: 12,
   },
   SchoolContainer: {
      marginBottom: 20,
      backgroundColor: Theme.SecondaryColor,
   },
   SchoolItem: {
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   SchoolItemText: {
      fontSize: 16,
      marginLeft: 12,
      fontFamily: Theme.SemiBold,
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

export default EditProfile;
