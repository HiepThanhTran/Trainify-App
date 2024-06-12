import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { authAPI, endPoints } from '../../../configs/APIs';
import { roles, rolesName, statusCode } from '../../../configs/Constants';
import HomeStyle from '../../../screens/home/Style';
import { useAccount, useAccountDispatch } from '../../../store/contexts/AccountContext';
import { screenHeight, screenWidth } from '../../../styles/Style';
import Theme from '../../../styles/Theme';
import { formatDate, getTokens, refreshAccessToken } from '../../../utils/Utilities';
import Loading from '../../common/Loading';

const TwoItemDetailsHeader = ({ activity }) => {
   return (
      <>
         <View style={HomeStyle.DetailsWrap}>
            <View style={HomeStyle.DetailsItem}>
               <View style={HomeStyle.DetailsIcon}>
                  <AntDesign name="clockcircle" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Ngày bắt đầu</Text>
                  <Text style={HomeStyle.DetailsValue}>{formatDate(activity.start_date)}</Text>
               </View>
            </View>
            <View style={HomeStyle.DetailsItem}>
               <View style={HomeStyle.DetailsIcon}>
                  <AntDesign name="clockcircle" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Ngày kết thúc</Text>
                  <Text style={HomeStyle.DetailsValue}>{formatDate(activity.end_date)}</Text>
               </View>
            </View>
         </View>

         <View style={HomeStyle.DetailsWrap}>
            <View style={HomeStyle.DetailsItem}>
               <View style={HomeStyle.DetailsIcon}>
                  <Ionicons name="book-sharp" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>ĐRL điều</Text>
                  <Text style={HomeStyle.DetailsValue}>{activity.criterion}</Text>
               </View>
            </View>
            <View style={HomeStyle.DetailsItem}>
               <View style={HomeStyle.DetailsIcon}>
                  <AntDesign name="star" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Điểm cộng</Text>
                  <Text style={HomeStyle.DetailsValue}>{activity.point}</Text>
               </View>
            </View>
         </View>

         <View style={HomeStyle.DetailsWrap}>
            <View style={HomeStyle.DetailsItem}>
               <View style={HomeStyle.DetailsIcon}>
                  <Ionicons name="people" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Đối tượng</Text>
                  <Text style={HomeStyle.DetailsValue}>{activity.participant}</Text>
               </View>
            </View>
            <View style={HomeStyle.DetailsItem}>
               <View style={HomeStyle.DetailsIcon}>
                  <AntDesign name="appstore1" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Hình thức</Text>
                  <Text style={HomeStyle.DetailsValue}>{activity.organizational_form}</Text>
               </View>
            </View>
         </View>
      </>
   );
};

const OneItemDetails = ({ activity }) => {
   return (
      <>
         <View style={HomeStyle.DetailsWrap}>
            <View style={{ ...HomeStyle.DetailsItem, width: '100%' }}>
               <View style={HomeStyle.DetailsIcon}>
                  <Ionicons name="location" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Địa điểm</Text>
                  <Text style={HomeStyle.DetailsValue}>{activity.location}</Text>
               </View>
            </View>
         </View>

         <View style={HomeStyle.DetailsWrap}>
            <View style={{ ...HomeStyle.DetailsItem, width: '100%' }}>
               <View style={HomeStyle.DetailsIcon}>
                  <Ionicons name="school" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Khoa</Text>
                  <Text style={HomeStyle.DetailsValue}>{activity.faculty}</Text>
               </View>
            </View>
         </View>

         <View style={HomeStyle.DetailsWrap}>
            <View style={{ ...HomeStyle.DetailsItem, width: '100%' }}>
               <View style={HomeStyle.DetailsIcon}>
                  <Ionicons name="color-filter-sharp" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Học kỳ</Text>
                  <Text style={HomeStyle.DetailsValue}>{activity.semester}</Text>
               </View>
            </View>
         </View>
      </>
   );
};

const TwoItemDetailsFooter = ({ activity }) => {
   return (
      <>
         <View style={HomeStyle.DetailsWrap}>
            <View style={HomeStyle.DetailsItem}>
               <View style={HomeStyle.DetailsIcon}>
                  <AntDesign name="clockcircle" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Ngày tạo</Text>
                  <Text style={HomeStyle.DetailsValue}>{formatDate(activity.created_date)}</Text>
               </View>
            </View>
            <View style={HomeStyle.DetailsItem}>
               <View style={HomeStyle.DetailsIcon}>
                  <AntDesign name="clockcircle" size={32} />
               </View>
               <View style={HomeStyle.Details}>
                  <Text style={HomeStyle.DetailsText}>Cập nhật</Text>
                  <Text style={HomeStyle.DetailsValue}>{formatDate(activity.updated_date)}</Text>
               </View>
            </View>
         </View>
      </>
   );
};

