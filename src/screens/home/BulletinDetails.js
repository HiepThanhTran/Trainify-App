import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, ImageBackground, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import Loading from '../../components/common/Loading';
import BulletinDetailsActivitiesView from '../../components/home/bulletinDetails/BulletinDetailsActivitiesView';
import BulletinDetailsOverview from '../../components/home/bulletinDetails/BulletinDetailsOverview';
import APIs, { endPoints } from '../../configs/APIs';
import { statusCode } from '../../configs/Constants';
import GlobalStyle, { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';
import { tabsBulletinDetails } from '../../utils/Fields';
import HomeStyle from './Style';

const BulletinDetails = ({ navigation, route }) => {
   const bulletinID = route?.params?.bulletinID;

   const [tab, setTab] = useState('overview');
   const [bulletin, setBulletin] = useState({});
   const [isRendered, setIsRendered] = useState(false);
   const [bulletinLoading, setBulletinLoading] = useState(false);

   const animatedHeight = useState(new Animated.Value(screenHeight / 3))[0];

   useEffect(() => {
      loadBulletin();
   }, []);

   const loadBulletin = async () => {
      if (!bulletinID) return;

      setBulletinLoading(true);
      try {
         let res = await APIs.get(endPoints['bulletin-detail'](bulletinID));
         if (res.status === statusCode.HTTP_200_OK) setBulletin(res.data);
      } catch (error) {
         console.error('Bulletin details', error);
      } finally {
         setBulletinLoading(false);
         setIsRendered(true);
      }
   };

   const handleChangeTab = (name) => {
      setTab(name);

      if (name !== 'overview') animateHeight(screenHeight / 6);
      else animateHeight(screenHeight / 3);
   };

   const animateHeight = (toValue) => {
      Animated.timing(animatedHeight, {
         toValue,
         duration: 500,
         useNativeDriver: false,
      }).start();
   };

   const tabContent = () => {
      switch (tab) {
         case 'overview':
            return <BulletinDetailsOverview bulletin={bulletin} loading={bulletinLoading} />;
         case 'activities':
            return <BulletinDetailsActivitiesView navigation={navigation} bulletinID={bulletinID} />;
         default:
            return null;
      }
   };

   if (!isRendered) return <Loading />;

   return (
      <View style={GlobalStyle.BackGround} onTouchStart={() => Keyboard.dismiss()}>
         <Animated.View style={{ ...HomeStyle.Image, height: animatedHeight }}>
            <ImageBackground source={{ uri: bulletin.image }} style={{ flex: 1 }}>
               <TouchableOpacity activeOpacity={0.8} style={HomeStyle.BackButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" color="gray" size={30} />
               </TouchableOpacity>
            </ImageBackground>
         </Animated.View>

         <View style={HomeStyle.Body}>
            <View style={HomeStyle.Header}>
               <Text style={HomeStyle.HeaderText}>{bulletin.name}</Text>
            </View>

            <View style={HomeStyle.TabContainer}>
               {tabsBulletinDetails.map((f) => (
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
