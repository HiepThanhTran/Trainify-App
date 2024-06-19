import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ActivityCardList from '../../Components/Common/ActivityCardList';
import ChipList from '../../Components/Common/ChipList';
import Loading from '../../Components/Common/Loading';
import BarChartOfPoints from '../../Components/Profile/TrainingPoints/BarChart';
import SemestersList from '../../Components/Profile/TrainingPoints/SemestersList';
import APIs, { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { useAccount } from '../../Store/Contexts/AccountContext';
import { useGlobalContext } from '../../Store/Contexts/GlobalContext';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { getTokens, loadMore, onRefresh } from '../../Utils/Utilities';

const TrainingPoints = ({ navigation }) => {
   const { currentSemester, setCurrentSemester } = useGlobalContext();
   const currentAccount = useAccount();

   const refSheetSemesters = useRef(BottomSheet);

   const [wasNavigatedFromGoBack, setWasNavigatedFromGoBack] = useState(false);
   const [criterions, setCriterions] = useState([]);
   const [semesters, setSemesters] = useState([]);
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [selectedCriterion, setSelectedCriterion] = useState({});
   const [isRendered, setIsRedered] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [activitiesLoading, setActivitiesLoading] = useState(false);

   useEffect(() => {
      const loadCriterions = async () => {
         try {
            let response = await APIs.get(endPoints['criterions']);

            if (response.status === statusCode.HTTP_200_OK) {
               setCriterions(response.data);
               setSelectedCriterion(response.data[0]);
            }
         } catch (error) {
            console.log('Criterions:', error);
         }
      };

      const loadSemestersOfStudent = async () => {
         try {
            let response = await APIs.get(endPoints['student-semesters'](currentAccount.data.user.id));

            if (response.status === statusCode.HTTP_200_OK) {
               setSemesters(response.data);
            }
         } catch (error) {
            console.log('Semesters:', error);
         }
      };

      const allCriterions = loadCriterions();
      const allSemesters = loadSemestersOfStudent();

      const allPromises = Promise.allSettled([allCriterions, allSemesters]);

      allPromises.finally(() => setIsRedered(true));
   }, []);

   useEffect(() => {
      const loadActivityOfCriterion = async () => {
         if (!currentSemester || page <= 0) return;

         setActivitiesLoading(true);
         const { accessToken, refreshToken } = await getTokens();
         try {
            let response = await authAPI(accessToken).get(endPoints['activities'], {
               params: { semester_id: currentSemester.id, criterion_id: selectedCriterion.id, page },
            });

            if (response.status === statusCode.HTTP_200_OK) {
               if (page === 1) {
                  setActivities(response.data.results);
               } else {
                  setActivities((prevActivities) => [...prevActivities, ...response.data.results]);
               }
            }
            if (response.data.next === null) {
               setPage(0);
            }
         } catch (error) {
            console.error('Activity of criterion:', error);
            if (error.response) {
               if (
                  error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN
               ) {
                  const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
                  if (newAccessToken) {
                     handleResetPassword();
                  }
               } else if (error.response && error.response.status === statusCode.HTTP_400_BAD_REQUEST) {
                  Alert.alert('Thông báo', error.response.data.detail);
               }
            } else if (error.message && error.message.includes('auth/invalid-credential')) {
               Alert.alert('Thông báo', 'Mật khẩu hiện tại không đúng');
            } else {
               Alert.alert('Thông báo', 'Có lỗi xảy ra khi thực hiện thao tác.');
            }
         } finally {
            setActivitiesLoading(false);
            setRefreshing(false);
         }
      };

      loadActivityOfCriterion();
   }, [currentSemester, selectedCriterion, page, refreshing]);

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
            onRefresh({ setPage, setRefreshing, setData: setActivities });
            setWasNavigatedFromGoBack(false);
         }
      }, [wasNavigatedFromGoBack]),
   );

   const handleChangeSemester = (semester) => {
      if (semester.id !== currentSemester?.id) {
         resetActivities();
         setCurrentSemester(semester);
         refSheetSemesters?.current?.close();
      }
   };

   const handleChangeCriterion = (criterion) => {
      if (criterion.id !== selectedCriterion.id) {
         resetActivities();
         setSelectedCriterion(criterion);
      }
   };

   const resetActivities = () => {
      setPage(1);
      setActivities([]);
   };

   const renderRefreshControl = () => {
      return (
         <RefreshControl
            colors={[Theme.PrimaryColor]}
            refreshing={refreshing}
            onRefresh={() => onRefresh({ setPage, setRefreshing, setData: setActivities })}
         />
      );
   };

   const goActivityDetails = (activityID) => {
      navigation.navigate('HomeStack', {
         screen: 'ActivityDetail',
         params: { activityID },
      });
   };

   const goToReport = (activityID) => navigation.navigate('ReportActivityForm', { activityID });

   if (!isRendered) return <Loading />;

   return (
      <GestureHandlerRootView>
         <View style={GlobalStyle.Header}>
            <View style={GlobalStyle.HeaderWrap}>
               <TouchableOpacity activeOpacity={0.8} style={GlobalStyle.BackButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" color="gray" size={30} />
               </TouchableOpacity>
               <View style={GlobalStyle.HeaderTitle}>
                  <Text style={{ fontFamily: Theme.Bold, fontSize: 20, color: '#fff' }}>
                     {currentSemester
                        ? `${currentSemester.original_name} - ${currentSemester.academic_year}`
                        : 'Điểm rèn luyện'}
                  </Text>
                  <TouchableOpacity
                     onPress={() => refSheetSemesters.current?.expand()}
                     style={{ ...GlobalStyle.Center, ...GlobalStyle.HeaderButton }}
                  >
                     <Text style={GlobalStyle.HeaderButtonText}>Học kỳ</Text>
                  </TouchableOpacity>
               </View>
            </View>
            <View style={TrainingPointStyle.ChipContainer}>
               <ChipList data={criterions} currentItem={selectedCriterion} onPress={handleChangeCriterion} />
            </View>
         </View>

         <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScroll={({ nativeEvent }) => loadMore(nativeEvent, activitiesLoading, page, setPage)}
            scrollEventThrottle={16}
            refreshControl={currentSemester ? renderRefreshControl() : null}
         >
            <TouchableOpacity activeOpacity={1} onPress={() => refSheetSemesters?.current?.close()}>
               <BarChartOfPoints
                  refSheetSemesters={refSheetSemesters}
                  currentSemester={currentSemester}
                  criterions={criterions}
                  refreshing={refreshing}
                  setRefreshing={setRefreshing}
               />

               <View style={TrainingPointStyle.CriterionContainer}>
                  <View style={TrainingPointStyle.CriterionHeader}>
                     <View style={TrainingPointStyle.CriterionMaxPoint}>
                        <Text style={TrainingPointStyle.CriterionMaxPointText}>
                           Điểm tối đa: {selectedCriterion.max_point}đ
                        </Text>
                     </View>
                     <View style={TrainingPointStyle.CriterionDescription}>
                        <Text style={TrainingPointStyle.CriterionDescriptionText}>{selectedCriterion.description}</Text>
                     </View>
                  </View>
                  <ActivityCardList
                     loading={activitiesLoading}
                     navigation={navigation}
                     refreshing={refreshing}
                     data={activities}
                     page={page}
                     report={true}
                     onReport={(activity) => goToReport(activity.id)}
                     onPress={(activity) => goActivityDetails(activity.id)}
                  />
               </View>
            </TouchableOpacity>
         </ScrollView>

         <SemestersList
            refSheetSemesters={refSheetSemesters}
            currentSemester={currentSemester}
            semesters={semesters}
            onPress={handleChangeSemester}
         />
      </GestureHandlerRootView>
   );
};

const TrainingPointStyle = StyleSheet.create({
   ChipContainer: {
      paddingBottom: 12,
      backgroundColor: Theme.PrimaryColor,
   },
   CriterionContainer: {
      paddingBottom: 12,
      paddingHorizontal: 12,
   },
   CriterionHeader: {
      padding: 8,
      marginBottom: 12,
      borderRadius: 12,
      flexDirection: 'row',
      backgroundColor: 'lightblue',
   },
   CriterionMaxPoint: {
      padding: 8,
      marginRight: 8,
      borderRadius: 8,
      alignSelf: 'flex-start',
      backgroundColor: '#f0a419',
   },
   CriterionMaxPointText: {
      fontSize: 14,
      color: '#fff',
      fontStyle: 'italic',
      fontFamily: Theme.Bold,
   },
   CriterionDescription: {
      flex: 1,
      justifyContent: 'center',
   },
   CriterionDescriptionText: {
      fontSize: 14,
      fontFamily: Theme.SemiBold,
   },
});

export default TrainingPoints;
