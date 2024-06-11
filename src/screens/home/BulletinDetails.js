import { AntDesign, Ionicons } from '@expo/vector-icons';
import { memo, useEffect, useState } from 'react';
import { Animated, ImageBackground, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import Loading from '../../components/common/Loading';
import CardActivity from '../../components/home/CardActivity';
import APIs, { endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle, { screenHeight, screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { tabsBulletinDetails } from '../../utils/Fields';
import { formatDate } from '../../utils/Utilities';
import HomeStyle from './Style';

const Overview = memo(({ bulletin, ...props }) => {
   const [isExpanded, setIsExpanded] = useState(false);

   if (props?.loading) return <Loading />;

   return (
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
         <View style={{ ...HomeStyle.DetailsContainer, ...GlobalStyle.Container, ...props?.style }}>
            <View style={{ marginTop: 12 }}>
               <Text style={{ fontFamily: Theme.Bold, fontSize: 20 }}>Mô tả bản tin</Text>
               <RenderHTML
                  contentWidth={screenWidth}
                  source={{ html: bulletin.description }}
                  baseStyle={HomeStyle.DetailsDescription}
               />
            </View>

            <View style={{ ...HomeStyle.DetailsWrap, marginTop: 12 }}>
               <View style={HomeStyle.DetailsItem}>
                  <View style={HomeStyle.DetailsIcon}>
                     <AntDesign name="clockcircle" size={32} />
                  </View>
                  <View style={HomeStyle.Details}>
                     <Text style={HomeStyle.DetailsText}>Ngày tạo</Text>
                     <Text style={HomeStyle.DetailsValue}>{formatDate(bulletin.created_date)}</Text>
                  </View>
               </View>
               <View style={HomeStyle.DetailsItem}>
                  <View style={HomeStyle.DetailsIcon}>
                     <AntDesign name="clockcircle" size={32} />
                  </View>
                  <View style={HomeStyle.Details}>
                     <Text style={HomeStyle.DetailsText}>Cập nhật</Text>
                     <Text style={HomeStyle.DetailsValue}>{formatDate(bulletin.updated_date)}</Text>
                  </View>
               </View>
            </View>
         </View>
      </ScrollView>
   );
});

const ActivitiesView = memo(({ navigation, activities, ...props }) => {
   const goActivityDetail = (activityID) => {
      navigation.navigate('ActivityDetail', { activityID });
   };

   if (props?.loading && props?.page === 1) return <Loading />;

   return (
      <ScrollView
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         onScroll={({ nativeEvent }) => loadMore(nativeEvent, props?.loading, props?.page, props?.setPage)}
         refreshControl={
            <RefreshControl colors={[Theme.PrimaryColor]} refreshing={props?.refreshing} onRefresh={props?.onRefresh} />
         }
      >
         {activities.map((item, index) => (
            <CardActivity key={item.id} instance={item} index={index} onPress={() => goActivityDetail(item.id)} />
         ))}
         {props?.loading && props?.page > 1 && <Loading />}
      </ScrollView>
   );
});

const BulletinDetails = ({ navigation, route }) => {
   const bulletinID = route?.params?.bulletinID;
   const dispatch = useAccountDispatch();

   const [tab, setTab] = useState('overview');
   const [bulletin, setBulletin] = useState({});
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [activityName, setActivityName] = useState('');
   const [isRendered, setIsRendered] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [bulletinLoading, setBulletinLoading] = useState(false);
   const [activitiesLoading, setActivitiesLoading] = useState(false);

   const [isExpanded, setIsExpanded] = useState(false);

   const animatedHeight = useState(new Animated.Value(screenHeight / 3))[0];

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
         setIsRendered(true);
      }
   };

   const loadActivities = async () => {
      if (!bulletinID || page <= 0) return;

      setActivitiesLoading(true);
      try {
         let res = await APIs.get(endPoints['activities'], {
            params: { bulletin_id: bulletinID, page, name: activityName },
         });
         if (res.data.next === null) setPage(0);
         if (res.status === statusCode.HTTP_200_OK) {
            if (page === 1) setActivities(res.data.results);
            else setActivities((prevActivities) => [...prevActivities, ...res.data.results]);
         }
      } catch (error) {
         console.error(error);
      } finally {
         setActivitiesLoading(false);
         setRefreshing(false);
      }
   };

   const handleTabChange = (name) => {
      setTab(name);

      if (name !== 'overview') {
         animateHeight(screenHeight / 6);
      } else {
         animateHeight(screenHeight / 3);
      }
   };

   const currentTab = (name) => tab === name;

   const animateHeight = (toValue) => {
      Animated.timing(animatedHeight, {
         toValue,
         duration: 500,
         useNativeDriver: false,
      }).start();
   };

   const tabContent = () => {
      switch (tab) {
         case 'overview':
            return <Overview bulletin={bulletin} loading={bulletinLoading} />;
         case 'activities':
            return (
               <ActivitiesView
                  navigation={navigation}
                  activities={activities}
                  loading={activitiesLoading}
                  page={page}
                  refreshing={refreshing}
                  setPage={setPage}
               />
            );
         default:
            return null;
      }
   };

   if (!isRendered) return <Loading />;

   return (
      <View style={{ ...GlobalStyle.BackGround, flex: 1, backgroundColor: 'blue' }} onPress={() => {}}>
         <Animated.View style={{ ...HomeStyle.Image, height: animatedHeight }}>
            <ImageBackground source={{ uri: bulletin.image }} style={{ flex: 1 }}>
               <TouchableOpacity activeOpacity={0.8} style={HomeStyle.BackButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" color="gray" size={30} />
               </TouchableOpacity>
            </ImageBackground>
         </Animated.View>

         <View style={HomeStyle.Body}>
            <View style={HomeStyle.Header}>
               <Text style={HomeStyle.HeaderText}>{bulletin.name}</Text>
            </View>

            <View style={HomeStyle.TabContainer}>
               {tabsBulletinDetails.map((f) => (
                  <TouchableOpacity
                     key={f.name}
                     style={HomeStyle.TabItem}
                     disabled={f.name === tab ? true : false}
                     onPress={() => handleTabChange(f.name)}
                  >
                     <Text
                        style={{
                           ...HomeStyle.TabText,
                           color: f.name === tab ? Theme.PrimaryColor : 'black',
                        }}
                     >
                        {f.label}
                     </Text>
                  </TouchableOpacity>
               ))}
            </View>
            {tabContent()}
         </View>
      </View>
   );
};

export default BulletinDetails;
