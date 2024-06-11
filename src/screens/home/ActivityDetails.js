import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import moment from 'moment';
import 'moment/locale/vi';
import { memo, useEffect, useRef, useState } from 'react';
import {
   Alert,
   Animated,
   Image,
   ImageBackground,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { screenWidth } from 'react-native-gifted-charts/src/utils';
import { Icon, Modal, Portal } from 'react-native-paper';
import { RichEditor } from 'react-native-pell-rich-editor';
import RenderHTML from 'react-native-render-html';
import Loading from '../../components/common/Loading';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle, { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { tabsActivityDetails } from '../../utils/Fields';
import { formatDate, getTokens, loadMore, refreshAccessToken } from '../../utils/Utilities';
import HomeStyle from './Style';

const Overview = memo(({ activityID, activity, setActivity, ...props }) => {
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
         } else console.error(error);
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
         <View style={{ ...props?.style, ...HomeStyle.DetailsContainer, paddingBottom: screenHeight / 12 }}>
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
                     <Ionicons name="bookmarks" size={32} />
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
                     <AntDesign name="hourglass" size={32} />
                  </View>
                  <View style={HomeStyle.Details}>
                     <Text style={HomeStyle.DetailsText}>Học kỳ</Text>
                     <Text style={HomeStyle.DetailsValue}>{activity.semester}</Text>
                  </View>
               </View>
            </View>

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

            <View style={ActivityDetailsStyle.Register}>
               <TouchableOpacity style={ActivityDetailsStyle.RegisterButton} onPress={alertRegisterActivity}>
                  <Text style={ActivityDetailsStyle.RegisterButtonText}>
                     {activity.registered ? 'Hủy đăng ký' : 'Đăng ký'}
                  </Text>
                  <Ionicons name="arrow-forward" size={32} color="white" />
               </TouchableOpacity>
            </View>
         </View>
      </ScrollView>
   );
});

const CommentsView = memo(({ activityID, comments, ...props }) => {
   const currentAccount = useAccount();

   const [expandedComments, setExpandedComments] = useState({});

   const toggleExpandComment = (commentId) => {
      setExpandedComments((prevState) => ({
         ...prevState,
         [commentId]: !prevState[commentId],
      }));
   };

   const handleOnPressSettings = (comment) => {
      props?.setSelectedComment(comment);
      props?.refBottomSettings?.current?.expand();
      if (props?.refEditorComment?.current?.isKeyboardOpen) props?.refEditorComment?.current?.dismissKeyboard();
   };

   if (props?.loading && props?.page === 1) return <Loading />;

   return (
      <ScrollView
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         onScroll={({ nativeEvent }) => loadMore(nativeEvent, props?.loading, props?.page, props?.setPage)}
      >
         <View style={{ ...props?.style }}>
            <View style={{ marginBottom: 8 }}>
               {comments.map((c, index) => {
                  const isExpanded = expandedComments[c.id];
                  const contentLength = c?.content?.length || 0;
                  const shouldShowMoreButton = contentLength > 74;

                  return (
                     <View
                        key={c.id}
                        style={{
                           ...CommentsStyle.Card,
                           ...(index !== comments.length - 1 ? { borderBottomWidth: 0.5 } : {}),
                        }}
                     >
                        <View style={{ flexDirection: 'row' }}>
                           <View style={{ overflow: 'hidden' }}>
                              <Image source={{ uri: c?.account.avatar }} style={CommentsStyle.Avatar} />
                           </View>
                           <View style={CommentsStyle.CardContent}>
                              {c.account.id === currentAccount.data.id && (
                                 <TouchableOpacity
                                    style={CommentsStyle.Settings}
                                    onPress={() => handleOnPressSettings(c)}
                                 >
                                    <Icon source="dots-vertical" size={28} />
                                 </TouchableOpacity>
                              )}

                              <Text style={CommentsStyle.Username}>{c?.account.user.full_name}</Text>
                              <RenderHTML
                                 contentWidth={screenWidth}
                                 source={{ html: c?.content }}
                                 baseStyle={HomeStyle.DetailsDescription}
                                 defaultTextProps={{
                                    numberOfLines: isExpanded ? 0 : 2,
                                    ellipsizeMode: 'tail',
                                 }}
                              />
                              {shouldShowMoreButton && (
                                 <TouchableOpacity onPress={() => toggleExpandComment(c.id)}>
                                    <Text style={HomeStyle.MoreButton}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                                 </TouchableOpacity>
                              )}
                           </View>
                        </View>
                        <Text style={CommentsStyle.CreatedDate}>{moment(c?.created_date).fromNow()}</Text>
                     </View>
                  );
               })}
               {props?.loading && props?.page > 1 && <Loading />}
            </View>
         </View>
      </ScrollView>
   );
});

