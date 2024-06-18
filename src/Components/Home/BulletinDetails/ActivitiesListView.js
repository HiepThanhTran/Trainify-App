import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import APIs, { endPoints } from '../../../Configs/APIs';
import { statusCode } from '../../../Configs/Constants';
import { search } from '../../../Utils/Utilities';
import ActivityCardList from '../../Common/ActivityCardList';
import Searchbar from '../../Common/Searchbar';

const ActivitiesListView = ({ navigation, bulletinID }) => {
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [name, setName] = useState('');
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

   useEffect(() => {
      const loadActivities = async () => {
         if (!bulletinID || page <= 0) return;

         setLoading(true);
         try {
            let response = await APIs.get(endPoints['activities'], { params: { bulletin_id: bulletinID, page, name } });

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
            console.error('Activities of bulletin:', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         } finally {
            setLoading(false);
            setRefreshing(false);
         }
      };

      loadActivities();
   }, [page, name, refreshing]);

   const goActivityDetail = (activityID) => navigation.navigate('ActivityDetail', { activityID });

   return (
      <>
         <Searchbar
            value={name}
            placeholder="Tìm kiếm hoạt động"
            style={{ marginVertical: 0, marginBottom: 16 }}
            onChangeText={(value) => search(value, setPage, setName)}
         />
         <ActivityCardList
            navigation={navigation}
            refreshing={refreshing}
            loading={loading}
            data={activities}
            page={page}
            onScroll={true}
            onRefresh={true}
            setPage={setPage}
            setFilter={setName}
            setData={setActivities}
            setRefreshing={setRefreshing}
            onPress={(activity) => goActivityDetail(activity.id)}
         />
      </>
   );
};

export default ActivitiesListView;
