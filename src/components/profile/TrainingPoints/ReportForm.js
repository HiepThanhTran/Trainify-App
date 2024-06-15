import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRef, useState, useEffect } from "react";
import GlobalStyle from '../../../styles/Style';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import Theme from "../../../styles/Theme";
import Loading from "../../common/Loading";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ReportForm = ({ navigation }) => {
   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableOpacity
               style={{
                  ...GlobalStyle.Center,
                  ...GlobalStyle.HeaderButton,
               }}
            >
               <Text style={{ ...GlobalStyle.HeaderButtonText }}>Gửi</Text>
            </TouchableOpacity>
         ),
      });
   })
   const [reports, setReports] = useState("");
   const [imageReport, setImageReport] = useState("");
   const [loadingImageReport, setLoadingImageReport] = useState(false);
   const richText = useRef(null);

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

         console.log(res);

         if (!res.canceled) {
            setImageReport(res.assets[0].uri);
         }
      }
   };

   const handleGallerySelection = () =>
      handleSelection(ImagePicker.requestMediaLibraryPermissionsAsync, ImagePicker.launchImageLibraryAsync);

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={ReportFormStyle.FormContainerReport}>
            <View style={ReportFormStyle.FieldContainer}>
               <Text style={ReportFormStyle.FieldTitle}>Minh chứng</Text>
               <RichToolbar
                  editor={richText}
                  selectedIconTint="#873c1e"
                  iconTint="#312921"
                  style={ReportFormStyle.RichEditorToolbar}
                  actions={[
                     actions.setBold,
                     actions.setItalic,
                     actions.setUnderline,
                     actions.insertBulletsList,
                     actions.insertOrderedList,
                     actions.insertLink,
                     actions.setStrikethrough,
                  ]}
               />
               <View style={ReportFormStyle.RichEditor}>
                  <RichEditor
                     ref={richText}
                     style={ReportFormStyle.RichEditorText}
                     multiline={true}
                     placeholder="Mô tả minh chứng của bạn"
                     androidHardwareAccelerationDisabled={true}
                     onChange={setReports}
                     showsVerticalScrollIndicator={false}
                     showsHorizontalScrollIndicator={false}
                  />
               </View>
            </View>

            <View style={ReportFormStyle.FieldContainer}>
               <Text style={ReportFormStyle.FieldTitle}>Hình ảnh minh chứng</Text>
               <TouchableOpacity style={ReportFormStyle.ImageReportContainer} onPress={handleGallerySelection}>
                  {loadingImageReport ? (
                     <Loading />
                  ) : imageReport ? (
                     <Image source={{ uri: imageReport }} style={ReportFormStyle.ImageReport} />
                  ) : (
                     <Ionicons name="image-outline" size={30} color="black" />
                  )}
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );
};

const ReportFormStyle = StyleSheet.create({
   FormContainerReport:{
      marginTop: 20,
      marginLeft: 16,
      marginRight: 16
   },
   FieldContainer: {
      marginBottom: 20,
   },
   FieldTitle: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      marginBottom: 10
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
   },
   RichEditorText: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      marginBottom: 10,
   },
   ImageReportContainer:{
      borderWidth: 2,
      borderColor: Theme.PrimaryColor,
      height: 350,
      justifyContent: 'center',
      alignItems: 'center',
   },
   ImageReport:{
      width: '100%',
      height: '100%',
   }
})
export default ReportForm;
