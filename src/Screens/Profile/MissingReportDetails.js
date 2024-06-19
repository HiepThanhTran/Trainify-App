import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Modal, Portal } from 'react-native-paper';
import Loading from '../../Components/Common/Loading';
import { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { useAccountDispatch } from '../../Store/Contexts/AccountContext';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { getTokens, refreshAccessToken } from '../../Utils/Utilities';

const MissingReportDetails = ({ navigation, route }) => {
   const { reportID } = route?.params;
   const dispatch = useAccountDispatch();

   const [report, setReport] = useState({});
   const [isRendered, setIsRendered] = useState(false);
   const [modalVisible, setModalVisible] = useState(false);

   useEffect(() => {
      const loadReport = async () => {
         const { accessToken, refreshToken } = await getTokens();
         try {
            let response = await authAPI(accessToken).get(endPoints['report-detail'](reportID));

            if (response.status === statusCode.HTTP_200_OK) {
               setReport(response.data);
            }
         } catch (error) {
            console.error('Report details:', error);
            if (error.response) {
               if (
                  error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN
               ) {
                  const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
                  if (newAccessToken) {
                     loadReport();
                  }
               }
            } else {
               Alert.alert('Thông báo', 'Có lỗi xảy ra khi thực hiện thao tác.');
            }
         } finally {
            setIsRendered(true);
         }
      };

      loadReport();
   }, [reportID]);

   const handleConfirmReport = () => {
      const confirmReport = async () => {
         setModalVisible(true);
         const { accessToken, refreshToken } = await getTokens();
         try {
            const response = await authAPI(accessToken).post(endPoints['confirm-report'](reportID));

            console.log(response.status);

            if (response.status === statusCode.HTTP_200_OK) {
               Alert.alert('Thông báo', 'Xác nhận báo thiếu thành công', [
                  {
                     text: 'OK',
                     onPress: () => navigation.goBack(),
                  },
               ]);
            }
         } catch (error) {
            console.error('Confirm report:', error);
            if (error.response) {
               if (
                  error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN
               ) {
                  const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
                  if (newAccessToken) {
                     handleConfirmReport();
                  }
               }
            } else {
               Alert.alert('Thông báo', 'Có lỗi xảy ra khi thực hiện thao tác.');
            }
         } finally {
            setModalVisible(false);
         }
      };

      Alert.alert(
         'Xác nhận',
         'Xác nhận báo thiếu này ?',
         [
            {
               text: 'OK',
               onPress: () => confirmReport(),
            },
            {
               text: 'Hủy',
               style: 'cancel',
            },
         ],
         { cancelable: true },
      );
   };

   const handleRejectReport = () => {
      const rejectReport = async () => {
         setModalVisible(true);
         const { accessToken, refreshToken } = await getTokens();
         try {
            const response = await authAPI(accessToken).delete(endPoints['reject-report'](reportID));

            if (response.status === statusCode.HTTP_204_NO_CONTENT) {
               Alert.alert('Thông báo', 'Từ chối báo thiếu thành công', [
                  {
                     text: 'OK',
                     onPress: () => navigation.goBack(),
                  },
               ]);
            }
         } catch (error) {
            console.error('Reject report:', error);
            if (error.response) {
               if (
                  error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN
               ) {
                  const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
                  if (newAccessToken) {
                     handleRejectReport();
                  }
               }
            } else {
               Alert.alert('Thông báo', 'Có lỗi xảy ra khi thực hiện thao tác.');
            }
         } finally {
            setModalVisible(false);
         }
      };

      Alert.alert(
         'Xác nhận',
         'Xác nhận từ chối báo thiếu này ?',
         [
            {
               text: 'OK',
               onPress: () => rejectReport(),
            },
            {
               text: 'Hủy',
               style: 'cancel',
            },
         ],
         { cancelable: true },
      );
   };

   if (!isRendered) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={MissingReportDetailsStyle.Container}>
            <Text style={MissingReportDetailsStyle.Title}>Thông tin phiếu báo thiếu</Text>
            <View style={MissingReportDetailsStyle.Subject}>
               <Text style={MissingReportDetailsStyle.SubjectTitle}>Thông tin hoạt động báo thiếu</Text>
               <Text style={MissingReportDetailsStyle.SubjectLine}></Text>
            </View>
            <View style={MissingReportDetailsStyle.Field}>
               <AntDesign name="appstore1" size={24} color="#114e7f" style={MissingReportDetailsStyle.Icon} />
               <Text style={MissingReportDetailsStyle.Text}>
                  <Text style={MissingReportDetailsStyle.FieldDesTitle}>Tên hoạt động</Text>: {report.activity.name}
               </Text>
            </View>

            <View style={MissingReportDetailsStyle.Field}>
               <AntDesign name="clockcircle" size={24} color="#114e7f" style={MissingReportDetailsStyle.Icon} />
               <Text style={MissingReportDetailsStyle.Text}>
                  <Text style={MissingReportDetailsStyle.FieldDesTitle}>Ngày bắt đầu: </Text>
                  {moment(report.start_date).format('DD/MM/YYYY')}
               </Text>
            </View>

            <View style={MissingReportDetailsStyle.Field}>
               <AntDesign name="clockcircle" size={24} color="#114e7f" style={MissingReportDetailsStyle.Icon} />
               <Text style={MissingReportDetailsStyle.Text}>
                  <Text style={MissingReportDetailsStyle.FieldDesTitle}>Ngày kết thúc: </Text>
                  {moment(report.end_date).format('DD/MM/YYYY')}
               </Text>
            </View>

            <View style={MissingReportDetailsStyle.Field}>
               <Ionicons name="location" size={24} color="#114e7f" style={MissingReportDetailsStyle.Icon} />
               <Text style={MissingReportDetailsStyle.Text}>
                  <Text style={MissingReportDetailsStyle.FieldDesTitle}>Địa điểm: </Text>
                  {moment(report.end_date).format('DD/MM/YYYY')}
               </Text>
            </View>

            <View style={MissingReportDetailsStyle.Field}>
               <AntDesign name="star" size={24} color="#114e7f" style={MissingReportDetailsStyle.Icon} />
               <Text style={MissingReportDetailsStyle.Text}>
                  <Text style={MissingReportDetailsStyle.FieldDesTitle}>Điểm cộng: </Text> {report.activity.point}
               </Text>
            </View>

            <View style={MissingReportDetailsStyle.Subject}>
               <Text style={MissingReportDetailsStyle.SubjectTitle}>Thông tin sinh viên báo thiếu</Text>
               <Text style={MissingReportDetailsStyle.SubjectLine}></Text>
            </View>

            <View style={MissingReportDetailsStyle.Field}>
               <Ionicons name="people" size={24} color="#114e7f" style={MissingReportDetailsStyle.Icon} />
               <Text style={MissingReportDetailsStyle.Text}>
                  <Text style={MissingReportDetailsStyle.FieldDesTitle}>Sinh viên báo thiếu: </Text>{' '}
                  {report.student.full_name}
               </Text>
            </View>

            <View style={MissingReportDetailsStyle.Field}>
               <Entypo name="calendar" size={24} color="#114e7f" style={MissingReportDetailsStyle.Icon} />
               <Text style={MissingReportDetailsStyle.Text}>
                  <Text style={MissingReportDetailsStyle.FieldDesTitle}>Năm sinh: </Text>{' '}
                  {moment(report.student.date_of_birth).format('DD/MM/YYYY')}
               </Text>
            </View>

            {!report.is_resolved && (
               <View style={MissingReportDetailsStyle.ButtonContainer}>
                  <TouchableOpacity style={MissingReportDetailsStyle.ButtonAccept} onPress={handleConfirmReport}>
                     <Text style={MissingReportDetailsStyle.ButtonText}>Đồng ý</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={MissingReportDetailsStyle.ButtonReject} onPress={handleRejectReport}>
                     <Text style={MissingReportDetailsStyle.ButtonText}>Từ chối</Text>
                  </TouchableOpacity>
               </View>
            )}
         </View>

         <Portal>
            <Modal visible={modalVisible} style={GlobalStyle.Container}>
               <Loading />
            </Modal>
         </Portal>
      </View>
   );
};

