import { AntDesign, FontAwesome } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RichEditor } from 'react-native-pell-rich-editor';
import RenderHTML from 'react-native-render-html';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Loading from '../../components/common/Loading';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccount } from '../../store/contexts/AccountContext';
import GlobalStyle, { screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { formatDate, isCloseToBottom } from '../../utils/Utilities';
import CommentStyle from './CommentStyle';
import ActivityStyle from './Style';

const ActivityDetail = ({ route }) => {
   const [activityDetail, setActivityDetail] = useState(null);
   const [comments, setComments] = useState([]);
   const [page, setPage] = useState(1);
   const [activityDetailLoading, setActivityDetailLoading] = useState(true);
   const [commentLoading, setCommentLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [isExpanded, setIsExpanded] = useState(false);
   const [checkcomment, setCheckComment] = useState(false);
   const richText = useRef();
   const richText1 = useRef();
   const [newcomment, setNewComment] = useState('');
   const { data: accountData } = useAccount();
   const activityID = route?.params?.activityID;
   const [isFormEditVisible, setIsFormEditVisible] = useState(false);
   const [selectedCommentID, setSelectedCommentID] = useState(null);
   const bottomSheetRef = useRef(BottomSheet);
   const [commentcontent, setCommentContent] = useState('');
   const [commentcontentId, setCommentContentId] = useState('');

   const handleToggleCommentForm = (commentID) => {
      if (selectedCommentID === commentID) {
         setSelectedCommentID(null);
      } else {
         setSelectedCommentID(commentID);
      }
   };

   const loadActivityDetail = async () => {
      try {
         setActivityDetailLoading(true);
         const accessToken = await AsyncStorage.getItem('access-token');
         let res = await authAPI(accessToken).get(endPoints['activity-detail'](activityID));
         setActivityDetail(res.data);
      } catch (error) {
         if (error.response) {
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
         } else if (error.request) {
            console.error(error.request);
         } else {
            console.error(`Error message: ${error.message}`);
         }
      } finally {
         setActivityDetailLoading(false);
      }
   };

   const loadComments = async () => {
      if (page > 0) {
         setCommentLoading(true);
         try {
            let res = await APIs.get(endPoints['activity-comments'](activityID), { params: { page } });
            if (res.data.next === null) {
               setPage(0);
            }
            if (page === 1 || checkcomment === true) {
               setComments(res.data.results);
            } else {
               setComments((current) => [...current, ...res.data.results]);
            }
         } catch (error) {
            if (error.response) {
               console.error(error.response.data);
               console.error(error.response.status);
               console.error(error.response.headers);
            } else if (error.request) {
               console.error(error.request);
            } else {
               console.error(`Error message: ${error.message}`);
            }
         } finally {
            setCommentLoading(false);
         }
      }
   };

   const postComment = async () => {
      let form = new FormData();
      form.append('content', newcomment);
      try {
         const accessToken = await AsyncStorage.getItem('access-token');
         let res = await authAPI(accessToken).post(endPoints['activity-comments'](activityID), form, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         if (res.status === statusCode.HTTP_201_CREATED) {
            setNewComment('');
            setCheckComment(true);
         }
      } catch (err) {
         console.error(err.response.data);
      }
   };

   const deleteComment = async (commentID) => {
      try {
         const accessToken = await AsyncStorage.getItem('access-token');
         let res = await authAPI(accessToken).delete(endPoints['comment-detail'](commentID), {
            headers: {
               'Content-Type': 'application/json',
            },
         });
         if (res.status === statusCode.HTTP_204_NO_CONTENT) {
            setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentID));
            setIsFormEditVisible(false);
         }
      } catch (err) {
         console.error(err.response.data);
      }
   };

   const handleDeleteComment = (commentID) => {
      Alert.alert(
         'Xóa bình luận',
         'Bạn chắc chắn muốn xóa bình luận này không?',
         [
            {
               text: 'Có',
               onPress: () => {
                  deleteComment(commentID);
               },
            },
            { text: 'Không', style: 'cancel' },
         ],
         { cancelable: true },
      );
   };

   const editComment = async (commentID, updatedContent) => {
      try {
         const accessToken = await AsyncStorage.getItem('access-token');
         let res = await authAPI(accessToken).put(
            endPoints['comment-detail'](commentID),
            { content: updatedContent },
            {
               headers: {
                  'Content-Type': 'application/json',
               },
            },
         );
         if (res.status === Status.HTTP_200_OK) {
            setComments((currentComments) =>
               currentComments.map((comment) =>
                  comment.id === commentID ? { ...comment, content: updatedContent } : comment,
               ),
            );
         }
      } catch (err) {
         console.error(err.response.data);
      }
   };

   useEffect(() => {
      loadActivityDetail();
      loadComments();
   }, []);

   useEffect(() => {
      if (newcomment === '') {
         richText?.current?.setContentHTML(newcomment);
         setCheckComment(false);
      }
      loadComments();
   }, [page, checkcomment]);

   const loadMore = ({ nativeEvent }) => {
      if (!commentLoading && page > 0 && isCloseToBottom(nativeEvent)) {
         setPage((prevPage) => prevPage + 1);
      }
   };

   const onRefresh = useCallback(async () => {
      setPage(1);
      setRefreshing(true);
      await loadComments(true);
      setRefreshing(false);
   }, [activityID]);

   if (activityDetailLoading) return <Loading />;

   return (
      <GestureHandlerRootView>
         <View style={GlobalStyle.BackGround}>
            <ScrollView
               key={activityDetail?.id}
               onScroll={loadMore}
               showsVerticalScrollIndicator={false}
               showsHorizontalScrollIndicator={false}
               style={{ ...ActivityStyle.Container, marginTop: 0 }}
               refreshControl={
                  <RefreshControl colors={[Theme.PrimaryColor]} refreshing={refreshing} onRefresh={onRefresh} />
               }
            >
               <DismissKeyboard>
                  <View style={ActivityStyle.DetailContainer}>
                     <View style={ActivityStyle.DetailImage}>
                        <Image source={{ uri: activityDetail.image }} style={ActivityStyle.ImageDetail} />
                     </View>

                     <RenderHTML
                        contentWidth={screenWidth}
                        source={{ html: activityDetail.description }}
                        baseStyle={ActivityStyle.DetailDescription}
                        defaultTextProps={{
                           numberOfLines: isExpanded ? 0 : 4,
                           ellipsizeMode: 'tail',
                        }}
                     />
                     <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={ActivityStyle.MoreButton}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                     </TouchableOpacity>

                     <Text style={ActivityStyle.AcitivityDetailText}>
                        Đối tượng tham gia: {activityDetail.participant}
                     </Text>
                     <Text style={ActivityStyle.AcitivityDetailText}>
                        Điểm cộng: {activityDetail.point}, {activityDetail.criterion}
                     </Text>
                     <Text style={ActivityStyle.AcitivityDetailText}>{activityDetail.semester}</Text>
                     <Text style={ActivityStyle.AcitivityDetailText}>Khoa: {activityDetail.faculty}</Text>
                     <Text style={ActivityStyle.AcitivityDetailText}>
                        Ngày bắt đầu: <Text>{formatDate(activityDetail.start_date)}</Text>
                     </Text>
                     <Text style={ActivityStyle.AcitivityDetailText}>
                        Ngày kết thúc: <Text>{formatDate(activityDetail.end_date)}</Text>
                     </Text>
                     <Text style={ActivityStyle.AcitivityDetailText}>Địa điểm: {activityDetail.location}</Text>
                     <View style={ActivityStyle.Time}>
                        <Text style={ActivityStyle.DetailDate}>
                           Ngày tạo: <Text>{formatDate(activityDetail.created_date)}</Text>
                        </Text>
                        <Text style={ActivityStyle.DetailDate}>
                           Ngày cập nhập: <Text>{formatDate(activityDetail.updated_date)}</Text>
                        </Text>
                     </View>

                     <View style={ActivityStyle.ReactContainer}>
                        <View style={ActivityStyle.Like}>
                           <TouchableOpacity>
                              <AntDesign name="like2" size={30} color="black" />
                           </TouchableOpacity>
                           <Text style={ActivityStyle.LikeDetail}>2000</Text>
                        </View>
                     </View>
                  </View>

                  <View style={CommentStyle.CommentContainer}>
                     <Text style={CommentStyle.CommentTitle}>Bình luận</Text>
                     <View style={ActivityStyle.RichEditorContainer}>
                        <RichEditor
                           ref={richText}
                           initialContentHTML={newcomment}
                           onChange={(text) => setNewComment(text)}
                           style={ActivityStyle.RichText}
                           placeholder="Nhập bình luận của bạn"
                        />

                        <TouchableOpacity style={ActivityStyle.SendIcon} onPress={postComment}>
                           <FontAwesome name="send" size={24} color={Theme.PrimaryColor} />
                        </TouchableOpacity>
                     </View>
                     <View style={GlobalStyle.BackGround}>
                        {comments.map((comment) => (
                           <View key={comment.id} style={ActivityStyle.Card}>
                              {comment.account.id === accountData?.id && (
                                 <View style={CommentStyle.CommentEditContainer}>
                                    <TouchableOpacity onPress={() => handleToggleCommentForm(comment.id)}>
                                       <Text style={CommentStyle.CommentEdit}>...</Text>
                                    </TouchableOpacity>
                                    {selectedCommentID === comment.id && (
                                       <View style={CommentStyle.FormEdit}>
                                          <TouchableOpacity
                                             onPress={() => {
                                                setCommentContentId(comment.id);
                                                setCommentContent(comment.content);
                                                bottomSheetRef.current?.expand();
                                             }}
                                          >
                                             <Text style={CommentStyle.FormEditText}>Chỉnh sửa</Text>
                                          </TouchableOpacity>
                                          <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                                             <Text style={CommentStyle.FormEditText}>Xóa</Text>
                                          </TouchableOpacity>
                                       </View>
                                    )}
                                 </View>
                              )}
                              <View style={CommentStyle.CommentTop}>
                                 <View style={CommentStyle.CommentCardImage}>
                                    <Image source={{ uri: comment.account.avatar }} style={CommentStyle.CommentImage} />
                                 </View>
                                 <View style={CommentStyle.CommentInfo}>
                                    <Text style={CommentStyle.CommentName}>{comment.account.user.full_name}</Text>
                                    <Text style={CommentStyle.CommentTime}>
                                       {moment(comment.created_date).fromNow()}
                                    </Text>
                                 </View>
                              </View>
                              <View>
                                 <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: comment.content }}
                                    baseStyle={ActivityStyle.Content}
                                    defaultTextProps={{
                                       numberOfLines: 3,
                                       ellipsizeMode: 'tail',
                                    }}
                                 />
                              </View>
                           </View>
                        ))}
                        {commentLoading && <Loading />}
                     </View>
                  </View>
               </DismissKeyboard>
            </ScrollView>
         </View>

         <BottomSheet enablePanDownToClose index={-1} ref={bottomSheetRef} snapPoints={['25%', '50%']}>
            <BottomSheetView
               style={{
                  flex: 1,
                  alignItems: 'center',
               }}
            >
               <View style={{ width: '100%', borderWidth: 1 }}>
                  <View>
                     <RichEditor
                        ref={richText1}
                        initialContentHTML={commentcontent}
                        onChange={(text) => setNewComment(text)}
                        style={ActivityStyle.RichText}
                     />
                  </View>

                  <View style={CommentStyle.ButtonEditContainer}>
                     <TouchableOpacity style={CommentStyle.ButtonEdit}>
                        <Text style={CommentStyle.ButtonText}>Hủy</Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        style={CommentStyle.ButtonEdit}
                        onPress={() => editComment(commentcontentId, commentcontent)}
                     >
                        <Text style={CommentStyle.ButtonText}>Cập nhập</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </BottomSheetView>
         </BottomSheet>
      </GestureHandlerRootView>
   );
};

export default ActivityDetail;
