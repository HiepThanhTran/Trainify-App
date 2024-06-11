import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import Theme from '../../styles/Theme';
import Loading from '../common/Loading';
import Card from './Card';

const CardList = ({ data, ...props }) => {
   return (
      <ScrollView
         onScroll={props?.onScroll}
         showsVerticalScrollIndicator={false}
         showsHorizontalScrollIndicator={false}
         style={{ ...CardListStyle.CardList, ...props?.style }}
         refreshControl={
            <RefreshControl colors={[Theme.PrimaryColor]} refreshing={props?.refreshing} onRefresh={props?.onRefresh} />
         }
      >
         {props?.topLoading && !props?.refreshing && props?.loading && props?.page === 1 && <Loading />}
         {data?.map((d) => (
            <Card key={d.id} instance={d} onPress={() => props?.onPress(d.id) ?? null} />
         ))}
         {props?.loading && props?.page > 1 && <Loading />}
      </ScrollView>
   );
};

const CardListStyle = StyleSheet.create({
   CardList: {
      marginBottom: 135,
   },
});

export default CardList;
