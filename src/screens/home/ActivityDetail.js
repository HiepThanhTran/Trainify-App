import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import moment from 'moment';
import 'moment/locale/vi';
import { memo, useEffect, useRef, useState } from 'react';
import {
   Alert,
   Animated,
   Easing,
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
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Loading from '../../components/common/Loading';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle, { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { tabsActivity } from '../../utils/Fields';
import { formatDate, getTokens, loadMore, refreshAccessToken } from '../../utils/Utilities';

const Overview = memo(({ activity, ...props }) => {
   const [isExpanded, setIsExpanded] = useState(false);

   if (props?.loading) return <Loading />;

   return (
      <View style={{ ...ActivityDetailStyle.ActivityInfo, ...props?.style }}>
         <View style={ActivityDetailStyle.SummaryContainer}>
            <View style={ActivityDetailStyle.SummaryItem}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="timer" size={32} />
               </View>
               <View>
                  <Text style={ActivityDetailStyle.SummaryText}>Ngày bắt đầu</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{formatDate(activity.start_date)}</Text>
               </View>
            </View>
            <View style={ActivityDetailStyle.SummaryItem}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="timer" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Ngày kết thúc</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{formatDate(activity.end_date)}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityDetailStyle.SummaryContainer}>
            <View style={ActivityDetailStyle.SummaryItem}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="reader" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>ĐRL điều</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{activity.criterion}</Text>
               </View>
            </View>
            <View style={ActivityDetailStyle.SummaryItem}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="bookmark" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Điểm cộng</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{activity.point}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityDetailStyle.SummaryContainer}>
            <View style={ActivityDetailStyle.SummaryItem}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="people" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Đối tượng</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{activity.participant}</Text>
               </View>
            </View>
            <View style={ActivityDetailStyle.SummaryItem}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="contrast" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Hình thức</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{activity.organizational_form}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityDetailStyle.SummaryContainer}>
            <View style={{ ...ActivityDetailStyle.SummaryItem, width: '100%' }}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="location" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Địa điểm</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{activity.location}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityDetailStyle.SummaryContainer}>
            <View style={{ ...ActivityDetailStyle.SummaryItem, width: '100%' }}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="school" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Khoa</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{activity.faculty}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityDetailStyle.SummaryContainer}>
            <View style={{ ...ActivityDetailStyle.SummaryItem, width: '100%' }}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="hourglass-outline" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Học kỳ</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{activity.semester}</Text>
               </View>
            </View>
         </View>

         <View style={{ marginTop: 12 }}>
            <Text style={{ fontFamily: Theme.Bold, fontSize: 20 }}>Mô tả hoạt động</Text>
            <RenderHTML
               contentWidth={screenWidth}
               source={{ html: activity.description }}
               baseStyle={ActivityDetailStyle.Description}
               defaultTextProps={{
                  numberOfLines: isExpanded ? 0 : 3,
                  ellipsizeMode: 'tail',
               }}
            />
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
               <Text style={ActivityDetailStyle.MoreButton}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
            </TouchableOpacity>
         </View>

         <View style={{ ...ActivityDetailStyle.SummaryContainer, marginTop: 12 }}>
            <View style={ActivityDetailStyle.SummaryItem}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="time" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Ngày tạo</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{formatDate(activity.created_date)}</Text>
               </View>
            </View>
            <View style={ActivityDetailStyle.SummaryItem}>
               <View style={ActivityDetailStyle.SummaryIcon}>
                  <Ionicons name="time" size={32} />
               </View>
               <View style={ActivityDetailStyle.Summary}>
                  <Text style={ActivityDetailStyle.SummaryText}>Ngày cập nhật</Text>
                  <Text style={ActivityDetailStyle.SummaryValue}>{formatDate(activity.updated_date)}</Text>
               </View>
            </View>
         </View>
      </View>
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

   if (props?.loading && props?.page === 1) return <Loading />;

   return (
      <View style={{ ...props?.style }}>
         <View style={{ marginBottom: 8 }}>
            {comments.map((c, index) => {
               const isExpanded = expandedComments[c.id];
               const contentLength = c?.content?.length || 0;
               const shouldShowMoreButton = contentLength > 100;

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
                                 onPress={() => {
                                    props?.setSelectedComment(c);
                                    props?.refBottomSheetSettings?.current?.expand();
                                    props?.refEditorComment?.current?.dismissKeyboard();
                                 }}
                              >
                                 <Icon source="dots-vertical" size={28} />
                              </TouchableOpacity>
                           )}

                           <Text style={CommentsStyle.Username}>{c?.account.user.full_name}</Text>
                           <RenderHTML
                              contentWidth={screenWidth}
                              source={{ html: c?.content }}
                              baseStyle={ActivityDetailStyle.Description}
                              defaultTextProps={{
                                 numberOfLines: isExpanded ? 0 : 2,
                                 ellipsizeMode: 'tail',
                              }}
                           />
                           {shouldShowMoreButton && (
                              <TouchableOpacity onPress={() => toggleExpandComment(c.id)}>
                                 <Text style={ActivityDetailStyle.MoreButton}>
                                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                 </Text>
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
   );
});

const ActivityDetail = ({ navigation, route }) => {
   console.log('re-render');
   const activityID = route?.params?.activityID;
   const dispatch = useAccountDispatch();

   const refScrollView = useRef(null);
   const refEditorComment = useRef(null);
   const refEditorEditComment = useRef(null);
   const refBottomSettings = useRef(null);
   const refBottomEditComment = useRef(null);

   const [selectedComment, setSelectedComment] = useState({});
   const [activity, setActivity] = useState({});
   const [comments, setComments] = useState([]);
   const [comment, setComment] = useState('');
   const [liked, setLiked] = useState(false);
   const [totalLikes, setTotalLikes] = useState(0);
   const [page, setPage] = useState(1);
   const [tab, setTab] = useState('overview');
   const [modalVisible, setModalVisible] = useState(false);
   const [activityLoading, setActivityLoading] = useState(false);
   const [commentsLoading, setCommentsLoading] = useState(false);
   const [indexBottomSettings, setIndexBottomSettings] = useState(-1);
   const [indexBottomEditComment, setIndexBottomEditComment] = useState(-1);
   const animatedHeight = useState(new Animated.Value(screenHeight / 3))[0];

   useEffect(() => {
      loadActivity();
   }, []);

   useEffect(() => {
      loadComments();
   }, [page]);

   const loadActivity = async () => {
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
      }
   };

   const loadComments = async () => {
      if (page < 1) return;

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

   const handleRegisterActivity = async () => {
      setModalVisible(true);
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
         setModalVisible(false);
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
      if (tab === 'comments') {
         refEditorComment?.current?.dismissKeyboard();
         refEditorEditComment?.current?.dismissKeyboard();
         if (indexBottomSettings > -1) refBottomSettings?.current?.close();
         if (indexBottomEditComment > -1) refBottomEditComment?.current?.close();
      }
   };

   const changeTab = (name) => {
      setTab(name);
      if (name !== 'comments') {
         animateHeight(screenHeight / 3);
         if (indexBottomSettings > -1) refBottomSettings?.current?.close();
         if (indexBottomEditComment > -1) refBottomEditComment?.current?.close();
         if (refEditorComment?.current?.isKeyboardOpen) refEditorComment?.current?.dismissKeyboard();
      } else {
         setPage(1);
         animateHeight(screenHeight / 6);
      }
   };

   const currentTab = (name) => {
      return tab === name;
   };

   const animateHeight = (toValue) => {
      Animated.timing(animatedHeight, {
         toValue: toValue,
         duration: 300,
         useNativeDriver: false,
         easing: Easing.out(Easing.quad),
      }).start();
   };

   if (activityLoading) return <Loading />;

   return (
      <GestureHandlerRootView>
         <View style={GlobalStyle.BackGround}>
            <ScrollView
               showsVerticalScrollIndicator={false}
               showsHorizontalScrollIndicator={false}
               onScroll={({ nativeEvent }) => {
                  if (currentTab('comments')) loadMore(nativeEvent, commentsLoading, page, setPage);
               }}
            >
               <DismissKeyboard onPress={handleOnPressWithoutFeedback}>
                  <Animated.View style={{ ...ActivityDetailStyle.Image, height: animatedHeight }}>
                     <ImageBackground source={{ uri: activity.image }} style={{ flex: 1 }}>
                        <TouchableOpacity
                           activeOpacity={0.8}
                           style={ActivityDetailStyle.BackButton}
                           onPress={() => navigation.goBack()}
                        >
                           <Ionicons name="chevron-back" color="gray" size={30} />
                        </TouchableOpacity>
                     </ImageBackground>
                  </Animated.View>
                  <View
                     style={{ ...ActivityDetailStyle.Body, ...(!currentTab('overview') ? { paddingBottom: 0 } : {}) }}
                  >
                     <View style={ActivityDetailStyle.Header}>
                        <Text style={ActivityDetailStyle.HeaderText}>{activity.name}</Text>
                        <View style={ActivityDetailStyle.Like}>
                           <Text style={ActivityDetailStyle.LikeDetail}>{totalLikes}</Text>
                           <TouchableOpacity onPress={handleLikeActivity}>
                              <AntDesign
                                 size={28}
                                 name={liked ? 'like1' : 'like2'}
                                 color={liked ? Theme.PrimaryColor : 'black'}
                              />
                           </TouchableOpacity>
                        </View>
                     </View>

                     <View style={ActivityDetailStyle.TabContainer}>
                        {tabsActivity.map((f) => (
                           <TouchableOpacity
                              key={f.name}
                              style={ActivityDetailStyle.TabItem}
                              disabled={f.name === tab ? true : false}
                              onPress={() => changeTab(f.name)}
                           >
                              <Text
                                 style={{
                                    ...ActivityDetailStyle.TabText,
                                    ...(f.name === tab ? { color: Theme.PrimaryColor } : {}),
                                 }}
                              >
                                 {f.label}
                              </Text>
                           </TouchableOpacity>
                        ))}
                     </View>

                     {currentTab('overview') && <Overview activity={activity} loading={activityLoading} />}
                     {currentTab('comments') && (
                        <CommentsView
                           refBottomSheetSettings={refBottomSettings}
                           refEditorComment={refEditorComment}
                           activityID={activityID}
                           comments={comments}
                           page={page}
                           loading={commentsLoading}
                           setSelectedComment={setSelectedComment}
                        />
                     )}
                  </View>
               </DismissKeyboard>

               {currentTab('overview') && !activityLoading && (
                  <View style={ActivityDetailStyle.Register}>
                     <TouchableOpacity style={ActivityDetailStyle.RegisterButton} onPress={alertRegisterActivity}>
                        <Text style={ActivityDetailStyle.RegisterButtonText}>
                           {activity.registered ? 'Hủy đăng ký' : 'Đăng ký'}
                        </Text>
                        <Ionicons name="arrow-forward" size={32} color="white" />
                     </TouchableOpacity>
                  </View>
               )}
            </ScrollView>

            {currentTab('comments') && (
               <View
                  style={{
                     ...CommentsStyle.CommentInput,
                  }}
               >
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
               <TouchableOpacity
                  style={GlobalStyle.BottomSheetItem}
                  onPress={() => {
                     setComment('');
                     refEditorEditComment?.current.setContentHTML(selectedComment?.content);
                     refBottomEditComment?.current?.expand();
                     refBottomSettings?.current?.close();
                  }}
               >
                  <Icon source="pencil" color="white" size={24} />
                  <Text style={GlobalStyle.BottomSheetItemText}>Chỉnh sửa bình luận</Text>
               </TouchableOpacity>
            </BottomSheetView>
            <BottomSheetView style={GlobalStyle.BottomSheetView}>
               <TouchableOpacity style={GlobalStyle.BottomSheetItem} onPress={alertDeleteComment}>
                  <Icon source="trash-can" color="white" size={24} />
                  <Text style={GlobalStyle.BottomSheetItemText}>Xóa bình luận</Text>
               </TouchableOpacity>
            </BottomSheetView>
         </BottomSheet>

         <BottomSheet
            ref={refBottomEditComment}
            index={-1}
            snapPoints={['100%']}
            onChange={setIndexBottomEditComment}
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

         <Portal>
            <Modal visible={modalVisible} style={GlobalStyle.Container}>
               <Loading />
            </Modal>
         </Portal>
      </GestureHandlerRootView>
   );
};

const ActivityDetailStyle = StyleSheet.create({
   Image: {
      width: '100%',
      height: screenHeight / 3,
   },
   BackButton: {
      backgroundColor: 'white',
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: '#d5deef',
      marginTop: 12,
      marginLeft: 12,
   },
   Body: {
      padding: 20,
      bottom: 30,
      borderRadius: 32,
      backgroundColor: 'white',
      paddingBottom: screenHeight / 16,
   },
   Header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   HeaderText: {
      flex: 1,
      flexWrap: 'wrap',
      fontSize: 24,
      fontFamily: Theme.Bold,
   },
   TabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderTopWidth: 0.5,
      marginVertical: 12,
      justifyContent: 'space-between',
   },
   TabItem: {
      marginHorizontal: 12,
      paddingVertical: 16,
   },
   TabText: {
      fontSize: 16,
      fontFamily: Theme.SemiBold,
   },
   SummaryContainer: {
      marginBottom: 12,
      flexDirection: 'row',
   },
   SummaryItem: {
      width: '50%',
      alignItems: 'center',
      flexDirection: 'row',
   },
   SummaryIcon: {
      padding: 8,
      marginRight: 12,
      borderRadius: 8,
      backgroundColor: 'lightgrey',
   },
   Summary: {
      flex: 1,
   },
   SummaryText: {
      fontSize: 16,
   },
   SummaryValue: {
      fontSize: 16,
      fontWeight: '700',
   },
   Description: {
      fontSize: 16,
      lineHeight: 28,
      fontFamily: Theme.Regular,
   },
   MoreButton: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      color: 'grey',
   },
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
      marginHorizontal: 16,
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

export default ActivityDetail;
