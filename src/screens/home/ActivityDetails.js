import { AntDesign, Ionicons } from '@expo/vector-icons';
import 'moment/locale/vi';
import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { RichEditor } from 'react-native-pell-rich-editor';
import Loading from '../../components/common/Loading';
import ActivitySummary from '../../components/home/ActivityDetails/ActivitySummary';
import CommentsListView from '../../components/home/ActivityDetails/CommentsListView';
import { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle, { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { tabsContent } from '../../utils/Fields';
import { getTokens, refreshAccessToken } from '../../utils/Utilities';
import HomeStyle from './Style';

const ActivityDetails = ({ navigation, route }) => {
   const activityID = route?.params?.activityID;
   const dispatch = useAccountDispatch();

   const refEditorComment = useRef(RichEditor);

   const [isRendered, setIsRendered] = useState(false);
   const [activity, setActivity] = useState({});
   const [tab, setTab] = useState('overview');
   const [liked, setLiked] = useState(false);
   const [totalLikes, setTotalLikes] = useState(0);
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
         let response = await authAPI(accessToken).get(endPoints['activity-detail'](activityID));

         if (response.status === statusCode.HTTP_200_OK) {
            setActivity(response.data);
            setTotalLikes(response.data.total_likes);
            setLiked(response.data?.liked ?? false);
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
         let response = await authAPI(accessToken).post(endPoints['activity-like'](activityID));

         return response.data;
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_401_UNAUTHORIZED) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) {
               handleLikeActivity();
            }
         } else {
            console.error(error);
         }
      }
   };

   const handleChangeTab = (tabName) => {
      setTab(tabName);

      if (tabName !== 'overview') {
         animateHeight(screenHeight / 6);
      } else {
         animateHeight(screenHeight / 3);
      }
   };

   const handleOnPressWithoutFeedback = () => {
      if (currentTab('comments')) {
         if (refEditorComment?.current?.isKeyboardOpen) {
            refEditorComment?.current?.dismissKeyboard();
         }
      }
   };

   const tabContent = () => {
      switch (tab) {
         case 'overview':
            return (
               <ActivitySummary
                  loading={activityLoading}
                  activityID={activityID}
                  activity={activity}
                  setActivity={setActivity}
                  setModalVisible={setModalVisible}
               />
            );
         case 'comments':
            return (
               <CommentsListView
                  refEditorComment={refEditorComment}
                  activityID={activityID}
                  setModalVisible={setModalVisible}
               />
            );
         default:
            return null;
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

   if (!isRendered) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround} onTouchStart={handleOnPressWithoutFeedback}>
         <Animated.View style={{ ...HomeStyle.Image, height: animatedHeight }}>
            <ImageBackground source={{ uri: activity.image }} style={{ flex: 1 }}>
               <TouchableOpacity activeOpacity={0.8} style={GlobalStyle.BackButton} onPress={() => navigation.goBack()}>
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
               {tabsContent.activity.map((f) => (
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

         <Portal>
            <Modal visible={modalVisible} style={GlobalStyle.Container}>
               <Loading />
            </Modal>
         </Portal>
      </View>
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
