import { StyleSheet, Text, View } from 'react-native';
import Theme from '../../styles/Theme';
import SectionItem from './SectionItem';

const Section = ({ data, ...props }) => {
   return (
      <>
         {data.map((d, index) => (
            <View key={'section-' + index} style={SectionStyle.Section}>
               <Text style={SectionStyle.SectionTitle}>{d.title}</Text>
               <View style={SectionStyle.SectionBody}>
                  {d.items.map((item, itemIndex) => (
                     <SectionItem key={'item-' + itemIndex} instance={item} onPress={props?.onPress} />
                  ))}
               </View>
            </View>
         ))}
      </>
   );
};

const SectionStyle = StyleSheet.create({
   Section: {
      marginTop: 40,
      marginHorizontal: 12,
   },
   SectionTitle: {
      textTransform: 'uppercase',
      fontFamily: Theme.SemiBold,
      fontSize: 16,
   },
   SectionBody: {
      borderWidth: 1,
      marginTop: 12,
      borderRadius: 8,
      borderColor: '#eee',
      overflow: 'hidden',
      borderBottomWidth: 0,
   },
});

export default Section;
