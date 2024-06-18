import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Animated, ImageBackground, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import Loading from '../../Components/Common/Loading';
import ActivitiesListView from '../../Components/Home/BulletinDetails/ActivitiesListView';
import BulletinSummary from '../../Components/Home/BulletinDetails/BulletinSummary';
import APIs, { endPoints } from '../../Configs/APIs';
import { statusCode } from '../../Configs/Constants';
import GlobalStyle, { screenHeight } from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { tabsContent } from '../../Utils/Fields';
import HomeStyle from './Style';

const BulletinDetails = ({ navigation, route }) => {
   const { bulletinID } = route?.params;

   const [isRendered, setIsRendered] = useState(false);
   const [tab, setTab] = useState('overview');
   const [bulletin, setBulletin] = useState({});
   const [bulletinLoading, setBulletinLoading] = useState(false);

   const animatedHeight = useState(new Animated.Value(screenHeight / 3))[0];

   useEffect(() => {
      const loadBulletin = async () => {
         if (!bulletinID) return;

         setBulletinLoading(true);
         try {
            let response = await APIs.get(endPoints['bulletin-detail'](bulletinID));
            if (response.status === statusCode.HTTP_200_OK) {
               setBulletin(response.data);
            }
         } catch (error) {
            console.error('Bulletin details', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         } finally {
            setBulletinLoading(false);
            setIsRendered(true);
         }
      };

      loadBulletin();
   }, []);

   const handleChangeTab = (name) => {
      setTab(name);

      if (name !== 'overview') {
         animateHeight(screenHeight / 6);
      } else {
         animateHeight(screenHeight / 3);
      }
   };

   const tabContent = () => {
      if (isRendered) {
         switch (tab) {
            case 'overview':
               return <BulletinSummary bulletin={bulletin} loading={bulletinLoading} />;
            case 'activities':
               return <ActivitiesListView navigation={navigation} bulletinID={bulletinID} />;
            default:
               return null;
         }
      }
   };

   const animateHeight = (toValue) => {
      Animated.timing(animatedHeight, {
         toValue,
         duration: 500,
         useNativeDriver: false,
      }).start();
   };

   if (!isRendered) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround} onTouchStart={() => Keyboard.dismiss()}>
         <Animated.View style={{ ...HomeStyle.Image, height: animatedHeight }}>
            <ImageBackground source={{ uri: bulletin.image }} style={{ flex: 1 }}>
               <TouchableOpacity activeOpacity={0.8} style={GlobalStyle.BackButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" color="gray" size={30} />
               </TouchableOpacity>
            </ImageBackground>
         </Animated.View>

         <View style={HomeStyle.Body}>
            <View style={HomeStyle.Header}>
               <Text style={HomeStyle.HeaderText}>{bulletin.name}</Text>
            </View>

            <View style={HomeStyle.TabContainer}>
               {tabsContent.bulletin.map((f) => (
                  <TouchableOpacity
                     key={f.name}
                     style={HomeStyle.TabItem}
                     disabled={f.name === tab ? true : false}
                     onPress={() => handleChangeTab(f.name)}
                  >
                     <Text
                        style={{
                           ...HomeStyle.TabText,
                           color: f.name === tab ? Theme.PrimaryColor : 'black',
                        }}
                     >
                        {f.label}
                     </Text>
                  </TouchableOpacity>
               ))}
            </View>
            {tabContent()}
         </View>
      </View>
   );
};

export default BulletinDetails;
