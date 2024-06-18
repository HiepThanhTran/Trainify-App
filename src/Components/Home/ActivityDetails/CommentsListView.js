import moment from 'moment';
import { useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import APIs, { endPoints } from '../../../Configs/APIs';
import { statusCode } from '../../../Configs/Constants';
import HomeStyle from '../../../Screens/Home/Style';
import { useAccount } from '../../../Store/Contexts/AccountContext';
import { screenWidth } from '../../../Styles/Style';
import Theme from '../../../Styles/Theme';
import { loadMore, onRefresh } from '../../../Utils/Utilities';
import Loading from '../../Common/Loading';
import AddCommentInput from './AddCommentInput';
import EditCommentInput from './EditCommentInput';
import OptionsModal from './OptionsModal';

const CommentsListView = ({ activityID, ...props }) => {
   const currentAccount = useAccount();

   const [shouldShowMoreButtons, setShouldShowMoreButtons] = useState({});
   const [expandedComments, setExpandedComments] = useState({});
   const [selectedComment, setSelectedComment] = useState({});
   const [comments, setComments] = useState([]);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [isRendered, setIsRendered] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [modalSettingsVisible, setModalSettingsVisible] = useState(false);
   const [modalEditCommentVisible, setModalEditCommentVisible] = useState(false);

   useEffect(() => {
      const loadComments = async () => {
         if (!activityID || page < 1) return;

         setLoading(true);
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
            console.error('Comments of activity:', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         } finally {
            setLoading(false);
            setRefreshing(false);
            setIsRendered(true);
         }
      };

      loadComments();
   }, [page]);

   const handleOnPressSettings = (comment) => {
      setSelectedComment(comment);
      setModalSettingsVisible(true);
   };

   const onTextLayout = (nativeEvent, commentID) => {
      setExpandedComments((prevState) => {
         if (prevState[commentID] !== undefined) {
            return prevState;
         }
         return {
            ...prevState,
            [commentID]: nativeEvent.lines.length <= 2,
         };
      });
      setShouldShowMoreButtons((prevState) => ({
         ...prevState,
         [commentID]: nativeEvent.lines.length > 2,
      }));
   };

   const toggleExpandComment = (commentID) => {
      setExpandedComments((prevState) => ({
         ...prevState,
         [commentID]: !prevState[commentID],
      }));
   };

   if (!isRendered) return <Loading />;

   return (
      <ScrollView
         showsHorizontalScrollIndicator={false}
         showsVerticalScrollIndicator={false}
         onScroll={({ nativeEvent }) => loadMore(nativeEvent, loading, page, setPage)}
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
               {comments.map((item, index) => (
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
                                 numberOfLines: expandedComments[item.id] ? undefined : 2,
                                 ellipsizeMode: 'tail',
                                 onTextLayout: ({ nativeEvent }) => onTextLayout(nativeEvent, item.id),
                              }}
                           />
                           {shouldShowMoreButtons[item.id] && (
                              <TouchableOpacity onPress={() => toggleExpandComment(item.id)}>
                                 <Text style={HomeStyle.MoreButton}>
                                    {expandedComments[item.id] ? 'Thu gọn' : 'Xem thêm'}
                                 </Text>
                              </TouchableOpacity>
                           )}
                        </View>
                     </View>
                     <Text style={CommentListViewStyle.CreatedDate}>{moment(item?.created_date).fromNow()}</Text>
                  </View>
               ))}
               {loading && page > 1 && <Loading style={{ marginBottom: 32 }} />}
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
