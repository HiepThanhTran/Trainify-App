import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
   Alert,
   Image,
   RefreshControl,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import Loading from '../../Components/Common/Loading';
import Searchbar from '../../Components/Common/Searchbar';
import APIs, { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { useAccountDispatch } from '../../Store/Contexts/AccountContext';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { assistantFields } from '../../Utils/Fields';
import { getTokens, loadMore, onRefresh, refreshAccessToken, search } from '../../Utils/Utilities';

const CreateAssistantAccount = () => {
   const dispatch = useAccountDispatch();

   const [assistants, setAssistants] = useState([]);
   const [account, setAccount] = useState({});
   const [code, setCode] = useState('');
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [modalVisible, setModalVisible] = useState(false);
   const [openModalAssistant, setOpenModalAssistant] = useState(false);

   useEffect(() => {
      const loadAssistants = async () => {
         if (page <= 0) return;

         setLoading(true);
         try {
            const response = await APIs.get(endPoints['assistants'], {
               params: { page, has_account: false, code },
            });
            if (response.status === statusCode.HTTP_200_OK) {
               if (page === 1) {
                  setAssistants(response.data.results);
               } else {
                  setAssistants((prevAssistants) => [...prevAssistants, ...response.data.results]);
               }
            }
            if (response.data.next === null) {
               setPage(0);
            }
         } catch (error) {
            console.error('Assistant list', error);
         } finally {
            setLoading(false);
            setRefreshing(false);
         }
      };

      loadAssistants();
   }, [refreshing, page, code]);

   const handleCreateAccountAssistant = async () => {
      for (let field of assistantFields) {
         console.log(field.name);
         if (!account[field.name] || account[field.name] === undefined) {
            Alert.alert('Thông báo', `${field.label} không được trống`);
            return;
         }
      }

      if (account['password'] !== account['confirm']) {
         Alert.alert('Thông báo', 'Mật khẩu không trùng nhau');
         return;
      }

      if (account['password'].length < 6) {
         Alert.alert('Thông báo', 'Vui lòng nhập mật khẩu ít nhất 6 kí tự');
         return;
      }

      let form = new FormData();
      for (let key in account) {
         if (key !== 'confirm') {
            form.append(key, account[key]);
         }
      }

      setModalVisible(true);
      const { accessToken, refreshToken } = await getTokens();
      try {
         const response = await authAPI(accessToken).post(endPoints['assistant-register'], form);

         if (response.status === statusCode.HTTP_201_CREATED) {
            setAccount({});
            Alert.alert('Thông báo', 'Đăng ký tài khoản cho trợ lý sinh viên thành công!');
         }
      } catch (error) {
         if (
            error.response &&
            (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
               error.response.status === statusCode.HTTP_403_FORBIDDEN)
         ) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) {
               handleCreateAccountAssistant();
            }
         } else if (error.response && error.response.status === statusCode.HTTP_400_BAD_REQUEST) {
            Alert.alert('Thông báo', error.response.data.detail);
         } else {
            console.error('Create account assistant:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi thực hiện thao tác.');
         }
      } finally {
         setModalVisible(false);
      }
   };

   const updateAccountAssistant = (field, value) => {
      setAccount((prevAccount) => ({
         ...prevAccount,
         [field]: value,
      }));
   };

   return (
      <View style={GlobalStyle.BackGround}>
         <DismissKeyboard>
            <View style={GlobalStyle.Container}>
               <View style={RegisterAssistantStyles.FormRegister}>
                  <Text style={RegisterAssistantStyles.FormRegisterTitle}>Đăng ký tài khoản cho trợ lý sinh viên</Text>
                  <View style={RegisterAssistantStyles.RegisterAssistantImageContainer}>
                     <Image
                        style={RegisterAssistantStyles.RegisterAssistantImage}
                        source={require('../../Assets/Images/FormBackground.png')}
                     />
                  </View>
                  <View style={RegisterAssistantStyles.Field}>
                     <TouchableOpacity
                        style={RegisterAssistantStyles.InputContainer}
                        onPress={() => setOpenModalAssistant(true)}
                     >
                        <Text
                           style={[
                              RegisterAssistantStyles.Text,
                              account['code'] ? RegisterAssistantStyles.SelectedText : null,
                           ]}
                        >
                           {account['code'] ? account['code'] : 'Mã số trợ lý sinh viên'}
                        </Text>
                        <Entypo name="newsletter" size={24} color="black" style={RegisterAssistantStyles.Icon} />
                     </TouchableOpacity>
                  </View>

                  <View style={RegisterAssistantStyles.Field}>
                     <View style={RegisterAssistantStyles.InputContainer}>
                        <TextInput
                           value={account['email']}
                           style={RegisterAssistantStyles.TextInput}
                           placeholder="Email trợ lý sinh viên"
                           onChangeText={(value) => updateAccountAssistant('email', value)}
                        />
                        <MaterialIcons name="email" size={24} color="black" style={RegisterAssistantStyles.Icon} />
                     </View>
                  </View>

                  <View style={RegisterAssistantStyles.Field}>
                     <View style={RegisterAssistantStyles.InputContainer}>
                        <TextInput
                           value={account['password']}
                           style={RegisterAssistantStyles.TextInput}
                           placeholder="Mật khẩu"
                           secureTextEntry={!showPassword}
                           onChangeText={(value) => updateAccountAssistant('password', value)}
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

                  <View style={RegisterAssistantStyles.Field}>
                     <View style={RegisterAssistantStyles.InputContainer}>
                        <TextInput
                           value={account['confirm']}
                           style={RegisterAssistantStyles.TextInput}
                           placeholder="Xác nhận mật khẩu"
                           secureTextEntry={!showPassword}
                           onChangeText={(value) => updateAccountAssistant('confirm', value)}
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
                     <TouchableOpacity style={RegisterAssistantStyles.Button} onPress={handleCreateAccountAssistant}>
                        <Text style={RegisterAssistantStyles.ButtonText}>Đăng ký</Text>
                     </TouchableOpacity>
                  </View>
               </View>

               <Modal
                  visible={openModalAssistant}
                  onRequestClose={() => setOpenModalAssistant(false)}
                  animationType="slide"
                  style={{ backgroundColor: '#fff' }}
                  contentContainerStyle={{ flex: 1 }}
               >
                  <View style={{ flex: 1 }}>
                     <TouchableOpacity
                        onPress={() => setOpenModalAssistant(false)}
                        style={RegisterAssistantStyles.CloseButton}
                     >
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
                                    updateAccountAssistant('code', assistant.code);
                                    updateAccountAssistant(
                                       'email',
                                       `${assistant.code}${assistant.first_name}@ou.edu.vn`,
                                    );
                                    setOpenModalAssistant(false);
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
                                          <Text style={RegisterAssistantStyles.CardDesTitle}>
                                             {assistant.full_name}
                                          </Text>
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
                                          <Text style={RegisterAssistantStyles.CardDesTitle}>
                                             {assistant.gender === 'M' ? 'Nam' : 'Nữ'}
                                          </Text>
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
         </DismissKeyboard>

         <Portal>
            <Modal visible={modalVisible} style={GlobalStyle.Container}>
               <Loading />
            </Modal>
         </Portal>
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
      height: 260,
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
      paddingHorizontal: 12,
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
      paddingHorizontal: 12,
   },
});

export default CreateAssistantAccount;