const ActivityDetails = ({ navigation, route }) => {
   const activityID = route?.params?.activityID;
   const dispatch = useAccountDispatch();

   const refScrollView = useRef(null);
   const refEditorComment = useRef(null);
   const refEditorEditComment = useRef(null);
   const refBottomSettings = useRef(null);
   const refBottomEditComment = useRef(null);

   const [selectedComment, setSelectedComment] = useState({});
   const [tab, setTab] = useState('overview');
   const [activity, setActivity] = useState({});
   const [comments, setComments] = useState([]);
   const [page, setPage] = useState(1);
   const [comment, setComment] = useState('');
   const [liked, setLiked] = useState(false);
   const [totalLikes, setTotalLikes] = useState(0);
   const [modalVisible, setModalVisible] = useState(false);
   const [isRendered, setIsRendered] = useState(false);
   const [activityLoading, setActivityLoading] = useState(false);
   const [commentsLoading, setCommentsLoading] = useState(false);
   const [indexBottomSettings, setIndexBottomSettings] = useState(-1);

   const animatedHeight = useState(new Animated.Value(screenHeight / 3))[0];

   useEffect(() => {
      loadActivity();
   }, []);

   useEffect(() => {
      loadComments();
   }, [page]);

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
         console.error(error);
      } finally {
         setActivityLoading(false);
         setIsRendered(true);
      }
   };

   const loadComments = async () => {
      if (!activityID || page < 1) return;

      setCommentsLoading(true);
      try {
         let res = await APIs.get(endPoints['activity-comments'](activityID), { params: { page } });

         if (res.data.next === null) setPage(0);
         if (res.status === statusCode.HTTP_200_OK) {
            if (page === 1) setComments(res.data.results);
            else setComments((prevComments) => [...prevComments, ...res.data.results]);
         }
      } catch (error) {
         console.error(error);
      } finally {
         setCommentsLoading(false);
      }
   };

   const handleAddComment = async () => {
      if (!comment) return;

      let form = new FormData();
      form.append('content', comment);

      setModalVisible(true);
      refEditorComment?.current?.dismissKeyboard();
      const { accessToken, refreshToken } = await getTokens();
      try {
         let res = await authAPI(accessToken).post(endPoints['activity-comments'](activityID), form, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === statusCode.HTTP_201_CREATED) {
            setComments((prevComments) => [res.data, ...prevComments]);
            setComment('');
            refEditorComment?.current?.setContentHTML('');
         }
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_401_UNAUTHORIZED) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) handleAddComment();
         } else console.error(error);
      } finally {
         setModalVisible(false);
      }
   };

   const handleEditComment = async () => {
      if (!comment) return;

      let form = new FormData();
      form.append('content', comment);

      setModalVisible(true);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let res = await authAPI(accessToken).put(endPoints['comment-detail'](selectedComment.id), form, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === statusCode.HTTP_200_OK) {
            const index = comments.findIndex((comment) => comment.id === selectedComment.id);
            setComments([...comments.slice(0, index), res.data, ...comments.slice(index + 1)]);
         }
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_401_UNAUTHORIZED) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) handleEditComment();
         } else console.error(error);
      } finally {
         setModalVisible(false);
         refBottomEditComment?.current?.close();
      }
   };

   const handleDeleteComment = async () => {
      setModalVisible(true);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let res = await authAPI(accessToken).delete(endPoints['comment-detail'](selectedComment.id));

         if (res.status === statusCode.HTTP_204_NO_CONTENT) {
            setComments(comments.filter((c) => c.id !== selectedComment.id));
         }
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_401_UNAUTHORIZED) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) handleDeleteComment();
         } else console.error(error);
      } finally {
         setModalVisible(false);
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

   const alertDeleteComment = () => {
      refBottomSettings?.current?.close();
      Alert.alert(
         'Xóa bình luận',
         'Hành động không thể hoàn tác, tiếp tục?',
         [
            {
               text: 'Xóa',
               onPress: () => handleDeleteComment(),
            },
            { text: 'Hủy', style: 'cancel' },
         ],
         { cancelable: true },
      );
   };

   const handleRichTextOnChange = (value) => {
      setComment(value);
      refScrollView?.current?.scrollToEnd();
   };

   const handleOnPressWithoutFeedback = () => {
      if (currentTab('comments')) {
         if (indexBottomSettings > -1) refBottomSettings?.current?.close();
         if (refEditorComment?.current?.isKeyboardOpen) refEditorComment?.current?.dismissKeyboard();
      }
   };

   const handleOnPressEditComment = () => {
      setComment('');
      refBottomSettings?.current?.close();
      refBottomEditComment?.current?.expand();
      refEditorEditComment?.current.setContentHTML(selectedComment?.content);
   };

   const handleTabChange = (name) => {
      setTab(name);

      if (name !== 'comments') animateHeight(screenHeight / 3);
      else {
         animateHeight(screenHeight / 6);
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
            return (
               <Overview
                  activityID={activityID}
                  activity={activity}
                  setActivity={setActivity}
                  loading={activityLoading}
                  setModalVisible={setModalVisible}
               />
            );
         case 'comments':
            return (
               <CommentsView
                  activityID={activityID}
                  comments={comments}
                  page={page}
                  setPage={setPage}
                  loading={commentsLoading}
                  setSelectedComment={setSelectedComment}
                  refEditorComment={refEditorComment}
                  refBottomSettings={refBottomSettings}
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

            {currentTab('comments') && (
               <View style={CommentsStyle.CommentInput}>
                  <ScrollView
                     ref={refScrollView}
                     style={CommentsStyle.RichText}
                     showsVerticalScrollIndicator={false}
                     showsHorizontalScrollIndicator={false}
                  >
                     <RichEditor
                        ref={refEditorComment}
                        onChange={handleRichTextOnChange}
                        placeholder="Nhập bình luận của bạn..."
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={{ borderRadius: 16, overflow: 'hidden' }}
                        editorStyle={{ backgroundColor: '#d5deef', placeholderColor: 'gray' }}
                     />
                  </ScrollView>
                  <TouchableOpacity style={CommentsStyle.SendIcon} onPress={handleAddComment}>
                     <FontAwesome name="send" size={24} color={Theme.PrimaryColor} />
                  </TouchableOpacity>
               </View>
            )}
         </View>

         {currentTab('comments') && (
            <>
               <BottomSheet
                  ref={refBottomSettings}
                  index={-1}
                  snapPoints={['20%']}
                  enablePanDownToClose
                  onChange={setIndexBottomSettings}
                  backgroundStyle={{ backgroundColor: '#273238' }}
                  handleIndicatorStyle={{ backgroundColor: 'white' }}
               >
                  <BottomSheetView style={GlobalStyle.BottomSheetView}>
                     <TouchableOpacity style={GlobalStyle.BottomSheetItem} onPress={handleOnPressEditComment}>
                        <AntDesign name="edit" color="white" size={24} />
                        <Text style={GlobalStyle.BottomSheetItemText}>Chỉnh sửa bình luận</Text>
                     </TouchableOpacity>
                  </BottomSheetView>
                  <BottomSheetView style={GlobalStyle.BottomSheetView}>
                     <TouchableOpacity style={GlobalStyle.BottomSheetItem} onPress={alertDeleteComment}>
                        <Ionicons name="trash" color="white" size={24} />
                        <Text style={GlobalStyle.BottomSheetItemText}>Xóa bình luận</Text>
                     </TouchableOpacity>
                  </BottomSheetView>
               </BottomSheet>

               <BottomSheet
                  ref={refBottomEditComment}
                  index={-1}
                  snapPoints={['100%']}
                  backgroundStyle={{ backgroundColor: '#273238' }}
                  handleIndicatorStyle={{ display: 'none' }}
               >
                  <BottomSheetView
                     style={{ ...GlobalStyle.BottomSheetView, flex: 1 }}
                     onTouchStart={() => refEditorEditComment?.current?.dismissKeyboard()}
                  >
                     <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                           <View style={{ marginRight: 12 }}>
                              <Image source={{ uri: selectedComment?.account?.avatar }} style={CommentsStyle.Avatar} />
                           </View>
                           <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                              <RichEditor
                                 ref={refEditorEditComment}
                                 onChange={handleRichTextOnChange}
                                 placeholder="Nhập bình luận của bạn..."
                                 showsVerticalScrollIndicator={false}
                                 showsHorizontalScrollIndicator={false}
                                 style={{ borderRadius: 16, overflow: 'hidden' }}
                                 editorStyle={{ backgroundColor: '#d5deef', placeholderColor: 'gray' }}
                              />
                           </ScrollView>
                        </View>
                        <View style={CommentsStyle.EditButtonsContainer}>
                           <TouchableOpacity
                              style={CommentsStyle.EditButton}
                              onPress={() => refBottomEditComment?.current?.close()}
                           >
                              <Text style={CommentsStyle.EditButtonText}>Hủy</Text>
                           </TouchableOpacity>

                           <TouchableOpacity style={CommentsStyle.EditButton} onPress={handleEditComment}>
                              <Text style={CommentsStyle.EditButtonText}>Cập nhập</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </BottomSheetView>
               </BottomSheet>
            </>
         )}

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

const CommentsStyle = StyleSheet.create({
   CommentInput: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 999,
      bottom: 0,
      backgroundColor: 'white',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: 'grey',
   },
   RichText: {
      flex: 1,
      minHeight: 40,
      maxHeight: 80,
      overflow: 'hidden',
   },
   SendIcon: {
      marginLeft: 10,
      padding: 5,
   },
   Card: {
      paddingBottom: 4,
      marginBottom: 20,
      borderBottomColor: 'grey',
   },
   Avatar: {
      width: 48,
      height: 48,
      borderRadius: 30,
      backgroundColor: Theme.SecondaryColor,
   },
   CardContent: {
      width: '80%',
      marginLeft: 12,
      padding: 8,
      borderRadius: 16,
      backgroundColor: '#d5deef',
   },
   Settings: {
      position: 'absolute',
      top: 8,
      right: 4,
      zIndex: 2,
      alignItems: 'center',
      justifyContent: 'center',
   },
   Username: {
      fontFamily: Theme.Bold,
      fontSize: 16,
   },
   CreatedDate: {
      fontFamily: Theme.Regular,
      fontSize: 12,
      color: 'grey',
      fontStyle: 'italic',
      marginLeft: 60,
      marginTop: 4,
   },
   EditButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 20,
   },
   EditButton: {
      backgroundColor: 'grey',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 12,
   },
   EditButtonText: {
      color: 'white',
      fontFamily: Theme.Bold,
   },
});

export default ActivityDetails;
