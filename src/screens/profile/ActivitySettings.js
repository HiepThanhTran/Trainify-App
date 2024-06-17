import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonCardList from '../../components/common/CommonCardList';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Searchbar from '../../components/common/Searchbar';
import { authAPI, endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import { useAccount, useAccountDispatch } from '../../store/contexts/AccountContext';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { getTokens, onRefresh, refreshAccessToken, search } from '../../utils/Utilities';

const ActivitySettings = ({ navigation }) => {
   const dispath = useAccountDispatch();
   const currentAccount = useAccount();

   const [wasNavigatedFromGoBack, setWasNavigatedFromGoBack] = useState(false);
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [name, setName] = useState('');
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

   useEffect(() => {
      const loadActivites = async () => {
         if (page <= 0) return;

         setLoading(true);
         const { accessToken, refreshToken } = await getTokens();
         try {
            let response = await authAPI(accessToken).get(endPoints['activities'], {
               params: { organizer_id: currentAccount.data.user.id, page, name: name },
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
            if (
               error.response &&
               (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN)
            ) {
               const newAccessToken = await refreshAccessToken(refreshToken, dispath);
               if (newAccessToken) {
                  loadActivites();
               }
            } else {
               console.error('Activites of created by:', error);
               Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
            }
         } finally {
            setLoading(false);
            setRefreshing(false);
         }
      };

      loadActivites();
   }, [page, name, refreshing]);

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
            onRefresh({ setPage, setRefreshing, setFilter: setName });
            setWasNavigatedFromGoBack(false);
         }
      }, [wasNavigatedFromGoBack]),
   );

   const goToCreateActivityForm = () => navigation.navigate('CreateActivityForm');

   const goToEditActivityForm = (activityID) => navigation.navigate('EditActivityForm', { activityID });

   return (
      <View style={GlobalStyle.BackGround}>
         <DismissKeyboard>
            <View style={{ marginHorizontal: 12 }}>
               <Searchbar
                  value={name}
                  placeholder="Tìm kiếm hoạt động"
                  onChangeText={(value) => search(value, setPage, setName)}
               />

               <View style={ActivitySettingStyle.Header}>
                  <Text style={ActivitySettingStyle.HeaderText}>Danh sách hoạt động</Text>
                  <TouchableOpacity onPress={goToCreateActivityForm}>
                     <AntDesign name="pluscircleo" size={32} color={Theme.PrimaryColor} />
                  </TouchableOpacity>
               </View>

               <CommonCardList
                  refreshing={refreshing}
                  loading={loading}
                  data={activities}
                  page={page}
                  loadMore={true}
                  onRefresh={true}
                  setPage={setPage}
                  setFilter={setName}
                  setRefreshing={setRefreshing}
                  onPress={(activity) => goToEditActivityForm(activity.id)}
               />
            </View>
         </DismissKeyboard>
      </View>
   );
};

const ActivitySettingStyle = StyleSheet.create({
   Header: {
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   HeaderText: {
      fontSize: 20,
      fontFamily: Theme.Bold,
   },
});

export default ActivitySettings;
