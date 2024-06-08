import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BarChart } from 'react-native-gifted-charts';
import { Button, Chip } from 'react-native-paper';
import Loading from '../../components/common/Loading';
import APIs, { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import { useGlobalContext } from '../../store/contexts/GlobalContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { getTokens, refreshAccessToken } from '../../utils/Utilities';

const TrainingPoint = ({ navigation }) => {
   const { semester, setSemester, loading, setLoading, isRendered, setIsRedered } = useGlobalContext();
   const dispatch = useAccountDispatch();
   const currentAccount = useAccount();

   const sheetRef = useRef(BottomSheet);

   const [points, setPoints] = useState([]);
   const [semesters, setSemesters] = useState([]);
   const [criterions, setCriterions] = useState([]);
   const [pointsDataChart, setPointsDataChart] = useState([]);
   const [criterionDataChart, setCriterionDataChart] = useState([]);

   useEffect(() => {
      loadSemesters();
      loadCriterions();
   }, []);

   useEffect(() => {
      loadPoints();
      renderHeaderButton();
   }, [navigation, semester]);

   const loadPoints = useCallback(async () => {
      if (semester) {
         setLoading(true);
         const { accessToken, refreshToken } = await getTokens();
         try {
            let res = await authAPI(accessToken).get(
               endPoints['student-points'](currentAccount.data.user.id, semester.code),
            );

            if (res.status === statusCode.HTTP_200_OK) {
               setPoints(res.data);
               getPointsDataChart(res.data);
            }
         } catch (error) {
            if (
               error.response &&
               (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN)
            ) {
               const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
               if (newAccessToken) loadPoints();
            } else console.error(error);
         } finally {
            setLoading(false);
            setIsRedered(true);
         }
      }
   }, [semester]);

   const loadSemesters = useCallback(async () => {
      setLoading(true);
      try {
         let res = await APIs.get(endPoints['student-semesters'](currentAccount.data.user.id));

         if (res.status === statusCode.HTTP_200_OK) setSemesters(res.data);
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
         setIsRedered(true);
      }
   }, []);

   const loadCriterions = useCallback(async () => {
      setLoading(true);
      try {
         let res = await APIs.get(endPoints['criterions']);

         if (res.status === statusCode.HTTP_200_OK) {
            setCriterions(res.data);
            getCriterionDataChart(res.data);
         }
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
         setIsRedered(true);
      }
   }, []);

   const getPointsDataChart = useCallback((points) => {
      let data = [];

      points.training_points.forEach((item) => {
         data.push({
            label: item.criterion,
            value: item.point,
            frontColor: Theme.PrimaryColor,
            topLabelComponent: () => (
               <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>{item.point}</Text>
            ),
         });
      });
      setPointsDataChart(data);
   }, []);

   const getCriterionDataChart = useCallback((criterions) => {
      let data = [];
      criterions.forEach((item) => {
         data.push({
            value: item.max_point,
            frontColor: '#f0a419',
            topLabelComponent: () => (
               <Text style={{ color: 'lightgrey', fontSize: 12, marginTop: -4 }}>{item.max_point}</Text>
            ),
         });
      });
      setCriterionDataChart(data);
   }, []);

   const dataChart = useMemo(() => {
      if (pointsDataChart.length > 0) {
         const interleavedData = pointsDataChart.reduce((acc, val, i) => {
            return acc.concat(val, criterionDataChart[i]);
         }, []);
         return interleavedData;
      }
      const initalPointsDataChart = criterions.map((item) => ({
         label: item.name,
         value: 0,
         frontColor: Theme.PrimaryColor,
      }));
      const interleavedData = initalPointsDataChart.reduce((acc, val, i) => {
         return acc.concat(val, criterionDataChart[i]);
      }, []);

      return interleavedData;
   }, [pointsDataChart, criterionDataChart]);

   const handleChooseSemester = (item) => {
      if (item.id !== semester?.id) {
         setSemester(item);
         sheetRef?.current?.close();
      }
   };

   const renderHeaderButton = () => {
      navigation.setOptions({
         title: semester ? `${semester?.original_name} - ${semester?.academic_year}` : 'Điểm rèn luyện',
         headerRight: semester
            ? () => (
                 <TouchableOpacity
                    onPress={() => sheetRef.current?.expand()}
                    style={{ ...GlobalStyle.Center, ...GlobalStyle.HeaderButton }}
                 >
                    <Text style={GlobalStyle.HeaderButtonText}>Học kỳ</Text>
                 </TouchableOpacity>
              )
            : null,
      });
   };

   const renderSemester = ({ item }) => (
      <TouchableOpacity onPress={() => handleChooseSemester(item)}>
         <View
            style={{
               ...TrainingPointStyle.ItemContainer,
               ...(semester && semester.id === item.id ? { backgroundColor: Theme.SecondaryColor } : null),
            }}
         >
            <Text style={TrainingPointStyle.ItemText}>
               {item.original_name} - {item.academic_year}
            </Text>
         </View>
      </TouchableOpacity>
   );

   const renderChartTitle = () => {
      return (
         <View style={TrainingPointStyle.ChartTitle}>
            <Text style={TrainingPointStyle.ChartTitleText}>Tổng quan điểm rèn luyện</Text>
            <View style={TrainingPointStyle.ChartDetails}>
               <View style={TrainingPointStyle.ChartDetailsWrap}>
                  <View style={{ ...TrainingPointStyle.ChartDetailsDot, backgroundColor: Theme.PrimaryColor }} />
                  <Text style={TrainingPointStyle.ChartDetailsText}>Điểm đã xác nhận</Text>
               </View>
               <View style={TrainingPointStyle.ChartDetailsWrap}>
                  <View style={{ ...TrainingPointStyle.ChartDetailsDot, backgroundColor: '#f0a419' }} />
                  <Text style={TrainingPointStyle.ChartDetailsText}>Điểm tối đa của điều</Text>
               </View>
            </View>
         </View>
      );
   };

   if (!isRendered) return <Loading />;

   return (
      <GestureHandlerRootView>
         <ScrollView>
            <TouchableOpacity activeOpacity={1} onPress={() => sheetRef?.current?.close()}>
               <View style={TrainingPointStyle.ChartContainer}>
                  {renderChartTitle()}
                  {loading ? (
                     <Loading />
                  ) : (
                     <>
                        <BarChart
                           data={dataChart}
                           hideRules
                           isAnimated
                           height={semester ? 160 : 80}
                           spacing={8}
                           barWidth={14}
                           labelWidth={40}
                           noOfSections={semester ? 5 : 2}
                           maxValue={100}
                           barBorderTopLeftRadius={4}
                           barBorderTopRightRadius={4}
                           xAxisColor={'lightgray'}
                           yAxisColor={'lightgray'}
                           yAxisTextStyle={{ color: 'lightgray' }}
                           xAxisLabelTextStyle={{ color: 'lightgray', textAlign: 'center' }}
                        />
                        {!semester ? (
                           <TouchableOpacity
                              style={{
                                 ...TrainingPointStyle.ChartBottom,
                                 borderRadius: 8,
                                 backgroundColor: Theme.PrimaryColor,
                              }}
                              onPress={() => sheetRef?.current?.expand()}
                           >
                              <Text style={TrainingPointStyle.ChartBottomText}>Vui lòng chọn học kỳ</Text>
                           </TouchableOpacity>
                        ) : (
                           <View
                              style={{
                                 ...TrainingPointStyle.ChartBottom,
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                              }}
                           >
                              <View
                                 style={{
                                    ...TrainingPointStyle.ChartDetailsDot,
                                    backgroundColor: '#6ac239',
                                 }}
                              />
                              <Text style={TrainingPointStyle.ChartBottomText}>
                                 Kết quả điểm rèn luyện: {points.total_points}
                              </Text>
                           </View>
                        )}
                     </>
                  )}
               </View>
            </TouchableOpacity>

            <View
               style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginHorizontal: 8,
                  justifyContent: 'space-evenly',
               }}
            >
               {criterions.map((c) => (
                  <TouchableOpacity>
                     <Chip
                        style={{ margin: 4 }}
                        // mode="outlined"
                        key={c.id}
                        icon="shape-outline"
                     >
                        {c.name}
                     </Chip>
                  </TouchableOpacity>
               ))}
            </View>
         </ScrollView>

         <BottomSheet
            index={!semester ? 2 : -1}
            ref={sheetRef}
            snapPoints={['25%', '50%', '80%']}
            enablePanDownToClose={true}
            handleStyle={{ display: 'none' }}
         >
            <View style={TrainingPointStyle.HandleContainer}>
               <View style={TrainingPointStyle.HandleHeader}>
                  <Text style={TrainingPointStyle.HandleHeaderText}>Chọn học kỳ cần xem thống kê</Text>
               </View>
               <View style={TrainingPointStyle.HandleButton}>
                  <Button textColor="white" onPress={() => sheetRef?.current?.close()}>
                     <Text style={TrainingPointStyle.HandleButtonText}>Đóng</Text>
                  </Button>
               </View>
            </View>
            <BottomSheetFlatList
               data={semesters}
               renderItem={renderSemester}
               keyExtractor={(item) => item.id}
               contentContainerStyle={{ backgroundColor: 'white' }}
            />
         </BottomSheet>
      </GestureHandlerRootView>
   );
};

