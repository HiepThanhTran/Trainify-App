import { RefreshControl, ScrollView } from 'react-native';
import Theme from '../../styles/Theme';
import { loadMore, onRefresh } from '../../utils/Utilities';
import Loading from '../common/Loading';
import ActivityCard from './ActivityCard';

const ActivityCardList = ({
   navigation,
   reportButton,
   data,
   loading,
   refreshing,
   setRefreshing,
   page,
   setPage,
   ...props
}) => {
   const goActivityDetail = (activityID) => navigation.navigate('ActivityDetail', { activityID });

   const handleOnScroll = ({ nativeEvent }) => loadMore(nativeEvent, loading, page, setPage);

   const handleRefresh = () =>
      onRefresh({ setPage, setRefreshing, setData: props?.setData, setFilter: props?.setFilter });

   const renderRefreshControl = () => (
      <RefreshControl colors={[Theme.PrimaryColor]} refreshing={refreshing} onRefresh={handleRefresh} />
   );

   return (
      <ScrollView
         showsVerticalScrollIndicator={false}
         showsHorizontalScrollIndicator={false}
         onScroll={props?.onScroll ? handleOnScroll : null}
         refreshControl={props?.onRefresh ? renderRefreshControl() : null}
      >
         {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
         {data.map((item, index) => (
            <ActivityCard
               reportButton={reportButton}
               instance={item}
               key={item.id}
               index={index}
               onReport={props?.onReport}
               onPress={() => (props?.onDetails ? props?.onDetails(item.id) : goActivityDetail(item.id))}
            />
         ))}
         {loading && page > 1 && <Loading style={{ marginTop: 16 }} />}
      </ScrollView>
   );
};

export default ActivityCardList;
