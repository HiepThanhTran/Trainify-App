import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Theme from '../../../Styles/Theme';

const SemestersList = ({ semesters, currentSemester, refSheetSemesters, ...props }) => {
   return (
      <BottomSheet
         index={currentSemester ? -1 : 1}
         ref={refSheetSemesters}
         snapPoints={['25%', '50%']}
         enablePanDownToClose={true}
         handleIndicatorStyle={{ backgroundColor: '#fff' }}
         backgroundStyle={{ backgroundColor: Theme.PrimaryColor }}
         handleStyle={{ backgroundColor: Theme.PrimaryColor, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      >
         <View style={SemestersListStyle.HandleContainer}>
            <Text style={SemestersListStyle.HandleText}>Chọn học kỳ cần xem thống kê</Text>
         </View>
         <BottomSheetFlatList
            data={semesters}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ backgroundColor: 'white' }}
            renderItem={({ item }) => (
               <TouchableOpacity key={item.id} onPress={() => props?.onPress(item) ?? null}>
                  <View
                     style={{
                        ...SemestersListStyle.SemesterContainer,
                        backgroundColor: currentSemester && currentSemester.id === item.id ? '#eee' : '#fff',
                     }}
                  >
                     <Text style={SemestersListStyle.SemesterText}>
                        {item.original_name} - {item.academic_year}
                     </Text>
                  </View>
               </TouchableOpacity>
            )}
         />
      </BottomSheet>
   );
};

const SemestersListStyle = StyleSheet.create({
   HandleContainer: {
      flexDirection: 'row',
      overflow: 'hidden',
      paddingBottom: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      backgroundColor: Theme.PrimaryColor,
   },
   HandleText: {
      color: 'white',
      fontSize: 14,
      fontFamily: Theme.Bold,
   },
   SemesterContainer: {
      padding: 12,
      paddingLeft: 20,
      borderBottomWidth: 2,
      borderColor: '#eee',
   },
   SemesterText: {
      fontSize: 20,
      padding: 8,
      fontFamily: Theme.SemiBold,
   },
});

export default SemestersList;