const TrainingPointStyle = StyleSheet.create({
   ChartContainer: {
      backgroundColor: '#333340',
      paddingBottom: 32,
      borderRadius: 12,
      paddingHorizontal: 12,
      margin: 4,
   },
   ChartTitle: {
      marginTop: 20,
      marginBottom: 36,
   },
   ChartTitleText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
   },
   ChartDetails: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 24,
   },
   ChartDetailsWrap: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   ChartDetailsDot: {
      height: 12,
      width: 12,
      borderRadius: 6,
      marginRight: 8,
   },
   ChartDetailsText: {
      height: 16,
      color: 'lightgray',
   },
   ChartBottom: {
      marginTop: 16,
      padding: 8,
   },
   ChartBottomText: {
      color: 'lightgray',
      fontFamily: Theme.SemiBold,
      fontSize: 16,
      textAlign: 'center',
   },
   HandleContainer: {
      flexDirection: 'row',
      overflow: 'hidden',
      paddingVertical: 20,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      backgroundColor: Theme.PrimaryColor,
   },
   HandleHeader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   HandleHeaderText: {
      color: 'white',
      fontSize: 14,
      fontFamily: Theme.Bold,
   },
   HandleButton: {
      position: 'absolute',
      right: 8,
      color: 'white',
   },
   HandleButtonText: {
      fontSize: 16,
      fontFamily: Theme.Bold,
   },
   ItemContainer: {
      padding: 12,
      paddingLeft: 20,
      borderBottomWidth: 2,
      borderColor: '#eee',
   },
   ItemText: {
      fontSize: 20,
      padding: 8,
      fontFamily: Theme.SemiBold,
   },
});

export default TrainingPoint;
