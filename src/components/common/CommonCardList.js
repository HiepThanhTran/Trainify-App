import { RefreshControl, ScrollView } from 'react-native';
import Theme from '../../styles/Theme';
import { loadMore, onRefresh } from '../../utils/Utilities';
import CommonCard from './CommonCard';
import Loading from './Loading';

const CommonCardList = ({ navigation, data, loading, refreshing, setRefreshing, page, setPage, ...props }) => {
   const handleOnScroll = ({ nativeEvent }) => {
      if (props?.loadMore) {
         loadMore(nativeEvent, loading, page, setPage);
      }

      if (props?.onScroll) {
         props?.onScroll(nativeEvent);
      }
   };

   const handleRefresh = () =>
      onRefresh({ setPage, setRefreshing, setData: props?.setData, setFilter: props?.setFilter });

   const renderRefreshControl = () => (
      <RefreshControl colors={[Theme.PrimaryColor]} refreshing={refreshing} onRefresh={handleRefresh} />
   );

   return (
      <ScrollView
         style={{ marginBottom: 136 }}
         showsVerticalScrollIndicator={false}
         showsHorizontalScrollIndicator={false}
         onScroll={handleOnScroll}
         refreshControl={props?.onRefresh ? renderRefreshControl() : null}
      >
         {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
         {data.map((item) => (
            <CommonCard key={item.id} instance={item} onPress={() => props?.onPress?.(item) ?? null} />
         ))}
         {loading && page > 1 && <Loading style={{ marginBottom: 16 }} />}
      </ScrollView>
   );
};

export default CommonCardList;
