import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ActivityCardList from '../../Components/Common/ActivityCardList';
import ChipList from '../../Components/Common/ChipList';
import Loading from '../../Components/Common/Loading';
import Searchbar from '../../Components/Common/Searchbar';
import APIs, { endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import GlobalStyle from '../../Styles/Style';
import { search } from '../../Utils/Utilities';

const Activites = ({ navigation }) => {
   const [criterions, setCriterions] = useState([]);
   const [activities, setActivities] = useState([]);
   const [page, setPage] = useState(1);
   const [name, setName] = useState('');
   const [selectedCriterion, setSelectedCriterion] = useState(null);
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [isRendered, setIsRendered] = useState(false);

   useEffect(() => {
      const loadCriterions = async () => {
         try {
            let response = await APIs.get(endPoints['criterions']);

            if (response.status === statusCode.HTTP_200_OK) {
               setCriterions(response.data);
            }
         } catch (error) {
            console.log('Criterions:', error);
         }
      };

      loadCriterions();
   }, []);

   useEffect(() => {
      const loadActivities = async () => {
         if (page <= 0) return;
         setLoading(true);
         try {
            const response = await APIs.get(endPoints['activities'], {
               params: { page, name, criterion_id: selectedCriterion?.id ?? '' },
            });
            if (response.status === statusCode.HTTP_200_OK) {
               if (page === 1) {
                  setActivities(response.data.results);
               } else {
                  setActivities((prevActitivy) => [...prevActitivy, ...response.data.results]);
               }
            }
            if (response.data.next === null) {
               setPage(0);
            }
         } catch (error) {
            console.error('Activities list:', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         } finally {
            setLoading(false);
            setRefreshing(false);
            setIsRendered(true);
         }
      };

      loadActivities();
   }, [page, name, selectedCriterion, refreshing]);

   const handleChangeCriterion = (criterion) => {
      if (!criterion || criterion.id !== selectedCriterion?.id) {
         setPage(1);
         setActivities([]);
         setSelectedCriterion(criterion);
      }
   };

   const goActivityDetail = (activityID) =>
      navigation.navigate('HomeStack', {
         screen: 'ActivityDetail',
         params: {
            activityID,
         },
      });

   if (!isRendered) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={ActivityStyle.Container}>
            <Searchbar
               value={name}
               placeholder="Tìm kiếm hoạt động"
               style={{ marginVertical: 0, marginBottom: 16 }}
               onChangeText={(value) => search(value, setPage, setName)}
            />

            <View style={ActivityStyle.ChipContainer}>
               <ChipList
                  allChip={true}
                  nonMarginFirst={true}
                  nonMarginLast={true}
                  data={criterions}
                  currentItem={selectedCriterion}
                  onPress={handleChangeCriterion}
               />
            </View>

            <View></View>

            <ActivityCardList
               navigation={navigation}
               refreshing={refreshing}
               loading={loading}
               data={activities}
               page={page}
               onScroll={true}
               onRefresh={true}
               setPage={setPage}
               setRefreshing={setRefreshing}
               onPress={(activity) => goActivityDetail(activity.id)}
            />
         </View>
      </View>
   );
};

const ActivityStyle = StyleSheet.create({
   ChipContainer: {
      paddingBottom: 12,
   },
   Container: {
      flex: 1,
      marginVertical: 20,
      marginHorizontal: 16,
   },
});

export default Activites;
