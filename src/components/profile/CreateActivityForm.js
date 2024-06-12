import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import GlobalStyle from "../../styles/Style";
import { Entypo, Ionicons, Fontisto, FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import All from "./All";
import { DateTimePicker} from "@react-native-community/datetimepicker";

const CreateActivityForm = () => {
   const [date, setDate] = useState(new Date());
   const [showPicker, setShowPicker] = useState(false);

   const handleDateChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShowPicker(false);
      setDate(currentDate);
   };

   const showDatePicker = () => {
      setShowPicker(true);
   };

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={All.Container}>
            <ScrollView style={All.FormCreateActivity}>
               <View style={All.TextInputContainer}>
                  <Text style={All.TextInputTitle}>Hoạt động</Text>
                  <View style={All.TextInputWrapper}>
                     <TextInput
                        placeholder="Tên hoạt động"
                        style={All.TextInput}
                     />
                     <Entypo name="news" size={24} color="black" style={All.Icon} />
                  </View>
               </View>

               <View style={All.TextInputContainer}>
                  <Text style={All.TextInputTitle}>Đối tượng</Text>
                  <View style={All.TextInputWrapper}>
                     <TextInput
                        placeholder="Đối tượng tham gia"
                        style={All.TextInput}
                     />
                     <Ionicons name="people" size={24} color="black" style={All.Icon} />
                  </View>
               </View>

               <View style={All.TextInputContainer}>
                  <Text style={All.TextInputTitle}>Ngày bắt đầu</Text>
                  <TouchableOpacity onPress={showDatePicker} style={All.TextInputWrapper}>
                     <Text style={All.TextInput}>{date.toDateString()}</Text>
                     <AntDesign name="clockcircle" size={24} color="black" style={All.Icon}/>
                  </TouchableOpacity>
               </View>

               <View style={All.TextInputContainer}>
                  <Text style={All.TextInputTitle}>Địa điểm</Text>
                  <View style={All.TextInputWrapper}>
                     <TextInput
                        placeholder="Tên địa điểm"
                        style={All.TextInput}
                     />
                     <Ionicons name="location" size={24} color="black" style={All.Icon} />
                  </View>
               </View>

               <View style={All.TextInputContainer}>
                  <Text style={All.TextInputTitle}>Điểm cộng</Text>
                  <View style={All.TextInputWrapper}>
                     <TextInput
                        placeholder="Điểm cộng cho sinh viên"
                        style={All.TextInput}
                     />
                    <Fontisto name="star" size={24} color="black"  style={All.Icon}/>
                  </View>
               </View>

               <View style={All.TextInputContainer}>
                  <Text style={All.TextInputTitle}>Bảng tin</Text>
                  <View style={All.TextInputWrapper}>
                     <TextInput
                        placeholder="Tên bảng tin"
                        style={All.TextInput}
                     />
                    <FontAwesome5 name="newspaper" size={24} color="black"  style={All.Icon}/>
                  </View>
               </View>

               <View style={All.TextInputContainer}>
                  <Text style={All.TextInputTitle}>Khoa</Text>
                  <View style={All.TextInputWrapper}>
                     <TextInput
                        placeholder="Tên khoa"
                        style={All.TextInput}
                     />
                     <FontAwesome name="graduation-cap" size={24} color="black" style={All.Icon}/>
                  </View>
               </View>

               {showPicker && (
                  <DateTimePickerAndroid
                     testID="dateTimePicker"
                     value={date}
                     mode="date"
                     is24Hour={true}
                     display="default"
                     onChange={handleDateChange}
                  />
               )}
            </ScrollView>
         </View>
      </View>
   )
};

export default CreateActivityForm;