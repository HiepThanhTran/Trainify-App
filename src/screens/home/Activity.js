import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { screenWidth } from 'react-native-gifted-charts/src/utils';
import { RichEditor } from 'react-native-pell-rich-editor';
import RenderHTML from 'react-native-render-html';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Loading from '../../components/common/Loading';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccount } from '../../store/contexts/AccountContext';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import GlobalStyle, { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { tabsActivity } from '../../utils/Fields';
import { formatDate, getTokens } from '../../utils/Utilities';

const Overview = ({ activity, ...props }) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const [isRendered, setIsRendered] = useState(false);

   useEffect(() => {
      setIsRendered(true);
   }, []);

   if (!isRendered) return <Loading size="small" />;

   return (
      <View style={{ ...ActivityStyle.ActivityInfo, ...props?.style }}>
         <View style={ActivityStyle.Summary}>
            <View style={ActivityStyle.SummaryItem}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="timer" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Ngày bắt đầu</Text>
                  <Text style={ActivityStyle.SummaryValue}>{formatDate(activity.start_date)}</Text>
               </View>
            </View>
            <View style={ActivityStyle.SummaryItem}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="timer" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Ngày kết thúc</Text>
                  <Text style={ActivityStyle.SummaryValue}>{formatDate(activity.end_date)}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityStyle.Summary}>
            <View style={ActivityStyle.SummaryItem}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="reader" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>ĐRL điều</Text>
                  <Text style={ActivityStyle.SummaryValue}>{activity.criterion}</Text>
               </View>
            </View>
            <View style={ActivityStyle.SummaryItem}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="bookmark" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Điểm cộng</Text>
                  <Text style={ActivityStyle.SummaryValue}>{activity.point}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityStyle.Summary}>
            <View style={ActivityStyle.SummaryItem}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="people" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Đối tượng</Text>
                  <Text style={ActivityStyle.SummaryValue}>{activity.participant}</Text>
               </View>
            </View>
            <View style={ActivityStyle.SummaryItem}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="contrast" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Hình thức</Text>
                  <Text style={ActivityStyle.SummaryValue}>{activity.organizational_form}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityStyle.Summary}>
            <View style={{ ...ActivityStyle.SummaryItem, width: '100%' }}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="location" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Địa điểm</Text>
                  <Text style={ActivityStyle.SummaryValue}>{activity.location}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityStyle.Summary}>
            <View style={{ ...ActivityStyle.SummaryItem, width: '100%' }}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="school" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Khoa</Text>
                  <Text style={ActivityStyle.SummaryValue}>{activity.faculty}</Text>
               </View>
            </View>
         </View>

         <View style={ActivityStyle.Summary}>
            <View style={{ ...ActivityStyle.SummaryItem, width: '100%' }}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="hourglass-outline" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Học kỳ</Text>
                  <Text style={ActivityStyle.SummaryValue}>{activity.semester}</Text>
               </View>
            </View>
         </View>

         <View style={{ marginTop: 12 }}>
            <Text style={{ fontFamily: Theme.Bold, fontSize: 20 }}>Mô tả hoạt động</Text>
            <RenderHTML
               contentWidth={screenWidth}
               source={{ html: activity.description }}
               baseStyle={ActivityStyle.Description}
               defaultTextProps={{
                  numberOfLines: isExpanded ? 0 : 3,
                  ellipsizeMode: 'tail',
               }}
            />
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
               <Text style={ActivityStyle.MoreButton}>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</Text>
            </TouchableOpacity>
         </View>

         <View style={{ ...ActivityStyle.Summary }}>
            <View style={ActivityStyle.SummaryItem}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="time" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Ngày tạo</Text>
                  <Text style={ActivityStyle.SummaryValue}>{formatDate(activity.created_date)}</Text>
               </View>
            </View>
            <View style={ActivityStyle.SummaryItem}>
               <View style={ActivityStyle.SummaryIcon}>
                  <Ionicons name="time" size={32} />
               </View>
               <View>
                  <Text style={ActivityStyle.SummaryText}>Ngày cập nhật</Text>
                  <Text style={ActivityStyle.SummaryValue}>{formatDate(activity.updated_date)}</Text>
               </View>
            </View>
         </View>
      </View>
   );
};

const CommentsView = ({ comments, ...props }) => {
   const [comment, setComment] = useState('');
   const c = comments[0];

   return (
      <View style={{ ...props?.style }}>
         <View style={CommentsStyle.CommentInput}>
            <RichEditor
               ref={props?.richText}
               initialContentHTML={comment}
               onChange={(value) => setComment(value)}
               style={CommentsStyle.RichText}
               placeholder="Nhập bình luận của bạn..."
               initialHeight={40}
            />
            <TouchableOpacity style={CommentsStyle.SendIcon} onPress={() => {}}>
               <FontAwesome name="send" size={24} color={Theme.PrimaryColor} />
            </TouchableOpacity>
         </View>

         <View style={CommentsStyle.CardContainer}></View>
      </View>
   );
};

