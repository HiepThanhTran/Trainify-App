import { ScrollView, View } from 'react-native';
import { Chip } from 'react-native-paper';

const ChipList = ({ data, currentItem, ...props }) => {
   return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
         <View style={{ flexDirection: 'row' }}>
            {data.map((item, index) => (
               <Chip
                  key={item.id}
                  compact={true}
                  icon="shape-outline"
                  onPress={() => props?.onPress(item) ?? null}
                  mode={currentItem.id === item.id ? 'outlined' : 'flat'}
                  style={{
                     marginLeft: 12,
                     marginRight: index === data.length - 1 ? 12 : 0,
                  }}
               >
                  {item.name}
               </Chip>
            ))}
         </View>
      </ScrollView>
   );
};

export default ChipList;
