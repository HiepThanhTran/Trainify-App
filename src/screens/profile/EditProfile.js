import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-paper';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import EditView from '../../components/profile/editProfile/EditView';
import SchoolInformationView from '../../components/profile/editProfile/SchoolInformationView';
import { useAccount } from '../../store/contexts/AccountContext';
import GlobalStyle, { screenHeight, screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { tabsEditForm } from '../../utils/Fields';

const EditProfile = ({ navigation }) => {
   const currentAccount = useAccount();

   const sheetRef = useRef(BottomSheet);

   const [tab, setTab] = useState('school');
   const [loading, setLoading] = useState(false);
   const [isRendered, setIsRendered] = useState(false);
   const [tempAccount, setTempAccount] = useState(currentAccount);

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
         }
      }
      sheetRef?.current?.close();
   };

   const handleChangeTab = (tabName) => {
      setTab(tabName);
      sheetRef?.current?.close();
   };

   const currentTab = (name) => tab === name;

   const tabContent = () => {
      switch (tab) {
         case 'school':
            return <SchoolInformationView navigation={navigation} />;
         case 'edit':
            return (
               <EditView
                  navigation={navigation}
                  tempAccount={tempAccount}
                  setTempAccount={setTempAccount}
                  loading={loading}
                  setLoading={setLoading}
               />
            );
         default:
            return null;
      }
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
                           disabled={!currentTab('edit')}
                           onPress={() => sheetRef?.current?.expand()}
                        >
                           <Image
                              style={EditProfileStyle.Avatar}
                              source={{
                                 uri:
                                    typeof tempAccount.data.avatar === 'string'
                                       ? tempAccount.data.avatar
                                       : tempAccount.data.avatar.uri,
                              }}
                           />
                           {currentTab('edit') && (
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
                           key={f.name}
                           style={EditProfileStyle.ChoiceButton}
                           disabled={f.name === tab ? true : false}
                           onPress={() => handleChangeTab(f.name)}
                        >
                           <Text
                              style={{
                                 ...EditProfileStyle.ChoiceText,
                                 ...(f.name === tab ? { fontFamily: Theme.Bold, color: 'black' } : {}),
                              }}
                           >
                              {f.label}
                           </Text>
                           <View style={{ ...EditProfileStyle.ChoiceDot, opacity: f.name === tab ? 1 : 0 }} />
                        </TouchableOpacity>
                     ))}
                  </View>

                  {tabContent()}
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
            <BottomSheetView style={GlobalStyle.BottomSheetView}>
               <TouchableOpacity style={GlobalStyle.BottomSheetItem} onPress={handleGallerySelection}>
                  <Icon source="image-multiple" color="white" size={24} />
                  <Text style={GlobalStyle.BottomSheetItemText}>Chọn ảnh từ thư viện</Text>
               </TouchableOpacity>
            </BottomSheetView>
            <BottomSheetView style={GlobalStyle.BottomSheetView}>
               <TouchableOpacity style={GlobalStyle.BottomSheetItem} onPress={handleCameraSelection}>
                  <Icon source="camera" color="white" size={24} />
                  <Text style={GlobalStyle.BottomSheetItemText}>Chụp ảnh từ camera</Text>
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
});

export default EditProfile;
