import { AntDesign, Ionicons } from '@expo/vector-icons';
import 'moment/locale/vi';
import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modal, Portal } from 'react-native-paper';
import { RichEditor } from 'react-native-pell-rich-editor';
import Loading from '../../components/common/Loading';
import ActivityDetailsCommentsView from '../../components/home/activityDetails/ActivityDetailsCommentsView';
import ActivityDetailsOverview from '../../components/home/activityDetails/ActivityDetailsOverview';
import { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle, { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { tabsActivityDetails } from '../../utils/Fields';
import { getTokens, refreshAccessToken } from '../../utils/Utilities';
import HomeStyle from './Style';

const ActivityDetails = ({ navigation, route }) => {
   const activityID = route?.params?.activityID;
   const dispatch = useAccountDispatch();

   const refEditorComment = useRef(RichEditor);

   const [activity, setActivity] = useState({});
   const [tab, setTab] = useState('overview');
   const [liked, setLiked] = useState(false);
   const [totalLikes, setTotalLikes] = useState(0);
   const [isRendered, setIsRendered] = useState(false);
   const [modalVisible, setModalVisible] = useState(false);
   const [activityLoading, setActivityLoading] = useState(false);

   const animatedHeight = useState(new Animated.Value(screenHeight / 3))[0];

   useEffect(() => {
      loadActivity();
   }, []);

   const loadActivity = async () => {
      if (!activityID) return;

      setActivityLoading(true);
      try {
         const { accessToken } = await getTokens();
         let res = await authAPI(accessToken).get(endPoints['activity-detail'](activityID));

         if (res.status === statusCode.HTTP_200_OK) {
            setActivity(res.data);
            setTotalLikes(res.data.total_likes);
            setLiked(res.data?.liked ?? false);
         }
      } catch (error) {
         console.error('Activity details', error);
      } finally {
         setActivityLoading(false);
         setIsRendered(true);
      }
   };

   const handleLikeActivity = async () => {
      setLiked(!liked);
      setTotalLikes(liked ? totalLikes - 1 : totalLikes + 1);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let res = await authAPI(accessToken).post(endPoints['activity-like'](activityID));

         return res.data;
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_401_UNAUTHORIZED) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) handleLikeActivity();
         } else console.error(error);
      }
   };

   const handleChangeTab = (name) => {
      setTab(name);

      if (name !== 'overview') animateHeight(screenHeight / 6);
      else animateHeight(screenHeight / 3);
   };

   const handleOnPressWithoutFeedback = () => {
      if (currentTab('comments')) {
         if (refEditorComment?.current?.isKeyboardOpen) refEditorComment?.current?.dismissKeyboard();
      }
   };

   const animateHeight = (toValue) => {
      Animated.timing(animatedHeight, {
         toValue,
         duration: 500,
         useNativeDriver: false,
      }).start();
   };

   const currentTab = (name) => tab === name;

   const tabContent = () => {
      switch (tab) {
         case 'overview':
            return (
               <ActivityDetailsOverview
                  loading={activityLoading}
                  activityID={activityID}
                  activity={activity}
                  setActivity={setActivity}
                  setModalVisible={setModalVisible}
               />
            );
         case 'comments':
            return (
               <ActivityDetailsCommentsView
                  refEditorComment={refEditorComment}
                  activityID={activityID}
                  setModalVisible={setModalVisible}
               />
            );
         default:
            return null;
      }
   };

   if (!isRendered) return <Loading />;

   return (
      <GestureHandlerRootView>
         <View style={GlobalStyle.BackGround} onTouchStart={handleOnPressWithoutFeedback}>
            <Animated.View style={{ ...HomeStyle.Image, height: animatedHeight }}>
               <ImageBackground source={{ uri: activity.image }} style={{ flex: 1 }}>
                  <TouchableOpacity
                     activeOpacity={0.8}
                     style={HomeStyle.BackButton}
                     onPress={() => navigation.goBack()}
                  >
                     <Ionicons name="chevron-back" color="gray" size={30} />
                  </TouchableOpacity>
               </ImageBackground>
            </Animated.View>
            <View style={{ ...HomeStyle.Body, paddingBottom: currentTab('overview') ? 0 : screenHeight / 16 }}>
               <View style={HomeStyle.Header}>
                  <Text style={HomeStyle.HeaderText}>{activity.name}</Text>
                  <View style={ActivityDetailsStyle.Like}>
                     <Text style={ActivityDetailsStyle.LikeDetail}>{totalLikes}</Text>
                     <TouchableOpacity onPress={handleLikeActivity}>
                        <AntDesign
                           size={28}
                           name={liked ? 'like1' : 'like2'}
                           color={liked ? Theme.PrimaryColor : 'black'}
                        />
                     </TouchableOpacity>
                  </View>
               </View>

               <View style={HomeStyle.TabContainer}>
                  {tabsActivityDetails.map((f) => (
                     <TouchableOpacity
                        key={f.name}
                        style={HomeStyle.TabItem}
                        disabled={f.name === tab ? true : false}
                        onPress={() => handleChangeTab(f.name)}
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

         <Portal>
            <Modal visible={modalVisible} style={GlobalStyle.Container}>
               <Loading />
            </Modal>
         </Portal>
      </GestureHandlerRootView>
   );
};

const ActivityDetailsStyle = StyleSheet.create({
   Like: {
      padding: 4,
      flexDirection: 'row',
      alignItems: 'center',
   },
   LikeDetail: {
      fontFamily: Theme.Bold,
      fontSize: 18,
      marginRight: 8,
   },
});

export default ActivityDetails;
