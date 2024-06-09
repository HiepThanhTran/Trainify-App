import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import GlobalStyle from "../../styles/Style";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Theme from "../../styles/Theme";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { formatDate } from "../../utils/Utilities";
import * as ImagePicker from 'expo-image-picker';

const CreateActivityForm = () => {
   const [startDate, setStartDate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());
   const [image, setImage] = useState(null);

   const openDatePicker = (mode, setDate) => {
      DateTimePickerAndroid.open({
         value: new Date(),
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

   const pickImage = async () => {
      // Request permission to access the camera roll
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
         alert("Permission to access camera roll is required!");
         return;
      }

      // Open the image picker
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.canceled) {
         setImage(result.uri);
      }
   };

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={CreateActivityFormStyle.Container}>
            <ScrollView>
                <View style={CreateActivityFormStyle.Image}>
                   {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                   <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                      <Text style={styles.imagePickerText}>Chọn ảnh</Text>
                   </TouchableOpacity>
                </View>
               <View style={styles.inputContainer}>
                  <MaterialIcons name="drive-file-rename-outline" size={24} color={Theme.PrimaryColor} style={styles.icon} />
                  <TextInput
                     style={styles.input}
                     placeholder="Tên hoạt động"
                     placeholderTextColor="gray"
                  />
               </View>

               <View style={styles.inputContainer}>
                  <Ionicons name="people" size={24} color={Theme.PrimaryColor} style={styles.icon} />
                  <TextInput
                     style={styles.input}
                     placeholder="Đối tượng tham gia"
                     placeholderTextColor="gray"
                  />
               </View>

               <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => openDatePicker('date', setStartDate)}
               >
                  <MaterialIcons name="date-range" size={24} color={Theme.PrimaryColor} style={styles.icon} />
                  <TextInput
                     style={styles.input}
                     placeholder="Ngày bắt đầu"
                     placeholderTextColor="gray"
                     editable={false}
                     value={formatDate(startDate)}
                  />
               </TouchableOpacity>

               <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => openDatePicker('date', setEndDate)}
               >
                  <MaterialIcons name="date-range" size={24} color={Theme.PrimaryColor} style={styles.icon} />
                  <TextInput
                     style={styles.input}
                     placeholder="Ngày kết thúc"
                     placeholderTextColor="gray"
                     editable={false}
                     value={formatDate(endDate)}
                  />
               </TouchableOpacity>

               <View style={styles.inputContainer}>
                  <Ionicons name="location" size={24} color={Theme.PrimaryColor} style={styles.icon}  />
                  <TextInput
                     style={styles.input}
                     placeholder="Địa điểm"
                     placeholderTextColor="gray"
                  />
               </View>
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
   }
});

const styles = StyleSheet.create({
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
   imagePicker: {
      backgroundColor: Theme.PrimaryColor,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
   },
   imagePickerText: {
      color: 'white',
      fontSize: 16,
   },
});

export default CreateActivityForm;
