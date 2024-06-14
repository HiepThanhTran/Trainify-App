import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import APIs, { endPoints } from '../../../configs/APIs';
import { statusCode } from '../../../configs/Constants';
import Theme from '../../../styles/Theme';
import { loadMore, onRefresh, search } from '../../../utils/Utilities';
import CardActivity from '../../common/CardActivity';
import Loading from '../../common/Loading';
import Searchbar from '../../common/Searchbar';

const ActivitiesListView = ({ navigation, bulletinID }) => {
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [activityName, setActivityName] = useState('');
   const [refreshing, setRefreshing] = useState(false);
   const [activitiesLoading, setActivitiesLoading] = useState(false);

   useEffect(() => {
      loadActivities();
   }, [page, activityName, refreshing]);

   const loadActivities = async () => {
      if (!bulletinID || page <= 0) return;

      setActivitiesLoading(true);
      try {
         let response = await APIs.get(endPoints['activities'], {
            params: { bulletin_id: bulletinID, page, name: activityName },
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
         console.error('Activities of bulletin', error);
      } finally {
         setActivitiesLoading(false);
         setRefreshing(false);
      }
   };

   const goActivityDetail = (activityID) => navigation.navigate('ActivityDetail', { activityID });

   return (
      <>
         <Searchbar
            value={activityName}
            placeholder="Tìm kiếm hoạt động"
            style={{ marginVertical: 0, marginBottom: 16 }}
            onChangeText={(value) => search(value, setPage, setActivityName)}
         />
         <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onScroll={({ nativeEvent }) => loadMore(nativeEvent, activitiesLoading, page, setPage)}
            refreshControl={
               <RefreshControl
                  colors={[Theme.PrimaryColor]}
                  refreshing={refreshing}
                  onRefresh={() =>
                     onRefresh({ setPage, setData: setActivities, setRefreshing, setFilter: setActivityName })
                  }
               />
            }
         >
            {!refreshing && activitiesLoading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
            {activities.map((item, index) => (
               <CardActivity key={item.id} instance={item} index={index} onPress={() => goActivityDetail(item.id)} />
            ))}
            {activitiesLoading && page > 1 && <Loading style={{ marginTop: 16 }} />}
         </ScrollView>
      </>
   );
};

export default ActivitiesListView;
