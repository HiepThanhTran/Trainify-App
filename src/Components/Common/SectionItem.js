import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Theme from '../../Styles/Theme';

const SectionItem = ({ instance, ...props }) => {
   return (
      <TouchableOpacity
         activeOpacity={0.6}
         onPress={() =>
            props?.onPress({
               screen: instance.screen,
               params: instance.params,
               otherStack: instance.otherStack,
               otherTab: instance.otherTab,
            })
         }
         style={SectionItemStyle.SectionItem}
      >
         <View style={SectionItemStyle.SectionItemLeft}>
            <Icon color={Theme.PrimaryColor} source={instance.icon} size={24} />
            <Text style={SectionItemStyle.TextItemLeft}>{instance.label}</Text>
         </View>
         <View>
            <Icon source="chevron-right" size={24} />
         </View>
      </TouchableOpacity>
   );
};

const SectionItemStyle = StyleSheet.create({
   SectionItem: {
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      justifyContent: 'space-between',
   },
   SectionItemLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
   },
   TextItemLeft: {
      marginLeft: 8,
      fontSize: 16,
      fontFamily: Theme.SemiBold,
   },
});

export default SectionItem;
