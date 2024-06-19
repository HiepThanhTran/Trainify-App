import { AntDesign, Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
   Alert,
   ImageBackground,
   RefreshControl,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import Loading from '../../Components/Common/Loading';
import { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import GlobalStyle, { screenWidth } from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { getTokens, loadMore, onRefresh, refreshAccessToken } from '../../Utils/Utilities';

const MissingReportsOfStudent = ({ navigation }) => {
   const [wasNavigatedFromGoBack, setWasNavigatedFromGoBack] = useState(false);
   const [reports, setReports] = useState([]);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [isRendered, setIsRendered] = useState(false);

   useEffect(() => {
      const loadReports = async () => {
         if (page <= 0) return;

         setLoading(true);
         const { accessToken, refreshToken } = await getTokens();
         try {
            const res = await authAPI(accessToken).get(endPoints['reports'], { params: { page } });
            if (res.status === statusCode.HTTP_200_OK) {
               if (page === 1) {
                  setReports(res.data.results);
               } else {
                  setReports((prevReports) => [...prevReports, ...res.data.results]);
               }
            }
            if (res.data.next === null) {
               setPage(0);
            }
         } catch (error) {
            console.error('Missing reports of student:', error);
            if (error.response) {
               if (
                  error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN
               ) {
                  const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
                  if (newAccessToken) {
                     loadReports();
                  }
               }
            } else {
               Alert.alert('Thông báo', 'Có lỗi xảy ra khi thực hiện thao tác.');
            }
         } finally {
            setIsRendered(true);
            setLoading(false);
            setRefreshing(false);
         }
      };

      loadReports();
   }, [page, refreshing]);

   useEffect(() => {
      const unsubscribeFocus = navigation.addListener('focus', () => {});

      const unsubscribeBlur = navigation.addListener('blur', () => {
         setWasNavigatedFromGoBack(true);
      });

      return () => {
         unsubscribeFocus();
         unsubscribeBlur();
      };
   }, [navigation]);

   useFocusEffect(
      useCallback(() => {
         if (wasNavigatedFromGoBack) {
            onRefresh({ setPage, setRefreshing, setData: setReports });
            setWasNavigatedFromGoBack(false);
         }
      }, [wasNavigatedFromGoBack]),
   );

   const renderRefreshControl = () => {
      return (
         <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={() => onRefresh({ setPage, setRefreshing, setData: setReports })}
         />
      );
   };

   const gotoMissingReportsOfStudentDetail = (reportID) =>
      navigation.navigate('MissingReportsOfStudentDetail', { reportID });

   if (!isRendered) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround}>
         <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={MissingReportsOfStudentStyle.Container}
            onScroll={({ nativeEvent }) => loadMore(nativeEvent, loading, page, setPage)}
            refreshControl={renderRefreshControl()}
         >
            {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
            {reports.map((report) => (
               <View key={report.id}>
                  {report.evidence ? (
                     <ImageBackground
                        source={{ uri: report.evidence }}
                        style={MissingReportsOfStudentStyle.imageBackground}
                     >
                        <TouchableOpacity>
                           {report.is_resolved ? (
                              <View style={MissingReportsOfStudentStyle.Resolved}>
                                 <Text style={MissingReportsOfStudentStyle.Solved}>Đã giải quyết</Text>
                                 <AntDesign name="checkcircle" size={24} color="#6ac239" />
                              </View>
                           ) : (
                              <View style={MissingReportsOfStudentStyle.Resolved}>
                                 <Text style={MissingReportsOfStudentStyle.NotResolved}>Chưa giải quyết</Text>
                                 <Entypo name="circle-with-cross" size={24} color="red" />
                              </View>
                           )}

                           <Text style={MissingReportsOfStudentStyle.TitleActivity}>{report.activity.name}</Text>

                           {report.content ? (
                              <RenderHTML
                                 contentWidth={screenWidth}
                                 source={{ html: report.content }}
                                 baseStyle={MissingReportsOfStudentStyle.ContentText}
                                 defaultTextProps={{
                                    numberOfLines: 3,
                                    ellipsizeMode: 'tail',
                                 }}
                              />
                           ) : (
                              <Text style={MissingReportsOfStudentStyle.ContentText}>Không có nội dung minh chứng</Text>
                           )}

                           <Text style={MissingReportsOfStudentStyle.Text}>
                              Ngày gửi: {moment(report.created_date).format('DD/MM/YYYY')}
                           </Text>

                           {report.is_resolved && (
                              <Text style={MissingReportsOfStudentStyle.Text}>
                                 Ngày giải quyết: {moment(report.updated_date).format('DD/MM/YYYY')}
                              </Text>
                           )}

                           <Text style={MissingReportsOfStudentStyle.Text}>Người gửi: {report.student.full_name}</Text>
                        </TouchableOpacity>
                     </ImageBackground>
                  ) : (
                     <LinearGradient
                        colors={Theme.LinearColors4}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1.5 }}
                        style={MissingReportsOfStudentStyle.linearGradient}
                     >
                        <TouchableOpacity onPress={() => gotoMissingReportsOfStudentDetail(report.id)}>
                           {report.is_resolved ? (
                              <View style={MissingReportsOfStudentStyle.Resolved}>
                                 <Text style={MissingReportsOfStudentStyle.Solved}>Đã giải quyết</Text>
                                 <AntDesign name="checkcircle" size={24} color="#6ac239" />
                              </View>
                           ) : (
                              <View style={MissingReportsOfStudentStyle.Resolved}>
                                 <Text style={MissingReportsOfStudentStyle.NotResolved}>Chưa giải quyết</Text>
                                 <Entypo name="circle-with-cross" size={24} color="red" />
                              </View>
                           )}

                           <Text style={MissingReportsOfStudentStyle.TitleActivity}>{report.activity.name}</Text>

                           {report.content ? (
                              <RenderHTML
                                 contentWidth={screenWidth}
                                 source={{ html: report.content }}
                                 baseStyle={MissingReportsOfStudentStyle.ContentText}
                                 defaultTextProps={{
                                    numberOfLines: 3,
                                    ellipsizeMode: 'tail',
                                 }}
                              />
                           ) : (
                              <Text style={MissingReportsOfStudentStyle.ContentText}>Không có nội dung minh chứng</Text>
                           )}

                           <Text style={MissingReportsOfStudentStyle.Text}>
                              Ngày gửi: {moment(report.created_date).format('DD/MM/YYYY')}
                           </Text>

                           {report.is_resolved && (
                              <Text style={[MissingReportsOfStudentStyle.Text]}>
                                 Ngày giải quyết: {moment(report.updated_date).format('DD/MM/YYYY')}
                              </Text>
                           )}

                           <Text style={MissingReportsOfStudentStyle.Text}>Người gửi: {report.student.full_name}</Text>
                        </TouchableOpacity>
                     </LinearGradient>
                  )}
               </View>
            ))}
            {loading && page > 1 && <Loading style={{ marginBottom: 16 }} />}
         </ScrollView>
      </View>
   );
};

const MissingReportsOfStudentStyle = StyleSheet.create({
   Container: {
      marginTop: 20,
      marginLeft: 16,
      marginRight: 16,
   },
   imageBackground: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 16,
   },
   linearGradient: {
      width: '100%',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
   },
   Resolved: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
   },
   Solved: {
      fontFamily: Theme.Bold,
      color: '#6ac239',
      marginRight: 5,
   },
   NotResolved: {
      fontFamily: Theme.Bold,
      color: 'red',
      marginRight: 5,
   },
   TitleActivity: {
      fontFamily: Theme.Bold,
      fontSize: 18,
   },
   ContentText: {
      fontSize: 16,
      marginTop: 10,
      fontFamily: Theme.Regular,
      lineHeight: 25,
   },
   Text: {
      fontSize: 16,
      fontFamily: Theme.SemiBold,
      marginTop: 10,
   },
});

export default MissingReportsOfStudent;
