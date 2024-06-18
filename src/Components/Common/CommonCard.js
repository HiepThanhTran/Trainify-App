import moment from 'moment';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { defaultImage } from '../../Configs/Constants';
import { screenHeight, screenWidth } from '../../Styles/Style';
import Theme from '../../Styles/Theme';

const CommonCard = ({ instance, ...props }) => {
   return (
      <TouchableOpacity onPress={props?.onPress ?? null}>
         <View style={CardStyle.Card}>
            <View style={CardStyle.CardImage}>
               <Image style={CardStyle.Image} source={{ uri: instance?.image ?? defaultImage.BULLETIN_IMAGE }} />
            </View>
            <Text style={CardStyle.CardTitle}>{instance.name}</Text>
            <RenderHTML
               contentWidth={screenWidth}
               source={{ html: instance.description }}
               baseStyle={CardStyle.CardDescription}
               defaultTextProps={{
                  numberOfLines: 2,
                  ellipsizeMode: 'tail',
               }}
            />
            <Text style={CardStyle.CardDate}>
               Ngày tạo: <Text>{moment(instance.created_date).format('DD/MM/YYYY')}</Text>
            </Text>
         </View>
      </TouchableOpacity>
   );
};

const CardStyle = StyleSheet.create({
   Card: {
      flexDirection: 'column',
      marginBottom: 20,
      borderWidth: 1,
      padding: 12,
      borderRadius: 16,
      borderColor: Theme.PrimaryColor,
   },
   CardImage: {
      justifyContent: 'center',
      width: '100%',
      height: screenHeight / 4,
   },
   Image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
   },
   CardTitle: {
      fontSize: 24,
      marginVertical: 12,
      fontFamily: Theme.Bold,
   },
   CardDescription: {
      width: '100%',
      fontSize: 20,
      fontFamily: Theme.Regular,
      lineHeight: 30
   },
   CardDate: {
      fontSize: 16,
      marginVertical: 12,
      fontFamily: Theme.SemiBold,
   },
});

export default CommonCard;
