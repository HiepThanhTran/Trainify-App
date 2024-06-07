import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';

const ActivitySettings = () => {
   const bottomSheetRef = useRef(BottomSheet);

   return (
      <GestureHandlerRootView>
         <View style={GlobalStyle.Container}>
            <View>
               <Text>Activity Management Screen</Text>
            </View>
            <BottomSheet ref={bottomSheetRef} snapPoints={['50%']}>
               <BottomSheetView
                  style={{
                     flex: 1,
                     alignItems: 'center',
                  }}
               >
                  <TouchableOpacity
                     style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                        backgroundColor: Theme.SecondaryColor,
                        borderBottomWidth: 2,
                     }}
                  >
                     <Text>Thêm hoạt động mới</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                        backgroundColor: Theme.SecondaryColor,
                        borderBottomWidth: 2,
                     }}
                  >
                     <Text>Chỉnh sửa hoạt động</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                        backgroundColor: Theme.SecondaryColor,
                        borderBottomWidth: 2,
                     }}
                  >
                     <Text>Xóa hoạt động</Text>
                  </TouchableOpacity>
               </BottomSheetView>
            </BottomSheet>
         </View>
      </GestureHandlerRootView>
   );
};

export default ActivitySettings;
