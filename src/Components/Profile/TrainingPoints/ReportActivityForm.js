import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { authAPI, endPoints } from '../../../Configs/APIs';
import { statusCode } from '../../../Configs/Constants';
import GlobalStyle from '../../../Styles/Style';
import Theme from '../../../Styles/Theme';
import { getTokens, refreshAccessToken } from '../../../Utils/Utilities';
import Loading from '../../Common/Loading';

const ReportActivityForm = ({ navigation, route }) => {
   const { activityID } = route?.params;

   const refRichReportContent = useRef(null);
   const refScrollView = useRef(ScrollView);

   const [reportForm, setReportForm] = useState({});
   const [modalVisible, setModalVisible] = useState(false);

   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableOpacity
               style={{ ...GlobalStyle.Center, ...GlobalStyle.HeaderButton }}
               onPress={handleReportActivity}
            >
               <Text style={{ ...GlobalStyle.HeaderButtonText }}>Gửi</Text>
            </TouchableOpacity>
         ),
      });
   }, [navigation, reportForm]);

   const handleReportActivity = async () => {
      let form = new FormData();
      let size = 0;
      for (let field in reportForm) {
         if (reportForm[field]) {
            form.append(field, reportForm[field]);
            size++;
         }
      }

      setModalVisible(true);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let response = await authAPI(accessToken).post(
            endPoints['activity-report'](activityID),
            size > 0 ? form : null,
         );

         if (response.status === statusCode.HTTP_201_CREATED) {
            message = 'Báo thiếu thành công, vui lòng chờ xác nhận!';
         } else if (response.status === statusCode.HTTP_204_NO_CONTENT) {
            message = 'Hủy báo thiếu thành công!';
         }
         Alert.alert('Thông báo', message, [
            {
               text: 'OK',
               onPress: () => navigation.goBack(),
            },
         ]);
      } catch (error) {
         if (error.response) {
            if (
               error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
               error.response.status === statusCode.HTTP_403_FORBIDDEN
            ) {
               const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
               if (newAccessToken) {
                  handleReportActivity();
               }
            }
         } else {
            console.error('API Error:', error.response ? error.response.data : error.message);
            console.error('Report activity:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi thực hiện thao tác.');
         }
      } finally {
         setModalVisible(false);
      }
   };

   const updateReportForm = (field, value) => {
      setReportForm((prevState) => ({
         ...prevState,
         [field]: value,
      }));
   };

   const handleGallerySelection = async () => {
      let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
         Alert.alert('Thông báo', 'Không có quyền truy cập!');
      } else {
         let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
         });

         if (!res.canceled) {
            updateReportForm('evidence', {
               uri: res.assets[0].uri,
               type: res.assets[0].mimeType,
               name: res.assets[0].fileName,
            });
         }
      }
   };

   const handleRichEditorOnChange = (value) => {
      updateReportForm('content', value);
      refScrollView?.current?.scrollToEnd();
   };

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={ReportFormStyle.FormContainerReport}>
            <View style={ReportFormStyle.FieldContainer}>
               <Text style={ReportFormStyle.FieldTitle}>Minh chứng</Text>
               <RichToolbar
                  editor={refRichReportContent}
                  selectedIconTint="#873c1e"
                  iconTint="#312921"
                  style={ReportFormStyle.RichEditorToolbar}
                  actions={[
                     actions.insertImage,
                     actions.setBold,
                     actions.setItalic,
                     actions.insertBulletsList,
                     actions.insertOrderedList,
                     actions.setStrikethrough,
                     actions.setUnderline,
                     actions.removeFormat,
                  ]}
               />
               <ScrollView ref={refScrollView} style={ReportFormStyle.RichEditor}>
                  <RichEditor
                     ref={refRichReportContent}
                     style={ReportFormStyle.RichEditorText}
                     multiline={true}
                     placeholder="Mô tả minh chứng của bạn"
                     androidHardwareAccelerationDisabled={true}
                     onChange={handleRichEditorOnChange}
                     showsVerticalScrollIndicator={false}
                     showsHorizontalScrollIndicator={false}
                  />
               </ScrollView>
            </View>

            <View style={ReportFormStyle.FieldContainer}>
               <Text style={ReportFormStyle.FieldTitle}>Hình ảnh minh chứng</Text>
               <TouchableOpacity style={ReportFormStyle.ImageReportContainer} onPress={handleGallerySelection}>
                  {reportForm?.evidence ? (
                     <Image source={{ uri: reportForm?.evidence.uri }} style={ReportFormStyle.ImageReport} />
                  ) : (
                     <Ionicons name="image-outline" size={40} color="black" />
                  )}
               </TouchableOpacity>
            </View>
         </View>

         <Portal>
            <Modal visible={modalVisible} style={GlobalStyle.Container}>
               <Loading />
            </Modal>
         </Portal>
      </View>
   );
};

const ReportFormStyle = StyleSheet.create({
   FormContainerReport: {
      marginTop: 20,
      marginLeft: 16,
      marginRight: 16,
   },
   FieldContainer: {
      marginBottom: 20,
   },
   FieldTitle: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      marginBottom: 10,
   },
   RichEditorToolbar: {
      backgroundColor: Theme.PrimaryColor,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
   },
   RichEditor: {
      borderWidth: 2,
      borderColor: Theme.PrimaryColor,
      height: 200,
      overflow: 'scroll',
   },
   RichEditorText: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      marginBottom: 10,
   },
   ImageReportContainer: {
      borderWidth: 2,
      borderColor: Theme.PrimaryColor,
      height: 350,
      justifyContent: 'center',
      alignItems: 'center',
   },
   ImageReport: {
      width: '100%',
      height: '100%',
   },
});
export default ReportActivityForm;
