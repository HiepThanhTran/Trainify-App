import { View, Text, TextInput } from "react-native";
import GlobalStyle from "../../styles/Style";
import { Entypo } from '@expo/vector-icons';
import All from "./All";

const CreateActivityForm = () => {
   return(
      <View style={GlobalStyle.BackGround}>
         <View style={All.Container}>
            <View style={All.FormCreateActivity}>
               <View style={All.TextInputContainer}>
                  <Text>Tên hoạt động</Text>
                  <View style={All.TextInput}>
                     <Entypo name="news" size={24} color="black" />
                     <TextInput
                        placeholder="Tên hoạt động"
                     />
                  </View>
               </View>
            </View>
         </View>
      </View>
   )
};

export default CreateActivityForm;