import { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Loading from '../../components/common/Loading';
import Searchbar from '../../components/common/Searchbar';
import CardList from '../../components/home/CardList';
import APIs, { endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import GlobalStyle, { screenHeight, screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { formatDate, loadMore, onRefresh, search } from '../../utils/Utilities';

const BulletinDetail = ({ navigation, route }) => {
   const bulletinID = route?.params?.bulletinID;

   const [bulletin, setBulletin] = useState({});
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [activityName, setActivityName] = useState('');
   const [isExpanded, setIsExpanded] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [activityLoading, setActivityLoading] = useState(false);
   const [bulletinLoading, setBulletinLoading] = useState(false);

   useEffect(() => {
      loadBulletin();
   }, []);

   useEffect(() => {
      loadActivities();
   }, [page, activityName, refreshing]);

   const loadBulletin = async () => {
      if (!bulletinID) return;

      setBulletinLoading(true);
      try {
         let res = await APIs.get(endPoints['bulletin-detail'](bulletinID));
         if (res.status === statusCode.HTTP_200_OK) setBulletin(res.data);
      } catch (error) {
         console.error(error);
      } finally {
         setBulletinLoading(false);
      }
   };

   const loadActivities = async () => {
      if (!bulletinID || page <= 0) return;

      setActivityLoading(true);
      try {
         let res = await APIs.get(endPoints['activities'], {
            params: { bulletin_id: bulletinID, page, name: activityName },
         });
         if (res.data.next === null) setPage(0);
         if (res.status === statusCode.HTTP_200_OK)
            setActivities(page === 1 ? res.data.results : [...activities, ...res.data.results]);
      } catch (error) {
         console.error(error);
      } finally {
         setActivityLoading(false);
         setRefreshing(false);
      }
   };

   const goActivityDetail = (activityID, name) => {
      navigation.navigate('ActivityDetail', { activityID, name });
   };

   if (bulletinLoading) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround}>
         <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ ...BulletinDetailStyle.Container, marginTop: 0 }}
            onScroll={({ nativeEvent }) => loadMore(nativeEvent, activityLoading, page, setPage)}
            refreshControl={
               <RefreshControl
                  colors={[Theme.PrimaryColor]}
                  refreshing={refreshing}
                  onRefresh={() => onRefresh(setPage, setRefreshing, setActivityName)}
               />
            }
         >
            <DismissKeyboard>
               <View style={BulletinDetailStyle.DetailContainer}>
                  <View style={BulletinDetailStyle.DetailImage}>
                     <Image style={BulletinDetailStyle.ImageDetail} source={{ uri: bulletin.image }} />
                  </View>

                  <RenderHTML
                     contentWidth={screenWidth}
                     source={{ html: bulletin.description }}
                     baseStyle={BulletinDetailStyle.DetailDescription}
                     defaultTextProps={{
                        numberOfLines: isExpanded ? 0 : 3,
                        ellipsizeMode: 'tail',
                     }}
                  />
                  <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                     <Text style={BulletinDetailStyle.MoreButton}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                  </TouchableOpacity>

                  <Text style={BulletinDetailStyle.DetailDate}>
                     Ngày cập nhập: <Text>{formatDate(bulletin.updated_date)}</Text>
                  </Text>
               </View>

               <View style={{ marginTop: 20 }}>
                  <View style={BulletinDetailStyle.Header}>
                     <Text style={BulletinDetailStyle.Title}>Danh sách hoạt động</Text>
                  </View>
                  <Searchbar
                     value={activityName}
                     placeholder="Tìm kiếm hoạt động"
                     onChangeText={(value) => search(value, setPage, setActivityName)}
                  />
                  <CardList
                     data={activities}
                     page={page}
                     loading={activityLoading}
                     style={{ marginBottom: 0 }}
                     cardOnPress={goActivityDetail}
                  />
               </View>
            </DismissKeyboard>
         </ScrollView>
      </View>
   );
};

const BulletinDetailStyle = StyleSheet.create({
   Container: {
      marginHorizontal: 12,
      marginTop: 32,
   },
   Header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   Title: {
      fontSize: 28,
      color: Theme.PrimaryColor,
      fontFamily: Theme.Bold,
   },
   DetailContainer: {
      borderWidth: 1,
      borderColor: Theme.PrimaryColor,
      padding: 10,
      borderRadius: 16,
      marginTop: 20,
   },
   DetailImage: {
      justifyContent: 'center',
      width: '100%',
      height: screenHeight / 4,
   },
   ImageDetail: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
   },
   DetailDescription: {
      fontSize: 18,
      fontFamily: Theme.Regular,
      lineHeight: 30,
      marginTop: 8,
      marginBottom: 20,
   },
   MoreButton: {
      fontFamily: Theme.Bold,
      fontSize: 17.2,
      marginTop: -15,
      marginBottom: 10,
   },
   DetailDate: {
      fontSize: 13.2,
      fontFamily: Theme.SemiBold,
      color: 'gray',
   },
});

export default BulletinDetail;
