import { Alert, Text, View, StyleSheet } from 'react-native';
import GlobalStyle from '../../Styles/Style';
import { useEffect, useState } from 'react';
import APIs, {endPoints} from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import Loading from '../../Components/Common/Loading';
import ActivityCardList from '../../Components/Common/ActivityCardList';

const Activites = ({navigation}) => {
   const [activities, setActitivies] = useState([]);
   const [page, setPage] = useState(1);
   const [name, setName] = useState('');
   const [loading, setLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [isRendered, setIsRendered] = useState(false);

   useEffect(() => {
      const loadActitivy = async () => {
         if(page<=0) return;
         setLoading(true);
         try{
            const res = await APIs.get(endPoints['activities'], {params: {page, name}});
            if(res.status === statusCode.HTTP_200_OK){
               if(page === 1){
                  setActitivies(res.data.results);
               }else{
                  setActitivies((prevActitivy) => [...prevActitivy, ...res.data.results]);
               }
            }
            if(res.data.next === null) {
               setPage(0);
            }
         }catch(error){
            console.error('Activities list:', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         }finally{
            setLoading(false);
            setRefreshing(false);
            setIsRendered(true);
         }
      }

      loadActitivy();
   }, [page, name, refreshing]);

   const goActivityDetail = (activityID) => navigation.navigate('HomeStack', {
      screen: 'ActivityDetail',
      params: {
         activityID
      }
   });
   
   if (!isRendered) return <Loading />

   return (
      <View style={GlobalStyle.BackGround}>
         <View style={ActivityStyle.Container}>
         <ActivityCardList
            navigation={navigation}
            refreshing={refreshing}
            loading={loading}
            data={activities}
            page={page}
            onScroll={true}
            onRefresh={true}
            setPage={setPage}
            setData={setActitivies}
            setRefreshing={setRefreshing}
            onPress={(activity) => goActivityDetail(activity.id)}
         />
         </View>
      </View>
   );
};

const ActivityStyle = StyleSheet.create({
   Container:{
      marginTop: 20,
      marginLeft: 16,
      marginRight: 16,
   }
})

export default Activites;
