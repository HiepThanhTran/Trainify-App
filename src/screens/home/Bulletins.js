import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CardBulletin from '../../components/common/CardBulletin';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Loading from '../../components/common/Loading';
import Searchbar from '../../components/common/Searchbar';
import APIs, { endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { loadMore, onRefresh, search } from '../../utils/Utilities';
import HomeStyle from './Style';

const Bulletin = ({ navigation }) => {
   const [bulletins, setBulletins] = useState([]);
   const [page, setPage] = useState(1);
   const [bulletinName, setBulletinName] = useState('');
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

   useEffect(() => {
      loadBulletins();
   }, [page, bulletinName, refreshing]);

   const loadBulletins = async () => {
      if (page <= 0) return;

      setLoading(true);
      try {
         const response = await APIs.get(endPoints['bulletins'], { params: { page, name: bulletinName } });
         if (response.status === statusCode.HTTP_200_OK) {
            if (page === 1) {
               setBulletins(response.data.results);
            } else {
               setBulletins((prevBulletins) => [...prevBulletins, ...response.data.results]);
            }
         }
         if (response.data.next === null) {
            setPage(0);
         }
      } catch (error) {
         console.error('Bulletin API', error);
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

   const goToBulletinDetail = (bulletinID) => {
      navigation.navigate('HomeStack', {
         screen: 'BulletinDetail',
         params: { bulletinID },
      });
   };

   return (
      <View style={GlobalStyle.BackGround}>
         <DismissKeyboard>
            <View style={{ marginHorizontal: 12, marginTop: 32 }}>
               <View style={HomeStyle.Header}>
                  <Text style={HomeStyle.HeaderTitle}>Bản tin</Text>
                  <TouchableOpacity onPress={() => {}}>
                     <AntDesign name="message1" size={28} color={Theme.PrimaryColor} />
                  </TouchableOpacity>
               </View>
               <Searchbar
                  value={bulletinName}
                  placeholder="Tìm kiếm bản tin"
                  onChangeText={(value) => search(value, setPage, setBulletinName)}
               />
               <ScrollView
                  style={{ marginBottom: 135 }}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  onScroll={({ nativeEvent }) => loadMore(nativeEvent, loading, page, setPage)}
                  refreshControl={
                     <RefreshControl
                        colors={[Theme.PrimaryColor]}
                        refreshing={refreshing}
                        onRefresh={() => onRefresh({ setPage, setRefreshing, setFilter: setBulletinName })}
                     />
                  }
               >
                  {!refreshing && loading && page === 1 && <Loading style={{ marginBottom: 16 }} />}
                  {bulletins.map((item) => (
                     <CardBulletin key={item.id} instance={item} onPress={() => goToBulletinDetail(item.id)} />
                  ))}
                  {loading && page > 1 && <Loading style={{ marginBottom: 16 }} />}
               </ScrollView>
            </View>
         </DismissKeyboard>
      </View>
   );
};

export default Bulletin;
