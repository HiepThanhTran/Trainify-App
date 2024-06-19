import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ActivityCardList from '../../Components/Common/ActivityCardList';
import ChipList from '../../Components/Common/ChipList';
import Loading from '../../Components/Common/Loading';
import Searchbar from '../../Components/Common/Searchbar';
import { authAPI, endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import { useAccount, useAccountDispatch } from '../../Store/Contexts/AccountContext';
import GlobalStyle from '../../Styles/Style';
import { getTokens, refreshAccessToken, search } from '../../Utils/Utilities';

const ChipData = [
   { id: 1, name: 'Đã tham gia', value: true },
   { id: 2, name: 'Đã đăng ký', value: false },
];

const ActivitesOfStudent = ({ navigation }) => {
   const dispatch = useAccountDispatch();
   const currentAccount = useAccount();

   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [name, setName] = useState('');
   const [partd, setPartd] = useState(ChipData[0]);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [isRendered, setIsRendered] = useState(false);

   useEffect(() => {
      const loadActivities = async () => {
         if (page <= 0) return;

         setLoading(true);
         const { accessToken, refreshToken } = await getTokens();
         try {
            const response = await authAPI(accessToken).get(
               endPoints['student-activities'](currentAccount.data.user.id),
               {
                  params: { page, name, partd: partd.value },
               },
            );
            if (response.status === statusCode.HTTP_200_OK) {
               if (page === 1) {
                  setActivities(response.data.results);
               } else {
                  setActivities((prevActitivy) => [...prevActitivy, ...response.data.results]);
               }
            }
            if (response.data.next === null) {
               setPage(0);
            }
         } catch (error) {
            console.error('Activity list:', error);
            if (error.response) {
               if (
                  error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN
               ) {
                  const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
                  if (newAccessToken) {
                     loadActivities();
                  }
               }
            } else {
               Alert.alert('Thông báo', 'Có lỗi xảy ra khi thực hiện thao tác.');
            }
         } finally {
            setLoading(false);
            setRefreshing(false);
            setIsRendered(true);
         }
      };

      loadActivities();
   }, [page, name, partd, refreshing]);

   const handleChangeChip = (item) => {
      if (!item || item.id !== partd.id) {
         setPage(1);
         setActivities([]);
         setPartd(item);
      }
   };

   const goActivityDetail = (activityID) =>
      navigation.navigate('HomeStack', {
         screen: 'ActivityDetail',
         params: {
            activityID,
         },
      });

   if (!isRendered) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={ActivityStyle.Container}>
            <Searchbar
               value={name}
               placeholder="Tìm kiếm hoạt động"
               style={{ marginVertical: 0, marginBottom: 16 }}
               onChangeText={(value) => search(value, setPage, setName)}
            />

            <View style={ActivityStyle.ChipContainer}>
               <ChipList
                  nonMarginFirst={true}
                  nonMarginLast={true}
                  data={ChipData}
                  currentItem={partd}
                  onPress={handleChangeChip}
               />
            </View>

            <View></View>

            <ActivityCardList
               navigation={navigation}
               refreshing={refreshing}
               loading={loading}
               data={activities}
               page={page}
               onScroll={true}
               onRefresh={true}
               setPage={setPage}
               setRefreshing={setRefreshing}
               onPress={(activity) => goActivityDetail(activity.id)}
            />
         </View>
      </View>
   );
};

const ActivityStyle = StyleSheet.create({
   ChipContainer: {
      paddingBottom: 12,
   },
   Container: {
      flex: 1,
      marginVertical: 20,
      marginHorizontal: 16,
   },
});

export default ActivitesOfStudent;
