import { RefreshControl, ScrollView } from 'react-native';
import Theme from '../../Styles/Theme';
import { loadMore, onRefresh } from '../../Utils/Utilities';
import ActivityCard from './ActivityCard';
import Loading from './Loading';

const ActivityCardList = ({ navigation, data, loading, refreshing, setRefreshing, page, setPage, ...props }) => {
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
               instance={item}
               key={item.id}
               index={index}
               report={props?.report}
               onReport={() => props?.onReport?.(item) ?? null}
               onPress={() => props?.onPress?.(item) ?? null}
            />
         ))}
         {loading && page > 1 && <Loading style={{ marginVertical: 16 }} />}
      </ScrollView>
   );
};

export default ActivityCardList;