const Activity = ({ navigation, route }) => {
   const { refreshing, setRefreshing } = useGlobalContext();
   const currentAccount = useAccount();
   // const activityID = route?.params?.activityID;

   const richText = useRef();
   const [activity, setActivity] = useState({});
   const [comments, setComments] = useState([]);
   const [page, setPage] = useState(1);
   const [choice, setChoice] = useState(1);
   const [commentLoading, setCommentLoading] = useState(false);
   const [activityLoading, setActivityLoading] = useState(false);
   const [overviewDisplay, setOverviewDisplay] = useState('auto');
   const [commentsDisplay, setCommentsDisplay] = useState('none');
   const animatedHeight = useState(new Animated.Value(screenHeight / 3))[0];

   useEffect(() => {
      loadActivity();
      loadComments();
   }, []);

   const loadActivity = async () => {
      setActivityLoading(true);
      try {
         const { accessToken } = await getTokens();
         let res = await authAPI(accessToken).get(endPoints['activity-detail'](1));
         if (res.status === statusCode.HTTP_200_OK) setActivity(res.data);
      } catch (error) {
         console.error(error);
      } finally {
         setActivityLoading(false);
      }
   };

   const loadComments = async () => {
      if (page <= 0) return;

      setCommentLoading(true);
      try {
         let res = await APIs.get(endPoints['activity-comments'](1), { params: { page } });
         if (res.data.next === null) setPage(0);
         if (res.status === statusCode.HTTP_200_OK)
            setComments(page === 1 ? res.data.results : [...comments, ...res.data.results]);
      } catch (error) {
         console.error(error);
      } finally {
         setCommentLoading(false);
      }
   };

   const animateHeight = (toValue) => {
      Animated.timing(animatedHeight, {
         toValue: toValue,
         duration: 300,
         useNativeDriver: false,
         easing: Easing.out(Easing.quad),
      }).start();
   };

   const checkTab = (name) => {
      return tabsActivity[choice - 1].name.includes(name);
   };

   if (activityLoading) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround}>
         <ScrollView showsVerticalScrollIndicator={false}>
            <DismissKeyboard onPress={() => richText.current?.dismissKeyboard()}>
               <Animated.View style={{ ...ActivityStyle.Image, height: animatedHeight }}>
                  <ImageBackground source={{ uri: activity.image }} style={{ flex: 1 }} />
               </Animated.View>
               <View style={{ ...ActivityStyle.Body, ...(!checkTab('overview') ? { paddingBottom: 0 } : {}) }}>
                  <View style={ActivityStyle.Header}>
                     <Text style={ActivityStyle.HeaderText}>{activity.name}</Text>
                     <View style={ActivityStyle.Like}>
                        <Text style={ActivityStyle.LikeDetail}>{activity.total_likes}</Text>
                        <TouchableOpacity>
                           <AntDesign
                              size={28}
                              name={activity.liked ? 'like1' : 'like2'}
                              color={activity.liked ? Theme.PrimaryColor : 'black'}
                           />
                        </TouchableOpacity>
                     </View>
                  </View>

                  <View style={ActivityStyle.TabContainer}>
                     {tabsActivity.map((f) => (
                        <TouchableOpacity
                           key={f.id}
                           style={ActivityStyle.TabItem}
                           disabled={f.id === choice ? true : false}
                           onPress={() => {
                              setChoice(f.id);
                              if (f.name.includes('comments')) {
                                 setCommentsDisplay('auto');
                                 setOverviewDisplay('none');
                                 animateHeight(screenHeight / 6);
                              }
                              if (f.name.includes('overview')) {
                                 setOverviewDisplay('auto');
                                 setCommentsDisplay('none');
                                 animateHeight(screenHeight / 3);
                                 richText.current?.dismissKeyboard();
                              }
                           }}
                        >
                           <Text
                              style={{
                                 ...ActivityStyle.TabText,
                                 ...(f.id === choice ? { color: Theme.PrimaryColor } : {}),
                              }}
                           >
                              {f.label}
                           </Text>
                        </TouchableOpacity>
                     ))}
                  </View>

                  <Overview style={{ display: overviewDisplay }} activity={activity} />
                  <CommentsView style={{ display: commentsDisplay }} comments={comments} richText={richText} />
               </View>
            </DismissKeyboard>

            {checkTab('overview') && (
               <View style={ActivityStyle.Register}>
                  <TouchableOpacity style={ActivityStyle.RegisterButton} onPress={() => {}}>
                     <Text style={ActivityStyle.RegisterButtonText}>Đăng ký</Text>
                     <Ionicons name="arrow-forward" size={32} color="white" />
                  </TouchableOpacity>
               </View>
            )}
         </ScrollView>
      </View>
   );
};

const ActivityStyle = StyleSheet.create({
   Image: {
      width: '100%',
      height: screenHeight / 3,
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
   Summary: {
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
      marginBottom: 20,
      fontFamily: Theme.Regular,
   },
   MoreButton: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      marginTop: -15,
      marginBottom: 10,
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
      padding: 10 * 1.5,
      marginHorizontal: 10 * 1.6,
      borderRadius: 10 * 2,
      flexDirection: 'row',
      justifyContent: 'center',
   },
   RegisterButtonText: {
      color: 'white',
      fontSize: 10 * 2,
      fontWeight: 'bold',
      marginRight: 10 * 7,
      marginLeft: 10 * 7,
   },
});

const CommentsStyle = StyleSheet.create({
   CommentInput: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   RichText: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 16,
      paddingRight: 12,
      overflow: 'hidden',
      borderColor: Theme.PrimaryColor,
   },
   SendIcon: {
      marginLeft: 10,
      padding: 5,
   },
});

export default Activity;
