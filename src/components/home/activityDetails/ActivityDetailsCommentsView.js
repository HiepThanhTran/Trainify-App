import moment from 'moment';
import { memo, useEffect, useState } from 'react';
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
import CommentInput from './CommentInput';
import EditCommentInput from './EditCommentInput';
import OptionsModal from './OptionsModal';

const ActivityDetailsCommentsView = memo(({ activityID, ...props }) => {
   const currentAccount = useAccount();

   const [expandedComments, setExpandedComments] = useState({});
   const [selectedComment, setSelectedComment] = useState({});
   const [comments, setComments] = useState([]);
   const [page, setPage] = useState(1);
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

         if (res.data.next === null) setPage(0);
         if (res.status === statusCode.HTTP_200_OK) {
            if (page === 1) setComments(res.data.results);
            else setComments((prevComments) => [...prevComments, ...res.data.results]);
         }
      } catch (error) {
         console.error('Comments of activity', error);
      } finally {
         setCommentsLoading(false);
         setRefreshing(false);
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
               {!refreshing && commentsLoading && page === 1 && <Loading style={{ marginBottom: 32 }} />}
               {comments.map((item, index) => {
                  const isExpanded = expandedComments[item.id];
                  const contentLength = item?.content?.length || 0;
                  const shouldShowMoreButton = contentLength > 74;

                  return (
                     <View
                        key={item.id}
                        style={{
                           ...ActivityDetailsCommentsViewStyle.Card,
                           borderBottomWidth: index !== comments.length - 1 ? 0.5 : 0,
                        }}
                     >
                        <View style={{ flexDirection: 'row' }}>
                           <View style={{ overflow: 'hidden' }}>
                              <Image
                                 source={{ uri: item?.account.avatar }}
                                 style={ActivityDetailsCommentsViewStyle.Avatar}
                              />
                           </View>
                           <View style={ActivityDetailsCommentsViewStyle.CardContent}>
                              {item?.account.id === currentAccount.data.id && (
                                 <TouchableOpacity
                                    style={ActivityDetailsCommentsViewStyle.OptionsButton}
                                    onPress={() => handleOnPressSettings(item)}
                                 >
                                    <Icon source="dots-vertical" size={28} />
                                 </TouchableOpacity>
                              )}

                              <Text style={ActivityDetailsCommentsViewStyle.Username}>{item?.account.full_name}</Text>
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
                        <Text style={ActivityDetailsCommentsViewStyle.CreatedDate}>
                           {moment(item?.created_date).fromNow()}
                        </Text>
                     </View>
                  );
               })}
               {commentsLoading && page > 1 && <Loading style={{ marginBottom: 32 }} />}
            </View>
         </View>

         <CommentInput
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
});

export const ActivityDetailsCommentsViewStyle = StyleSheet.create({
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

export default ActivityDetailsCommentsView;
