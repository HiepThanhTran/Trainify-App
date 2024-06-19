import { ScrollView, View } from 'react-native';
import { Chip } from 'react-native-paper';

const ChipList = ({ data, currentItem, ...props }) => {
   return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
         <View style={{ flexDirection: 'row' }}>
            {props?.allChip && (
               <Chip
                  compact={true}
                  icon="shape-outline"
                  style={{ marginRight: 12 }}
                  onPress={() => props?.onPress(null) ?? null}
                  mode={!currentItem ? 'outlined' : 'flat'}
               >
                  Tất cả
               </Chip>
            )}
            {data.map((item, index) => (
               <Chip
                  key={item.id}
                  compact={true}
                  icon="shape-outline"
                  onPress={() => props?.onPress(item) ?? null}
                  mode={currentItem?.id === item.id ? 'outlined' : 'flat'}
                  style={{
                     marginLeft: props?.nonMarginFirst && index === 0 ? 0 : 12,
                     marginRight: index === data.length - 1 ? 12 : 0,
                     marginRight: props?.nonMarginLast && index === data.length - 1 ? 0 : undefined,
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
