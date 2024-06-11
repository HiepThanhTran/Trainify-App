import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DismissKeyboard from '../../components/common/DismissKeyboard';
import Searchbar from '../../components/common/Searchbar';
import CardList from '../../components/home/CardList';
import APIs, { endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { loadMore, onRefresh, search } from '../../utils/Utilities';

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
         const res = await APIs.get(endPoints['bulletins'], { params: { page, name: bulletinName } });
         if (res.data.next === null) setPage(0);
         if (res.status === statusCode.HTTP_200_OK)
            setBulletins(page === 1 ? res.data.results : [...bulletins, ...res.data.results]);
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
         setRefreshing(false);
      }
   };

   const goToBulletinDetail = (bulletinID, name) => {
      navigation.navigate('HomeStack', {
         screen: 'BulletinDetail',
         params: { bulletinID, name },
      });
   };

   return (
      <View style={GlobalStyle.BackGround}>
         <DismissKeyboard>
            <View style={BulletinStyle.Container}>
               <View style={BulletinStyle.Header}>
                  <Text style={BulletinStyle.Title}>Bản tin</Text>
                  <TouchableOpacity onPress={() => {}}>
                     <AntDesign name="message1" size={28} color={Theme.PrimaryColor} />
                  </TouchableOpacity>
               </View>
               <Searchbar
                  value={bulletinName}
                  placeholder="Tìm kiếm bản tin"
                  onChangeText={(value) => search(value, setPage, setBulletinName)}
               />
               <CardList
                  data={bulletins}
                  page={page}
                  loading={loading}
                  refreshing={refreshing}
                  cardOnPress={goToBulletinDetail}
                  onRefresh={() => onRefresh(setPage, setRefreshing, setBulletinName)}
                  onScroll={({ nativeEvent }) => loadMore(nativeEvent, loading, page, setPage)}
               />
            </View>
         </DismissKeyboard>
      </View>
   );
};

const BulletinStyle = StyleSheet.create({
   Container: {
      marginHorizontal: 12,
      marginTop: 32,
   },
   Header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   Title: {
      fontSize: 28,
      color: Theme.PrimaryColor,
      fontFamily: Theme.Bold,
   },
});

export default Bulletin;
