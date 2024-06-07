import { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Loading from '../../components/common/Loading';
import Searchbar from '../../components/common/Searchbar';
import CardList from '../../components/home/CardList';
import APIs, { endPoints } from '../../configs/APIs';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import GlobalStyle, { screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { formatDate, loadMore, onRefresh, search } from '../../utils/Utilities';
import ActivityStyle from './Style';

const BulletinDetail = ({ navigation, route }) => {
   const { refreshing, setRefreshing } = useGlobalContext();
   const bulletinID = route?.params?.bulletinID;

   const [bulletin, setBulletin] = useState({});
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [activityName, setActivityName] = useState('');
   const [isExpanded, setIsExpanded] = useState(false);
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
         setBulletin(res.data);
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
            style={{ ...ActivityStyle.Container, marginTop: 0 }}
            onScroll={({ nativeEvent }) => loadMore(nativeEvent, activityLoading, page, setPage)}
            refreshControl={
               <RefreshControl
                  colors={[Theme.PrimaryColor]}
                  refreshing={refreshing}
                  onRefresh={() => onRefresh(setPage, setActivityName, setRefreshing)}
               />
            }
         >
            <DismissKeyboard>
               <View style={ActivityStyle.DetailContainer}>
                  <View style={ActivityStyle.DetailImage}>
                     <Image style={ActivityStyle.ImageDetail} source={{ uri: bulletin.image }} />
                  </View>

                  <RenderHTML
                     contentWidth={screenWidth}
                     source={{ html: bulletin.description }}
                     baseStyle={ActivityStyle.DetailDescription}
                     defaultTextProps={{
                        numberOfLines: isExpanded ? 0 : 4,
                        ellipsizeMode: 'tail',
                     }}
                  />
                  <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                     <Text style={ActivityStyle.MoreButton}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                  </TouchableOpacity>

                  <Text style={ActivityStyle.DetailDate}>
                     Ngày cập nhập: <Text>{formatDate(bulletin.updated_date)}</Text>
                  </Text>
               </View>

               <View style={{ marginTop: 20 }}>
                  <View style={ActivityStyle.Header}>
                     <Text style={ActivityStyle.Title}>Danh sách hoạt động</Text>
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

export default BulletinDetail;
