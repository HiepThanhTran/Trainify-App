import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import GlobalStyle from '../../../styles/Style';
import Theme from '../../../styles/Theme';
import Loading from '../../common/Loading';

const BarChartOfPoints = ({ dataChart, trainingPoints, currentSemester, ...props }) => {
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
         {props?.loading ? (
            <Loading />
         ) : (
            <>
               <BarChart
                  data={dataChart}
                  hideRules
                  height={currentSemester ? 160 : 80}
                  spacing={8}
                  barWidth={14}
                  labelWidth={40}
                  noOfSections={currentSemester ? 5 : 2}
                  maxValue={100}
                  barBorderTopLeftRadius={4}
                  barBorderTopRightRadius={4}
                  xAxisColor={'lightgray'}
                  yAxisColor={'lightgray'}
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
      backgroundColor: '#333340',
      paddingBottom: 12,
      borderRadius: 12,
      paddingHorizontal: 12,
      margin: 12,
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
      marginTop: 4,
   },
   ChartDetailsText: {
      height: 16,
      color: 'lightgray',
   },
   ChartBottom: {
      marginTop: 16,
      padding: 8,
      borderRadius: 8,
      flexDirection: 'row',
   },
   ChartBottomText: {
      color: 'lightgray',
      fontFamily: Theme.SemiBold,
      fontSize: 16,
      textAlign: 'center',
   },
});

export default BarChartOfPoints;
