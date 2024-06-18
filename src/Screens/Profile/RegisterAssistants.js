import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
   Image,
   Modal,
   RefreshControl,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native';
import Loading from '../../components/common/Loading';
import Searchbar from '../../components/common/Searchbar';
import APIs, { endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { loadMore, onRefresh, search } from '../../utils/Utilities';

const RegisterAssistants = () => {
   const [openModal, setOpenModal] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [assistants, setAssistants] = useState([]);
   const [hasAccount, setHasAccount] = useState(false);
   const [code, setCode] = useState('');
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [selectedCode, setSelectedCode] = useState('');

   useEffect(() => {
      const loadAssistants = async () => {
         if (page <= 0) return;
         setLoading(true);
         try {
            let res = await APIs.get(endPoints['assistants'], {
               params: { page, has_account: hasAccount, code },
            });
            if (res.status === statusCode.HTTP_200_OK) {
               if (page === 1) {
                  setAssistants(res.data.results);
               } else {
                  setAssistants((prevAssistants) => [...prevAssistants, ...res.data.results]);
               }
            }
            if (res.data.next === null) {
               setPage(0);
            }
         } catch (error) {
            console.error(error);
         } finally {
            setLoading(false);
            setRefreshing(false);
         }
      };

      loadAssistants();
   }, [refreshing, page, hasAccount, code]);

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={GlobalStyle.Container}>
            <View style={RegisterAssistantStyles.FormRegister}>
               <Text style={RegisterAssistantStyles.FormRegisterTitle}>Đăng ký tài khoản cho trợ lý sinh viên</Text>
               <View style={RegisterAssistantStyles.RegisterAssistantImageContainer}>
                  <Image
                     style={RegisterAssistantStyles.RegisterAssistantImage}
                     source={require('../../assets/images/RegisterAssistant.png')}
                  />
               </View>
               <View style={RegisterAssistantStyles.Field}>
                  <TouchableOpacity style={RegisterAssistantStyles.InputContainer} onPress={() => setOpenModal(true)}>
                     <Text
                        style={[
                           RegisterAssistantStyles.Text,
                           selectedCode ? RegisterAssistantStyles.SelectedText : null,
                        ]}
                     >
                        {selectedCode ? selectedCode : 'Mã số trợ lý sinh viên'}
                     </Text>
                     <Entypo name="newsletter" size={24} color="black" style={RegisterAssistantStyles.Icon} />
                  </TouchableOpacity>
               </View>

               <View style={RegisterAssistantStyles.Field}>
                  <View style={RegisterAssistantStyles.InputContainer}>
                     <TextInput style={RegisterAssistantStyles.TextInput} placeholder="Email trợ lý sinh viên" />
                     <MaterialIcons name="email" size={24} color="black" style={RegisterAssistantStyles.Icon} />
                  </View>
               </View>

               <View style={RegisterAssistantStyles.Field}>
                  <View style={RegisterAssistantStyles.InputContainer}>
                     <TextInput
                        style={RegisterAssistantStyles.TextInput}
                        placeholder="Mật khẩu"
                        secureTextEntry={!showPassword}
                     />
                     <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                           name={showPassword ? 'eye-off' : 'eye'}
                           size={24}
                           color="black"
                           style={RegisterAssistantStyles.Icon}
                        />
                     </TouchableOpacity>
                  </View>
               </View>

               <View style={RegisterAssistantStyles.ButtonContainer}>
                  <TouchableOpacity style={RegisterAssistantStyles.Button}>
                     <Text style={RegisterAssistantStyles.ButtonText}>Đăng ký</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <Modal visible={openModal} onRequestClose={() => setOpenModal(false)} animationType="slide">
               <View>
                  <TouchableOpacity onPress={() => setOpenModal(false)} style={RegisterAssistantStyles.CloseButton}>
                     <Text style={RegisterAssistantStyles.CloseButtonText}>Đóng</Text>
                  </TouchableOpacity>
                  <ScrollView
                     style={RegisterAssistantStyles.CardsContainer}
                     showsVerticalScrollIndicator={false}
                     showsHorizontalScrollIndicator={false}
                     onScroll={({ nativeEvent }) => loadMore(nativeEvent, loading, page, setPage)}
                     refreshControl={
                        <RefreshControl
                           colors={[Theme.PrimaryColor]}
                           refreshing={refreshing}
                           onRefresh={() => onRefresh({ setPage, setRefreshing, setFilter: setCode })}
                        />
                     }
                  >
                     <Searchbar
                        placeholder="Nhập code"
                        value={code}
                        onChangeText={(value) => search(value, setPage, setCode)}
                     />
                     {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
                     {assistants &&
                        assistants.map((assistant) => (
                           <TouchableOpacity
                              key={assistant.id}
                              style={RegisterAssistantStyles.Card}
                              onPress={() => {
                                 setSelectedCode(assistant.code);
                                 setOpenModal(false);
                              }}
                           >
                              <LinearGradient
                                 colors={Theme.LinearColors4}
                                 start={{ x: 0, y: 0 }}
                                 end={{ x: 1, y: 1 }}
                                 style={{ padding: 16, borderRadius: 8 }}
                              >
                                 <View style={RegisterAssistantStyles.CardItem}>
                                    <View style={RegisterAssistantStyles.CardDes}>
                                       <AntDesign name="idcard" size={24} color="black" />
                                       <Text style={RegisterAssistantStyles.CardDesTitle}>{assistant.full_name}</Text>
                                    </View>
                                    <View style={RegisterAssistantStyles.CardDes}>
                                       <FontAwesome name="birthday-cake" size={24} color="black" />
                                       <Text style={RegisterAssistantStyles.CardDesTitle}>
                                          {moment(assistant.date_of_birth).format('DD/MM/YYYY')}
                                       </Text>
                                    </View>
                                 </View>

                                 <View style={[RegisterAssistantStyles.CardItem, { marginTop: 20 }]}>
                                    <View style={RegisterAssistantStyles.CardDes}>
                                       <FontAwesome name="transgender" size={24} color="black" />
                                       <Text style={RegisterAssistantStyles.CardDesTitle}>{assistant.gender}</Text>
                                    </View>
                                    <View style={RegisterAssistantStyles.CardDes}>
                                       <AntDesign name="phone" size={24} color="black" />
                                       <Text style={RegisterAssistantStyles.CardDesTitle}>
                                          {assistant.phone_number}
                                       </Text>
                                    </View>
                                 </View>

                                 <View style={RegisterAssistantStyles.Address}>
                                    <Text style={RegisterAssistantStyles.AddressTitle}>
                                       Address: {assistant.address}
                                    </Text>
                                 </View>

                                 <View style={RegisterAssistantStyles.Code}>
                                    <Text style={RegisterAssistantStyles.CodeTitle}>Code: {assistant.code}</Text>
                                 </View>
                              </LinearGradient>
                           </TouchableOpacity>
                        ))}
                     {loading && page > 1 && <Loading style={{ marginBottom: 16 }} />}
                  </ScrollView>
               </View>
            </Modal>
         </View>
      </View>
   );
};

const RegisterAssistantStyles = StyleSheet.create({
   FormRegister: {
      width: '100%',
      marginBottom: 50,
   },
   FormRegisterTitle: {
      fontFamily: Theme.Italic,
      fontSize: 18,
      textAlign: 'center',
   },
   RegisterAssistantImageContainer: {
      width: '100%',
      height: 300,
   },
   RegisterAssistantImage: {
      width: '100%',
      height: '100%',
   },
   Field: {
      marginVertical: 10,
      marginLeft: 16,
      marginRight: 16,
   },
   InputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: Theme.PrimaryColor,
      borderRadius: 8,
      padding: 6,
   },
   TextInput: {
      flex: 1,
      height: 40,
      fontSize: 16,
   },
   Text: {
      flex: 1,
      height: 40,
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 0,
      color: 'gray',
   },
   Icon: {
      marginLeft: 10,
   },
   ButtonContainer: {
      alignItems: 'center',
      marginTop: 20,
   },
   Button: {
      backgroundColor: Theme.PrimaryColor,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
   },
   ButtonText: {
      color: 'white',
      fontSize: 18,
      fontFamily: Theme.Bold,
   },
   CardsContainer: {
      marginTop: 20,
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 50,
   },
   Card: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      padding: 8,
   },
   CardItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   CardDes: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   CardDesTitle: {
      fontFamily: Theme.SemiBold,
      fontSize: 16,
      marginLeft: 10,
   },
   Address: {
      marginTop: 20,
   },
   AddressTitle: {
      fontFamily: Theme.Italic,
      fontSize: 16,
   },
   Code: {
      marginTop: 20,
   },
   CodeTitle: {
      fontFamily: Theme.Bold,
      fontSize: 16,
   },
   CloseButton: {
      marginTop: 20,
      marginLeft: 16,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: Theme.PrimaryColor,
      borderRadius: 8,
      alignSelf: 'flex-start',
   },
   CloseButtonText: {
      color: 'white',
      fontFamily: Theme.Bold,
      fontSize: 16,
   },
   SelectedText: {
      flex: 1,
      height: 40,
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 0,
      color: 'black',
   },
});

export default RegisterAssistants;
