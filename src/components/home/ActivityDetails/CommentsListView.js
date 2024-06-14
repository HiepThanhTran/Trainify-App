import moment from 'moment';
import { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import APIs, { endPoints } from '../../../configs/APIs';
import { statusCode } from '../../../configs/Constants';
import HomeStyle from '../../../screens/home/Style';
import { useAccount } from '../../../store/contexts/AccountContext';
import { screenWidth } from '../../../styles/Style';
import Theme from '../../../styles/Theme';
import { loadMore, onRefresh } from '../../../utils/Utilities';
import Loading from '../../common/Loading';
import AddCommentInput from './AddCommentInput';
import EditCommentInput from './EditCommentInput';
import OptionsModal from './OptionsModal';

const CommentsListView = ({ activityID, ...props }) => {
   const currentAccount = useAccount();

   const [expandedComments, setExpandedComments] = useState({});
   const [selectedComment, setSelectedComment] = useState({});
   const [comments, setComments] = useState([]);
   const [page, setPage] = useState(1);
   const [isRendered, setIsRendered] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [commentsLoading, setCommentsLoading] = useState(false);
   const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
   const [modalEditCommentVisible, setModalEditCommentVisible] = useState(false);

   useEffect(() => {
      loadComments();
   }, [page]);

   const loadComments = async () => {
      if (!activityID || page < 1) return;

      setCommentsLoading(true);
      try {
         let res = await APIs.get(endPoints['activity-comments'](activityID), { params: { page } });

         if (res.status === statusCode.HTTP_200_OK) {
            if (page === 1) {
               setComments(res.data.results);
            } else {
               setComments((prevComments) => [...prevComments, ...res.data.results]);
            }
         }
         if (res.data.next === null) {
            setPage(0);
         }
      } catch (error) {
         console.error('Comments of activity', error);
      } finally {
         setCommentsLoading(false);
         setRefreshing(false);
         setIsRendered(true);
      }
   };

   const handleOnPressSettings = (comment) => {
      setSelectedComment(comment);
      setModalSettingsVisible(true);
   };

   const toggleExpandComment = (commentId) => {
      setExpandedComments((prevState) => ({
         ...prevState,
         [commentId]: !prevState[commentId],
      }));
   };

   if (!isRendered) return <Loading />;

   return (
      <ScrollView
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         onScroll={({ nativeEvent }) => loadMore(nativeEvent, commentsLoading, page, setPage)}
         refreshControl={
            <RefreshControl
               colors={[Theme.PrimaryColor]}
               refreshing={refreshing}
               onRefresh={() => {
                  if (page > 1) onRefresh({ setPage, setRefreshing, setData: setComments });
               }}
            />
         }
      >
         <View style={{ ...props?.style }}>
            <View style={{ marginBottom: 8 }}>
               {comments.map((item, index) => {
                  const isExpanded = expandedComments[item.id];
                  const contentLength = item?.content?.length || 0;
                  const shouldShowMoreButton = contentLength > 71;

                  return (
                     <View
                        key={item.id}
                        style={{
                           ...CommentListViewStyle.Card,
                           borderBottomWidth: index !== comments.length - 1 ? 0.5 : 0,
                        }}
                     >
                        <View style={{ flexDirection: 'row' }}>
                           <View style={{ overflow: 'hidden' }}>
                              <Image source={{ uri: item?.account.avatar }} style={CommentListViewStyle.Avatar} />
                           </View>
                           <View style={CommentListViewStyle.CardContent}>
                              {item?.account.id === currentAccount.data.id && (
                                 <TouchableOpacity
                                    style={CommentListViewStyle.OptionsButton}
                                    onPress={() => handleOnPressSettings(item)}
                                 >
                                    <Icon source="dots-vertical" size={28} />
                                 </TouchableOpacity>
                              )}

                              <Text style={CommentListViewStyle.Username}>{item?.account.full_name}</Text>
                              <RenderHTML
                                 contentWidth={screenWidth}
                                 source={{ html: item?.content }}
                                 baseStyle={HomeStyle.DetailsDescription}
                                 defaultTextProps={{
                                    numberOfLines: isExpanded ? 0 : 2,
                                    ellipsizeMode: 'tail',
                                 }}
                              />
                              {shouldShowMoreButton && (
                                 <TouchableOpacity onPress={() => toggleExpandComment(item.id)}>
                                    <Text style={HomeStyle.MoreButton}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                                 </TouchableOpacity>
                              )}
                           </View>
                        </View>
                        <Text style={CommentListViewStyle.CreatedDate}>{moment(item?.created_date).fromNow()}</Text>
                     </View>
                  );
               })}
               {commentsLoading && page > 1 && <Loading style={{ marginBottom: 32 }} />}
            </View>
         </View>

         <AddCommentInput
            activityID={activityID}
            setComments={setComments}
            refEditorComment={props?.refEditorComment}
            setModalVisible={props?.setModalVisible}
         />

         <EditCommentInput
            modalEditCommentVisible={modalEditCommentVisible}
            selectedComment={selectedComment}
            comments={comments}
            setComments={setComments}
            setModalVisible={props?.setModalVisible}
            setModalSettingsVisible={setModalSettingsVisible}
            setModalEditCommentVisible={setModalEditCommentVisible}
         />

         <OptionsModal
            modalSettingsVisible={modalSettingsVisible}
            selectedComment={selectedComment}
            comments={comments}
            setComments={setComments}
            setModalVisible={props?.setModalVisible}
            setModalSettingsVisible={setModalSettingsVisible}
            setModalEditCommentVisible={setModalEditCommentVisible}
         />
      </ScrollView>
   );
};

export const CommentListViewStyle = StyleSheet.create({
   Card: {
      paddingBottom: 4,
      marginBottom: 20,
      borderBottomColor: 'grey',
   },
   CardContent: {
      width: '80%',
      marginLeft: 12,
      padding: 8,
      borderRadius: 16,
      backgroundColor: '#d5deef',
   },
   OptionsButton: {
      position: 'absolute',
      top: 8,
      right: 4,
      zIndex: 2,
      alignItems: 'center',
      justifyContent: 'center',
   },
   Avatar: {
      width: 48,
      height: 48,
      borderRadius: 30,
      backgroundColor: Theme.SecondaryColor,
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
});

export default CommentsListView;
