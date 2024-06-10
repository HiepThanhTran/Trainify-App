import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, endPoints } from '../../configs/APIs';
import RenderHTML from 'react-native-render-html';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import Theme from '../../styles/Theme';
import GlobalStyle, { screenWidth } from '../../styles/Style';
import { statusCode } from '../../configs/Constants';
import { useAccount } from '../../store/contexts/AccountContext';
import { formatDate, loadMore, onRefresh, isCloseToBottom, search } from '../../utils/Utilities';
import Loading from '../../components/common/Loading';
import Searchbar from '../../components/common/Searchbar';

const ActivitySettings = ({ navigation }) => {
   const currentAccount = useAccount();
   const currentAccountID = currentAccount.data.user.id;
   const { loading, setLoading, refreshing, setRefreshing } = useGlobalContext();
   const [page, setPage] = useState(1);
   const [activityUserCreate, setActivityUserCreate] = useState([]);
   const [expandedCards, setExpandedCards] = useState({});
   const [activityName, setActivityName] = useState('');

   const loadActivityUserCreate = async () => {
      if (page <= 0) return;
      setLoading(true);
      try {
         const accessToken = await AsyncStorage.getItem('access-token');
         const res = await authAPI(accessToken).get(endPoints['activities'], {
            params: { organizer_id: currentAccountID, page, name: activityName }
         });
         if (res.data.next === null) setPage(0);
         if (res.status === statusCode.HTTP_200_OK) {
            setActivityUserCreate(page === 1 ? res.data.results : [...activityUserCreate, ...res.data.results]);
         }
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

   useEffect(() => {
      loadActivityUserCreate();
   }, [currentAccountID, page, activityName, refreshing]);

   const toggleExpand = (id) => {
      setExpandedCards(prevState => ({
         ...prevState,
         [id]: !prevState[id]
      }));
   };

   const handleScroll = (event) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      if (isCloseToBottom({ layoutMeasurement, contentOffset, contentSize })) {
         loadMore(event.nativeEvent, loading, page, setPage);
      }
   }

   const handleRefresh = () => {
      onRefresh(setPage, setActivityName, setRefreshing)
   }

   const goToCreateActivity = (name) => {
      navigation.navigate('CreateActivityForm', { name });
   }

   if (loading && page === 1) return <Loading />;
   return (
      <View style={GlobalStyle.BackGround}>
         <ScrollView
            style={ActivitySettingStyle.Container}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            refreshControl={
               <RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>
            }
         >
            <Searchbar
               value={activityName}
               placeholder="Tìm kiếm hoạt động"
               onChangeText={(value) => search(value, setPage, setActivityName)}
            />
            <View style={ActivitySettingStyle.Top}>
               <Text style={ActivitySettingStyle.Text}>Danh sách hoạt động</Text>
               <TouchableOpacity style={ActivitySettingStyle.AddActivity} onPress={goToCreateActivity}>
                  <AntDesign name="pluscircle" size={24} color='white' />
               </TouchableOpacity>
            </View>

            <View style={ActivitySettingStyle.Bottom}>
               {activityUserCreate.map((activity, index) => (
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
                        <Text style={ActivitySettingStyle.TextDes}>Bảng tin: {activity.bulletin}</Text>
                        <Text style={ActivitySettingStyle.TextDes}>Người tham gia: {activity.participant}</Text>
                        <Text style={ActivitySettingStyle.TextDes}>
                           Ngày bắt đầu: <Text>{formatDate(activity.start_date)}</Text>
                        </Text>
                        <Text style={ActivitySettingStyle.TextDes}>
                           Ngày kết thúc: <Text>{formatDate(activity.end_date)}</Text>
                        </Text>
                        <Text style={ActivitySettingStyle.TextDes}>Địa điểm: {activity.location}</Text>
                        <Text style={ActivitySettingStyle.TextDes}>Điểm cộng: {activity.point}</Text>
                        <Text style={ActivitySettingStyle.TextDes}>Học kì: {activity.semester}</Text>
                        <Text style={ActivitySettingStyle.TextDes}>Hình thức: {activity.organizational_form}</Text>
                        <View style={ActivitySettingStyle.DateContainer}>
                           <Text style={ActivitySettingStyle.TextDate}>
                              Ngày tạo: <Text>{formatDate(activity.created_date)}</Text>
                           </Text>
                           <Text style={ActivitySettingStyle.TextDate}>
                              Ngày cập nhập: <Text>{formatDate(activity.updated_date)}</Text>
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

                     {index !== activityUserCreate.length - 1 && (
                        <Text style={ActivitySettingStyle.Line}></Text>
                     )}
                  </View>
               ))}
               {loading && page > 1 && <Loading />}
            </View>
         </ScrollView>
      </View>
   );
};

const ActivitySettingStyle = StyleSheet.create({
   Container: {
      marginHorizontal: 12,
      marginTop: 5,
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
      fontSize: 20,
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
      height: 120,
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
      fontSize: 20,
   },
   Description: {
      fontFamily: Theme.SemiBold,
      fontSize: 18,
      marginTop: 5,
      lineHeight: 25
   },
   MoreButton: {
      fontFamily: Theme.Bold,
      fontSize: 17,
      marginBottom: 5,
      marginTop: 2
   },
   TextDes: {
      fontFamily: Theme.SemiBold,
      fontSize: 18,
      marginBottom: 5
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
      marginTop: 10,
   },
   Button: {
      flex: 1,
      borderWidth: 1,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
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