const MissingReportDetailsStyle = StyleSheet.create({
   Container: {
      marginTop: 20,
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 50,
      borderWidth: 2,
      padding: 12,
      borderRadius: 8,
      borderColor: Theme.PrimaryColor,
      backgroundColor: Theme.SecondaryColor,
   },
   Subject: {
      marginTop: 15,
   },
   SubjectTitle: {
      fontFamily: Theme.Bold,
      fontSize: 18,
   },
   SubjectLine: {
      width: '100%',
      backgroundColor: '#dadada',
      height: 1,
      marginTop: 5,
      marginBottom: 5,
   },
   Title: {
      fontFamily: Theme.Bold,
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 10,
   },
   Text: {
      fontFamily: Theme.SemiBold,
      fontSize: 18,
      marginLeft: 10,
      flexWrap: 'wrap',
      flex: 1,
   },
   Field: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
   },
   Icon: {
      marginRight: 5,
   },
   FieldDesTitle: {
      fontFamily: Theme.Bold,
      fontSize: 18,
      color: '#114e7f',
   },
   ButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
   },
   ButtonAccept: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
   },
   ButtonReject: {
      backgroundColor: '#F44336',
      padding: 10,
      borderRadius: 5,
   },
   ButtonText: {
      color: 'white',
      fontFamily: Theme.Bold,
      fontSize: 16,
      textAlign: 'center',
   },
});

export default MissingReportDetails;
