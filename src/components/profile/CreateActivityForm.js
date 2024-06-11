import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import GlobalStyle from "../../styles/Style";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Theme from "../../styles/Theme";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { formatDate } from "../../utils/Utilities";
import { RichEditor } from "react-native-pell-rich-editor";
import * as ImagePicker from 'expo-image-picker';
import { authAPI } from "../../configs/APIs";
const CreateActivityForm = () => {
   const [startDate, setStartDate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());
   const [richEditorContent, setRichEditorContent] = useState("");
   const [selectedImage, setSelectedImage] = useState(null);
   
   const openDatePicker = (mode, setDate, currentDate) => {
      DateTimePickerAndroid.open({
         value: currentDate || new Date(),
         onChange: (event, selectedDate) => {
            if (selectedDate) {
               setDate(selectedDate);
            }
         },
         mode: mode,
         is24Hour: true,
         display: 'spinner',
      });
   };

   const handlePickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.cancelled) {
         setSelectedImage(result.uri);
      }
   };

   const postActivity = async() => {
      let form = new FormData();
      form.append()
   }

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={CreateActivityFormStyle.Container}>
            <ScrollView
               showsVerticalScrollIndicator={false}
               showsHorizontalScrollIndicator={false}
            >
               <TouchableOpacity style={CreateActivityFormStyle.ImageContainer} onPress={handlePickImage}>
                  {selectedImage ? (
                     <Image source={{ uri: selectedImage }} style={{ width: 80, height: 80, borderRadius: 5 }} />
                  ) : (
                     <Ionicons name="image-sharp" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  )}
               </TouchableOpacity>
               <View style={CreateActivityFormStyle.inputContainer}>
                  <MaterialIcons name="drive-file-rename-outline" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Tên hoạt động"
                     placeholderTextColor="gray"
                  />
               </View>

               <View style={CreateActivityFormStyle.inputContainer}>
                  <Ionicons name="people" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Đối tượng tham gia"
                     placeholderTextColor="gray"
                  />
               </View>

               <TouchableOpacity
                  style={CreateActivityFormStyle.inputContainer}
                  onPress={() => openDatePicker('date', setStartDate, startDate)}
               >
                  <MaterialIcons name="date-range" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Ngày bắt đầu"
                     placeholderTextColor="gray"
                     editable={false}
                     value={formatDate(startDate)}
                  />
               </TouchableOpacity>

               <TouchableOpacity
                  style={CreateActivityFormStyle.inputContainer}
                  onPress={() => openDatePicker('date', setEndDate, endDate)}
               >
                  <MaterialIcons name="date-range" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Ngày kết thúc"
                     placeholderTextColor="gray"
                     editable={false}
                     value={formatDate(endDate)}
                  />
               </TouchableOpacity>

               <View style={CreateActivityFormStyle.inputContainer}>
                  <Ionicons name="location" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Địa điểm"
                     placeholderTextColor="gray"
                  />
               </View>

               <View style={CreateActivityFormStyle.inputContainer}>
                  <AntDesign name="gift" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Điểm cộng"
                     placeholderTextColor="gray"
                  />
               </View>

               <View style={CreateActivityFormStyle.inputContainer}>
                  <Entypo name="news" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Bảng tin"
                     placeholderTextColor="gray"
                  />
               </View>

               <View style={CreateActivityFormStyle.inputContainer}>
                  <Ionicons name="time" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Học kì"
                     placeholderTextColor="gray"
                  />
               </View>

               <View style={CreateActivityFormStyle.inputContainer}>
                  <AntDesign name="minussquareo" size={24} color={Theme.PrimaryColor} style={CreateActivityFormStyle.icon} />
                  <TextInput
                     style={CreateActivityFormStyle.input}
                     placeholder="Hình thức"
                     placeholderTextColor="gray"
                  />
               </View>

               <RichEditor
                  initialContentHTML={richEditorContent}
                  onChange={(text) => setRichEditorContent(text)}
                  placeholder="Mô tả hoạt động"
                  style={CreateActivityFormStyle.RichEditor}
               />

               <TouchableOpacity style={CreateActivityFormStyle.ButtonCreateActivity}>
                  <Text style={CreateActivityFormStyle.ButtonText}>Tạo</Text>
               </TouchableOpacity>
            </ScrollView>
         </View>
      </View>
   )
}

const CreateActivityFormStyle = StyleSheet.create({
   Container: {
      marginHorizontal: 12,
      marginTop: 32,
      marginBottom: 50,
   },
   Image: {
      alignItems: 'center',
      marginBottom: 20,
   },
   inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: Theme.PrimaryColor,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
   },
   input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: "black",
   },
   icon: {
      marginRight: 10,
   },

   RichEditor: {
      borderWidth: 1,
      borderColor: Theme.PrimaryColor,
   },
   ImageContainer: {
      flexDirection: 'row',
      width: '100%',
      height: 80,
      borderWidth: 1,
      borderColor: Theme.PrimaryColor,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5
   },
   ButtonCreateActivity: {
      borderWidth: 1,
      borderColor: Theme.PrimaryColor,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      marginTop: 10,
      width: 100,
      alignSelf: 'center',
      backgroundColor: Theme.PrimaryColor,
      borderRadius: 5,
   },
   ButtonText: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      color: 'white'
   }
});

export default CreateActivityForm;
