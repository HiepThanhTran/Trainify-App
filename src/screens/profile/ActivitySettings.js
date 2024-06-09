import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, endPoints } from '../../configs/APIs';
import RenderHTML from 'react-native-render-html';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import Theme from '../../styles/Theme';
import GlobalStyle, { screenWidth } from '../../styles/Style';
import { statusCode } from '../../configs/Constants';
import { useAccount} from '../../store/contexts/AccountContext';
import { formatDate, loadMore, onRefresh, isCloseToBottom} from '../../utils/Utilities';
import Loading from '../../components/common/Loading';

const ActivitySettings = ({navigation}) => {
   const currentAccount = useAccount();
   const currentAccountID = currentAccount.data.user.id;
   const { loading, setLoading, refreshing, setRefreshing } = useGlobalContext();
   const [page, setPage] = useState(1);
   const [activityusercreate, setActivityUserCreate] = useState([]);
   const [expandedCards, setExpandedCards] = useState({});

   const loadActivityUserCreate = async () => {
      if (page <= 0) return;
      setLoading(true);
      try {
         const accessToken = await AsyncStorage.getItem('access-token');
         const res = await authAPI(accessToken).get(endPoints['activities'], {
            params: { organizer_id: currentAccountID, page}
         });
         if (res.data.next === null) setPage(0);
         if (res.status === statusCode.HTTP_200_OK)
            setActivityUserCreate(page === 1 ? res.data.results : [...activityusercreate, ...res.data.results]);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

   useEffect(() => {
      loadActivityUserCreate();
   }, [currentAccountID, page]);

   const toggleExpand = (id) => {
      setExpandedCards(prevState => ({
         ...prevState,
         [id]: !prevState[id]
      }));
   };

   if(loading) return <Loading/>

   const handleScroll = (event) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      if (isCloseToBottom({ layoutMeasurement, contentOffset, contentSize })) {
         loadMore(event.nativeEvent, loading, page, setPage);
     }
   }

   const goToCreateActivity = (name) => {
      navigation.navigate('CreateActivityForm',{name})
   }

   return (
      <View style={GlobalStyle.BackGround}>
         <ScrollView
            style={ActivitySettingStyle.Container}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
         >
            <View style={ActivitySettingStyle.Top}>
               <Text style={ActivitySettingStyle.Text}>Danh sách hoạt động</Text>
               <TouchableOpacity style={ActivitySettingStyle.AddActivity} onPress={goToCreateActivity}>
                  <AntDesign name="pluscircle" size={24} color='white' />
               </TouchableOpacity>
            </View>

            <View style={ActivitySettingStyle.Bottom}>
               {activityusercreate.map((activity, index) => (
                  <View key={activity.id} style={ActivitySettingStyle.Card}>
                     <View style={ActivitySettingStyle.CardImage}>
                        <Image source={{ uri: activity.image }} style={ActivitySettingStyle.Image} />
                     </View>

                     <View style={ActivitySettingStyle.CardDes}>
                        <Text style={ActivitySettingStyle.Name}>{activity.name}</Text>
                        <RenderHTML
                           contentWidth={screenWidth}
                           source={{ html: activity.description }}
                           defaultTextProps={{
                              numberOfLines: expandedCards[activity.id] ? 0 : 3,
                              ellipsizeMode: 'tail',
                           }}
                           baseStyle={ActivitySettingStyle.Description}
                        />
                        <TouchableOpacity onPress={() => toggleExpand(activity.id)}>
                           <Text style={ActivitySettingStyle.MoreButton}>{expandedCards[activity.id] ? 'Thu gọn' : 'Xem thêm'}</Text>
                        </TouchableOpacity>
                        <Text style={ActivitySettingStyle.TextDes}>Người tham gia: {activity.participant}</Text>
                        <Text style={ActivitySettingStyle.TextDes}>
                           Ngày bắt đầu: <Text>{formatDate(activity.start_date)}</Text>
                        </Text>
                        <Text style={ActivitySettingStyle.TextDes}>
                           Ngày kết thúc: <Text>{formatDate(activity.end_date)}</Text>
                        </Text>
                        <Text style={ActivitySettingStyle.TextDes}>Địa điểm: {activity.location}</Text>
                        <Text style={ActivitySettingStyle.TextDes}>Điểm cộng: {activity.point}, Học kì: {activity.semester}</Text>
                        <Text style={ActivitySettingStyle.TextDes}>Hình thức: {activity.organizational_form}</Text>
                        <View style={ActivitySettingStyle.DateContainer}>
                           <Text style={ActivitySettingStyle.TextDate}>
                              Ngày tạo: <Text>{formatDate(activity.created_date)}</Text>
                           </Text>
                           <Text style={ActivitySettingStyle.TextDate}>
                              Ngày cập nhập: <Text>{formatDate(activity.end_date)}</Text>
                           </Text>
                        </View>
                     </View>

                     <View style={ActivitySettingStyle.ButtonContainer}>
                        <TouchableOpacity style={ActivitySettingStyle.Button}>
                           <Text style={ActivitySettingStyle.TextButton}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ActivitySettingStyle.Button}>
                           <Text style={ActivitySettingStyle.TextButton}>Xóa</Text>
                        </TouchableOpacity>
                     </View>

                     {index !== activityusercreate.length - 1 && (
                        <Text style={ActivitySettingStyle.Line}></Text>
                     )}
                  </View>
               ))}
            </View>
         </ScrollView>
      </View>
   );
};

const ActivitySettingStyle = StyleSheet.create({
   Container: {
      marginHorizontal: 12,
      marginTop: 32,
      marginBottom: 50,
   },
   Top: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: Theme.PrimaryColor,
      backgroundColor: Theme.PrimaryColor,
      padding: 12,
      alignItems: 'center',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
   },
   Text: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      color: 'white',
   },
   Bottom: {
      borderColor: Theme.PrimaryColor,
      borderWidth: 2,
   },
   Card: {
      margin: 10,
   },
   CardImage: {
      width: '100%',
      height: 80,
   },
   Image: {
      width: '100%',
      height: '100%'
   },
   CardDes: {
      marginTop: 10
   },
   Name: {
      fontFamily: Theme.Bold,
      fontSize: 18,
   },
   Description: {
      fontFamily: Theme.SemiBold,
      fontSize: 17,
      marginTop
         : 5,
      lineHeight: 23
   },
   MoreButton: {
      fontFamily: Theme.Bold,
      fontSize: 16,
   },
   TextDes: {
      fontFamily: Theme.SemiBold,
      fontSize: 17,
   },
   DateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   TextDate: {
      fontFamily: Theme.SemiBold,
      fontSize: 14,
      color: 'gray'
   },
   ButtonContainer: {
      flexDirection: 'row',
      marginTop: 10
   },
   Button: {
      flex: 1,
      borderWidth: 1,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
      borderColor: Theme.PrimaryColor,
      backgroundColor: Theme.PrimaryColor,
      borderRadius: 5
   },
   TextButton: {
      fontFamily: Theme.Bold,
      color: 'white',
      fontSize: 16
   },
   Line: {
      borderWidth: 1,
      borderColor: '#eee',
      backgroundColor: Theme.PrimaryColor,
      height: 1,
      marginTop: 10
   }
});

export default ActivitySettings;
