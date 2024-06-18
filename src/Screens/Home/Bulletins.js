import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import CommonCardList from '../../Components/Common/CommonCardList';
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import Searchbar from '../../Components/Common/Searchbar';
import APIs, { endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { search } from '../../Utils/Utilities';
import HomeStyle from './Style';

const Bulletins = ({ navigation }) => {
   const [bulletins, setBulletins] = useState([]);
   const [page, setPage] = useState(1);
   const [name, setName] = useState('');
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

   useEffect(() => {
      const loadBulletins = async () => {
         if (page <= 0) return;

         setLoading(true);
         try {
            const response = await APIs.get(endPoints['bulletins'], { params: { page, name } });
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
            console.error('Bulletins list:', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         } finally {
            setLoading(false);
            setRefreshing(false);
         }
      };

      loadBulletins();
   }, [page, name, refreshing]);

   const goToBulletinDetails = (bulletinID) => {
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
                  <TouchableOpacity onPress={() => navigation.navigate('ChatStack', { screen: 'Chat' })}>
                     <AntDesign name="message1" size={28} color={Theme.PrimaryColor} />
                  </TouchableOpacity>
               </View>

               <Searchbar
                  value={name}
                  placeholder="Tìm kiếm bản tin"
                  onChangeText={(value) => search(value, setPage, setName)}
               />

               <CommonCardList
                  refreshing={refreshing}
                  loading={loading}
                  data={bulletins}
                  page={page}
                  loadMore={true}
                  onRefresh={true}
                  setPage={setPage}
                  setFilter={setName}
                  setRefreshing={setRefreshing}
                  onPress={(bulletin) => goToBulletinDetails(bulletin.id)}
               />
            </View>
         </DismissKeyboard>
      </View>
   );
};

export default Bulletins;
