import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { authAPI, endPoints } from '../../../configs/APIs';
import { statusCode } from '../../../configs/Constants';
import { useAccount, useAccountDispatch } from '../../../store/contexts/AccountContext';
import GlobalStyle from '../../../styles/Style';
import Theme from '../../../styles/Theme';
import { getTokens, refreshAccessToken } from '../../../utils/Utilities';
import Loading from '../../common/Loading';

const BarChartOfPoints = ({ navigation, currentSemester, criterions, ...props }) => {
   const dispatch = useAccountDispatch();
   const currentAccount = useAccount();

   const [trainingPoints, setTrainingPoints] = useState({});
   const [loading, setLoading] = useState(false);

   const pointsDataChart = useMemo(() => {
      let data = [];

      if (currentSemester && !_.isEmpty(trainingPoints) && trainingPoints.training_points.length > 0) {
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

   useEffect(() => {
      const loadTrainingPoints = async () => {
         if (!currentSemester) return;

         setLoading(true);
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
               console.error('Training points of student:', error);
               Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
            }
         } finally {
            setLoading(false);
            props?.setRefreshing(false);
         }
      };

      loadTrainingPoints();
   }, [navigation, currentSemester, props?.refreshing]);

   return (
      <View style={BarChartStyle.ChartContainer}>
         <View style={BarChartStyle.ChartTitle}>
            <Text style={BarChartStyle.ChartTitleText}>Tổng quan điểm rèn luyện</Text>
            <View style={BarChartStyle.ChartDetails}>
               <View style={BarChartStyle.ChartDetailsWrap}>
                  <View style={{ ...BarChartStyle.ChartDetailsDot, backgroundColor: Theme.PrimaryColor }} />
                  <Text style={BarChartStyle.ChartDetailsText}>Điểm đã xác nhận</Text>
               </View>
               <View style={BarChartStyle.ChartDetailsWrap}>
                  <View style={{ ...BarChartStyle.ChartDetailsDot, backgroundColor: '#f0a419' }} />
                  <Text style={BarChartStyle.ChartDetailsText}>Điểm tối đa của điều</Text>
               </View>
            </View>
         </View>
         {loading ? (
            <Loading />
         ) : (
            <>
               <BarChart
                  data={dataChart}
                  hideRules
                  spacing={8}
                  barWidth={14}
                  maxValue={100}
                  labelWidth={40}
                  xAxisColor={'lightgray'}
                  yAxisColor={'lightgray'}
                  barBorderTopLeftRadius={4}
                  barBorderTopRightRadius={4}
                  height={currentSemester ? 160 : 80}
                  noOfSections={currentSemester ? 5 : 2}
                  yAxisTextStyle={{ color: 'lightgray' }}
                  xAxisLabelTextStyle={{ color: 'lightgray', textAlign: 'center' }}
               />
               {currentSemester ? (
                  <View style={{ ...BarChartStyle.ChartBottom, ...GlobalStyle.Center }}>
                     <View style={{ ...BarChartStyle.ChartDetailsDot, backgroundColor: '#6ac239', marginTop: 0 }} />
                     <Text style={BarChartStyle.ChartBottomText}>
                        Kết quả điểm rèn luyện: {trainingPoints.total_points}
                     </Text>
                  </View>
               ) : (
                  <TouchableOpacity
                     style={{
                        ...BarChartStyle.ChartBottom,
                        ...GlobalStyle.Center,
                        backgroundColor: Theme.PrimaryColor,
                     }}
                     onPress={() => props?.refSheetSemesters?.current?.expand()}
                  >
                     <Text style={BarChartStyle.ChartBottomText}>Vui lòng chọn học kỳ</Text>
                  </TouchableOpacity>
               )}
            </>
         )}
      </View>
   );
};

const BarChartStyle = StyleSheet.create({
   ChartContainer: {
      margin: 12,
      borderRadius: 12,
      paddingBottom: 12,
      paddingHorizontal: 12,
      backgroundColor: '#333340',
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
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
   },
   ChartDetailsWrap: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   ChartDetailsDot: {
      width: 12,
      height: 12,
      marginTop: 4,
      marginRight: 8,
      borderRadius: 6,
   },
   ChartDetailsText: {
      height: 16,
      color: 'lightgray',
   },
   ChartBottom: {
      padding: 8,
      marginTop: 16,
      borderRadius: 8,
      flexDirection: 'row',
   },
   ChartBottomText: {
      fontSize: 16,
      color: 'lightgray',
      textAlign: 'center',
      fontFamily: Theme.SemiBold,
   },
});

export default BarChartOfPoints;