const ActivityDetailsOverview = ({ activityID, activity, setActivity, ...props }) => {
   const dispatch = useAccountDispatch();
   const currentAccount = useAccount();

   const [isExpanded, setIsExpanded] = useState(false);

   const handleRegisterActivity = async () => {
      props?.setModalVisible(true);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let res = await authAPI(accessToken).post(endPoints['activity-register'](activityID));

         if (res.status === statusCode.HTTP_201_CREATED) {
            Alert.alert('Thông báo', 'Đăng ký hoạt động thành công!');
            setActivity((prevActivity) => ({
               ...prevActivity,
               registered: true,
            }));
         }
         if (res.status === statusCode.HTTP_204_NO_CONTENT) {
            Alert.alert('Thông báo', 'Hủy đăng ký thành công!');
            setActivity((prevActivity) => ({
               ...prevActivity,
               registered: false,
            }));
         }
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_401_UNAUTHORIZED) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) handleRegisterActivity();
         } else console.error('Register activity', error);
      } finally {
         props?.setModalVisible(false);
      }
   };

   const alertRegisterActivity = () => {
      Alert.alert(
         'Xác nhận',
         activity.registered ? 'Hủy đăng ký?' : 'Đăng ký hoạt động?',
         [
            {
               text: activity.registered ? 'Xác nhận' : 'Đăng ký',
               onPress: () => handleRegisterActivity(),
            },
            { text: 'Hủy', style: 'cancel' },
         ],
         { cancelable: false },
      );
   };

   if (props?.loading) return <Loading />;

   return (
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
         <View
            style={{
               ...props?.style,
               ...HomeStyle.DetailsContainer,
               paddingBottom: currentAccount.data.role === roles.STUDENT ? screenHeight / 10 : 0,
            }}
         >
            <TwoItemDetailsHeader activity={activity} />

            <OneItemDetails activity={activity} />

            <View style={{ marginTop: 12 }}>
               <Text style={{ fontFamily: Theme.Bold, fontSize: 20 }}>Mô tả hoạt động</Text>
               <RenderHTML
                  contentWidth={screenWidth}
                  source={{ html: activity.description }}
                  baseStyle={HomeStyle.DetailsDescription}
                  defaultTextProps={{
                     numberOfLines: isExpanded ? 0 : 3,
                     ellipsizeMode: 'tail',
                  }}
               />
               {activity.description.length > 144 && (
                  <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                     <Text style={HomeStyle.MoreButton}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                  </TouchableOpacity>
               )}
            </View>

            <View style={{ ...HomeStyle.DetailsWrap, marginTop: 12 }}>
               <View style={{ ...HomeStyle.DetailsItem, width: '100%' }}>
                  <View style={HomeStyle.DetailsIcon}>
                     <Ionicons name="person" size={32} />
                  </View>
                  <View style={HomeStyle.Details}>
                     <Text style={{ ...HomeStyle.DetailsText, fontFamily: Theme.Bold }}>
                        Người tạo: <Text style={{ fontFamily: Theme.Regular }}>{activity.created_by.full_name}</Text>
                     </Text>
                     <Text style={{ ...HomeStyle.DetailsValue, ...HomeStyle.DetailsCreatedBy }}>
                        {rolesName[activity.created_by.role]}
                     </Text>
                  </View>
               </View>
            </View>

            <TwoItemDetailsFooter activity={activity} />

            {currentAccount.data.role === roles.STUDENT && (
               <View style={ActivityDetailsOverviewStyle.Register}>
                  <TouchableOpacity style={ActivityDetailsOverviewStyle.RegisterButton} onPress={alertRegisterActivity}>
                     <Text style={ActivityDetailsOverviewStyle.RegisterButtonText}>
                        {activity.registered ? 'Hủy đăng ký' : 'Đăng ký'}
                     </Text>
                     <Ionicons name="arrow-forward" size={32} color="white" />
                  </TouchableOpacity>
               </View>
            )}
         </View>
      </ScrollView>
   );
};

const ActivityDetailsOverviewStyle = StyleSheet.create({
   Register: {
      position: 'absolute',
      bottom: 12,
      width: '100%',
   },
   RegisterButton: {
      backgroundColor: Theme.PrimaryColor,
      padding: 12,
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'center',
   },
   RegisterButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      marginHorizontal: 70,
   },
});

export default ActivityDetailsOverview;
