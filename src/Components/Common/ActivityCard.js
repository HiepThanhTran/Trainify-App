import { AntDesign, Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { defaultImage } from '../../Configs/Constants';
import Theme from '../../Styles/Theme';

const ActivityCard = ({ instance, index, ...props }) => {
   return (
      <View style={{ ...props?.style }}>
         <ImageBackground
            source={{ uri: instance.image }}
            style={{ ...CarddActivityStyle.Background, marginTop: index === 0 ? 0 : 12 }}
         >
            <View style={CarddActivityStyle.CardContainer}>
               <View style={{ ...CarddActivityStyle.CardRow, marginTop: 0 }}>
                  <Text style={CarddActivityStyle.CardTitle}>{instance.name}</Text>
                  {props?.report ? (
                     instance?.reported?.reported ? (
                        <TouchableOpacity
                           activeOpacity={0.8}
                           onPress={props?.onReport}
                           disabled={instance.reported.is_resolved}
                        >
                           <View
                              style={{
                                 ...CarddActivityStyle.ReportButton,
                                 paddingHorizontal: instance.reported.is_resolved ? 0 : 16,
                                 backgroundColor: instance.reported.is_resolved ? 'transparent' : '#6ac239',
                              }}
                           >
                              <Text
                                 style={{
                                    ...CarddActivityStyle.CardText,
                                    marginLeft: 0,
                                    fontFamily: instance.reported.is_resolved ? Theme.Bold : Theme.SemiBold,
                                    color: instance.reported.is_resolved ? '#6ac239' : '#fff',
                                 }}
                              >
                                 {instance.reported.is_resolved ? 'Đã giải quyết' : 'Hủy'}
                              </Text>
                              {instance.reported.is_resolved && (
                                 <View style={{ marginLeft: 12 }}>
                                    <AntDesign name="checkcircle" size={24} color="#6ac239" />
                                 </View>
                              )}
                           </View>
                        </TouchableOpacity>
                     ) : (
                        <TouchableOpacity activeOpacity={0.8} onPress={props?.onReport}>
                           <View style={CarddActivityStyle.ReportButton}>
                              <Text style={{ ...CarddActivityStyle.CardText, marginLeft: 0 }}>Báo thiếu</Text>
                           </View>
                        </TouchableOpacity>
                     )
                  ) : null}
               </View>

               <View style={CarddActivityStyle.CardRow}>
                  <View style={CarddActivityStyle.CardWrap}>
                     <AntDesign name="star" size={24} color="lightgrey" />
                     <Text style={CarddActivityStyle.CardText}>
                        {instance.point} điểm - {instance.criterion.name}
                     </Text>
                  </View>
               </View>

               <View style={CarddActivityStyle.CardRow}>
                  <View style={CarddActivityStyle.CardWrap}>
                     <Ionicons name="time" size={24} color="lightgrey" />
                     <Text style={{ ...CarddActivityStyle.CardText, color: 'lightgrey' }}>
                        {moment(instance.created_date).format('DD/MM/YYYY')}
                     </Text>
                  </View>
                  <Text style={CarddActivityStyle.CardText}>{instance.semester.name}</Text>
               </View>

               <View style={CarddActivityStyle.CardRow}>
                  <View style={{ ...CarddActivityStyle.CardWrap, marginLeft: -4 }}>
                     <Image
                        style={CarddActivityStyle.CardAvatar}
                        source={{ uri: instance.created_by?.avatar ?? defaultImage.USER_AVATAR }}
                     />
                     <Text style={CarddActivityStyle.CardText}>{instance.created_by.full_name}</Text>
                  </View>
                  <TouchableOpacity style={CarddActivityStyle.CardWrap} onPress={props?.onPress ?? null}>
                     <Text style={{ ...CarddActivityStyle.CardText, marginRight: 4 }}>Xem chi tiết</Text>
                     <AntDesign name="arrowright" size={20} color="lightgrey" />
                  </TouchableOpacity>
               </View>
            </View>
         </ImageBackground>
      </View>
   );
};

const CarddActivityStyle = StyleSheet.create({
   Background: {
      borderRadius: 8,
      overflow: 'hidden',
   },
   ReportButton: {
      borderRadius: 8,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#6ac239',
      alignSelf: 'flex-start',
      flexDirection: 'row',
      paddingHorizontal: 16,
   },
   CardContainer: {
      padding: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   CardTitle: {
      flex: 1,
      fontSize: 20,
      color: 'white',
      flexWrap: 'wrap',
      fontFamily: Theme.Bold,
   },
   CardRow: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   CardText: {
      fontSize: 16,
      marginLeft: 8,
      fontStyle: 'italic',
      color: 'white',
      fontFamily: Theme.SemiBold,
   },
   CardAvatar: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: Theme.SecondaryColor,
   },
   CardWrap: {
      flexDirection: 'row',
      alignItems: 'center',
   },
});

export default ActivityCard;
