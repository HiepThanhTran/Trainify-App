import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { defaultImage } from '../../configs/Constants';
import Theme from '../../styles/Theme';
import { formatDate } from '../../utils/Utilities';

const CardActivity = ({ instance, index, ...props }) => {
   return (
      <View style={{ ...props?.style }}>
         <ImageBackground
            source={{ uri: instance.image }}
            style={{
               marginTop: index !== 0 ? 12 : 0,
               borderRadius: 8,
               overflow: 'hidden',
            }}
         >
            <View
               style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  height: 160,
                  padding: 12,
               }}
            >
               <View>
                  <Text
                     style={{
                        fontFamily: Theme.Bold,
                        fontSize: 20,
                        color: 'white',
                     }}
                  >
                     {instance.name}
                  </Text>
               </View>
               <View
                  style={{
                     flexDirection: 'row',
                     marginTop: 8,
                     alignItems: 'center',
                  }}
               >
                  <Ionicons name="time" size={24} color="lightgrey" />
                  <Text
                     style={{
                        fontFamily: Theme.Regular,
                        fontSize: 16,
                        color: 'lightgrey',
                        marginLeft: 8,
                        fontStyle: 'italic',
                     }}
                  >
                     {formatDate(instance.created_date)}
                  </Text>
               </View>
               <View
                  style={{
                     flexDirection: 'row',
                     marginTop: 8,
                     alignItems: 'center',
                     justifyContent: 'space-between',
                  }}
               >
                  <View
                     style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                     }}
                  >
                     <AntDesign name="star" size={24} color="lightgrey" />
                     <Text
                        style={{
                           fontFamily: Theme.SemiBold,
                           fontSize: 16,
                           color: 'white',
                           fontStyle: 'italic',
                           marginLeft: 8,
                        }}
                     >
                        {instance.point} điểm - {instance.criterion}
                     </Text>
                  </View>
                  <Text
                     style={{
                        fontFamily: Theme.SemiBold,
                        fontSize: 16,
                        color: 'white',
                        fontStyle: 'italic',
                     }}
                  >
                     {instance.semester}
                  </Text>
               </View>
               <View
                  style={{
                     flexDirection: 'row',
                     marginTop: 12,
                     alignItems: 'center',
                     justifyContent: 'space-between',
                  }}
               >
                  <View
                     style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: -4,
                     }}
                  >
                     <Image
                        style={{
                           width: 28,
                           height: 28,
                           borderRadius: 8,
                           backgroundColor: Theme.SecondaryColor,
                        }}
                        source={{ uri: instance.created_by?.avatar ?? defaultImage.USER_AVATAR }}
                     />
                     <Text
                        style={{
                           fontFamily: Theme.SemiBold,
                           fontSize: 16,
                           color: 'white',
                           fontStyle: 'italic',
                           marginLeft: 8,
                        }}
                     >
                        {instance.created_by.full_name}
                     </Text>
                  </View>
                  <TouchableOpacity
                     style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                     }}
                     onPress={props?.onPress ?? null}
                  >
                     <Text
                        style={{
                           fontFamily: Theme.SemiBold,
                           fontSize: 12,
                           color: 'white',
                           marginRight: 8,
                        }}
                     >
                        Xem chi tiết
                     </Text>
                     <AntDesign name="arrowright" size={20} color="lightgrey" />
                  </TouchableOpacity>
               </View>
            </View>
         </ImageBackground>
      </View>
   );
};

const CarddActivityStyle = StyleSheet.create({});

export default CardActivity;
