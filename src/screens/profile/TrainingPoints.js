import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Chip } from 'react-native-paper';
import CardActivity from '../../components/common/CardActivity';
import Loading from '../../components/common/Loading';
import BarChartOfPoints from '../../components/profile/TrainingPoints/BarChart';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { getTokens, loadMore, refreshAccessToken } from '../../utils/Utilities';

const TrainingPoints = ({ navigation }) => {
   const { currentSemester, setCurrentSemester } = useGlobalContext();
   const dispatch = useAccountDispatch();
   const currentAccount = useAccount();

   const refSheetSemesters = useRef(BottomSheet);

   const [trainingPoints, setTrainingPoints] = useState([]);
   const [criterions, setCriterions] = useState([]);
   const [semesters, setSemesters] = useState([]);
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [criterionID, setCriterionID] = useState('');
   const [isRendered, setIsRedered] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [activitiesLoading, setActivitiesLoading] = useState(false);
   const [trainingPointsLoading, setTrainingPointsLoading] = useState(false);

   useEffect(() => {
      const allSemesters = loadSemestersOfStudent();
      const allCriterions = loadCriterions();

      const allPromises = Promise.allSettled([allSemesters, allCriterions]);

      allPromises.finally(() => setIsRedered(true));
   }, []);

   useEffect(() => {
      loadActivityOfCriterion();
   }, [currentSemester, criterionID, page]);

   useEffect(() => {
      loadTrainingPoints();
      renderHeaderButton();
   }, [navigation, currentSemester]);

   const pointsDataChart = useMemo(() => {
      let data = [];

      if (currentSemester && trainingPoints.training_points.length > 0) {
         data = trainingPoints.training_points.map((item) => ({
            label: item.criterion,
            value: item.point,
            frontColor: Theme.PrimaryColor,
            topLabelComponent: () => (
               <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>{item.point}</Text>
            ),
         }));
      }

      return data;
   }, [trainingPoints]);

   const criterionDataChart = useMemo(() => {
      let data = [];

      if (criterions.length > 0) {
         data = criterions.map((item) => ({
            value: item.max_point,
            frontColor: '#f0a419',
            topLabelComponent: () => (
               <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>{item.max_point}</Text>
            ),
         }));
      }

      return data;
   }, [criterions]);

   const dataChart = useMemo(() => {
      let sourceData = [];

      if (pointsDataChart.length > 0) {
         sourceData = pointsDataChart;
      } else {
         sourceData = criterions.map((item) => ({
            label: item.name,
            value: 0,
            frontColor: Theme.PrimaryColor,
         }));
      }

      return sourceData.flatMap((val, i) => [val, criterionDataChart[i]]);
   }, [pointsDataChart, criterionDataChart]);

   const loadTrainingPoints = async () => {
      if (!currentSemester) return;

      setTrainingPointsLoading(true);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let response = await authAPI(accessToken).get(
            endPoints['student-points'](currentAccount.data.user.id, currentSemester.code),
         );

         if (response.status === statusCode.HTTP_200_OK) {
            setTrainingPoints(response.data);
         }
      } catch (error) {
         if (
            error.response &&
            (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
               error.response.status === statusCode.HTTP_403_FORBIDDEN)
         ) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) {
               loadTrainingPoints();
            }
         } else {
            console.error('Points', error);
         }
      } finally {
         setTrainingPointsLoading(false);
      }
   };

   const loadCriterions = async () => {
      try {
         let response = await APIs.get(endPoints['criterions']);

         if (response.status === statusCode.HTTP_200_OK) {
            setCriterions(response.data);
            setCriterionID(response.data[0].id);
         }
      } catch (error) {
         console.log('Criterions', error);
      }
   };

   const loadActivityOfCriterion = async () => {
      if (!currentSemester || page <= 0) return;

      setActivitiesLoading(true);
      try {
         let response = await APIs.get(endPoints['activities'], {
            params: { semester_id: currentSemester.id, criterion_id: criterionID, page },
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
         console.log('Criterion activities', error);
      } finally {
         setActivitiesLoading(false);
      }
   };

   const loadSemestersOfStudent = async () => {
      try {
         let response = await APIs.get(endPoints['student-semesters'](currentAccount.data.user.id));

         if (response.status === statusCode.HTTP_200_OK) {
            setSemesters(response.data);
         }
      } catch (error) {
         console.log('Semesters', error);
      }
   };

   const handleChangeSemester = (semester) => {
      if (semester.id !== currentSemester?.id) {
         setPage(1);
         setActivities([]);
         setCurrentSemester(semester);
         refSheetSemesters?.current?.close();
      }
   };

   const handleChangeCriterion = (criterion) => {
      if (criterion.id !== criterionID) {
         setPage(1);
         setActivities([]);
         setCriterionID(criterion.id);
      }
   };

   const renderHeaderButton = () => {
      navigation.setOptions({
         title: currentSemester
            ? `${currentSemester?.original_name} - ${currentSemester?.academic_year}`
            : 'Điểm rèn luyện',
         headerRight: () => {
            if (!currentSemester) return null;

            return (
               <TouchableOpacity
                  onPress={() => refSheetSemesters.current?.expand()}
                  style={{ ...GlobalStyle.Center, ...GlobalStyle.HeaderButton }}
               >
                  <Text style={GlobalStyle.HeaderButtonText}>Học kỳ</Text>
               </TouchableOpacity>
            );
         },
      });
   };

   const goActivityDetail = (activityID) => {
      navigation.navigate('HomeStack', {
         screen: 'ActivityDetail',
         params: { activityID },
      });
   };

   if (!isRendered) return <Loading />;

   return (
      <GestureHandlerRootView>
         <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScroll={({ nativeEvent }) => loadMore(nativeEvent, activitiesLoading, page, setPage)}
            // refreshControl={
            //    <RefreshControl
            //       colors={[Theme.PrimaryColor]}
            //       refreshing={refreshing}
            //       onRefresh={() =>
            //          onRefresh({ setPage, setData: setActivities, setRefreshing, setFilter: setActivityName })
            //       }
            //    />
            // }
         >
            <TouchableOpacity activeOpacity={1} onPress={() => refSheetSemesters?.current?.close()}>
               <BarChartOfPoints
                  dataChart={dataChart}
                  trainingPoints={trainingPoints}
                  currentSemester={currentSemester}
                  loading={trainingPointsLoading}
                  refSheetSemesters={refSheetSemesters}
               />

               <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row' }}>
                     {criterions.map((item, index) => (
                        <Chip
                           compact={true}
                           key={item.id}
                           icon="shape-outline"
                           onPress={() => handleChangeCriterion(item)}
                           mode={criterionID === item.id ? 'outlined' : 'flat'}
                           style={{
                              marginLeft: 12,
                              marginRight: index === criterions.length - 1 ? 12 : 0,
                           }}
                        >
                           {item.name}
                        </Chip>
                     ))}
                  </View>
               </ScrollView>

               <View style={{ padding: 12 }}>
                  <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                     {!refreshing && activitiesLoading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
                     {activities.map((item, index) => (
                        <CardActivity
                           key={item.id}
                           instance={item}
                           index={index}
                           onPress={() => goActivityDetail(item.id)}
                        />
                     ))}
                     {activitiesLoading && page > 1 && <Loading style={{ marginTop: 16 }} />}
                  </ScrollView>
               </View>
            </TouchableOpacity>
         </ScrollView>

         <BottomSheet
            index={!currentSemester ? 2 : -1}
            ref={refSheetSemesters}
            snapPoints={['25%', '50%', '80%']}
            enablePanDownToClose={true}
            handleIndicatorStyle={{ backgroundColor: '#fff' }}
            backgroundStyle={{ backgroundColor: Theme.PrimaryColor }}
            handleStyle={{ backgroundColor: Theme.PrimaryColor, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
         >
            <View style={TrainingPointStyle.HandleContainer}>
               <Text style={TrainingPointStyle.HandleText}>Chọn học kỳ cần xem thống kê</Text>
            </View>
            <BottomSheetFlatList
               data={semesters}
               keyExtractor={(item) => item.id.toString()}
               contentContainerStyle={{ backgroundColor: 'white' }}
               renderItem={({ item }) => (
                  <TouchableOpacity key={item.id} onPress={() => handleChangeSemester(item)}>
                     <View
                        style={{
                           ...TrainingPointStyle.SemesterContainer,
                           backgroundColor: currentSemester && currentSemester.id === item.id ? '#eee' : '#fff',
                        }}
                     >
                        <Text style={TrainingPointStyle.SemesterText}>
                           {item.original_name} - {item.academic_year}
                        </Text>
                     </View>
                  </TouchableOpacity>
               )}
            />
         </BottomSheet>
      </GestureHandlerRootView>
   );
};

const TrainingPointStyle = StyleSheet.create({
   HandleContainer: {
      flexDirection: 'row',
      overflow: 'hidden',
      paddingBottom: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      backgroundColor: Theme.PrimaryColor,
   },
   HandleText: {
      color: 'white',
      fontSize: 14,
      fontFamily: Theme.Bold,
   },
   SemesterContainer: {
      padding: 12,
      paddingLeft: 20,
      borderBottomWidth: 2,
      borderColor: '#eee',
   },
   SemesterText: {
      fontSize: 20,
      padding: 8,
      fontFamily: Theme.SemiBold,
   },
});

export default TrainingPoints;
