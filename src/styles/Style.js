import { Dimensions, StyleSheet } from 'react-native';
import Theme from './Theme';

export const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GlobalStyle = StyleSheet.create({
   Container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   Center: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   BackGround: {
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
   },
   HeaderButton: {
      height: 40,
      padding: 8,
      borderRadius: 16,
      backgroundColor: '#eee',
   },
   HeaderButtonText: {
      color: 'black',
      fontFamily: Theme.Bold,
   },
   BottomSheetView: {
      padding: 16,
      marginBottom: 12,
      backgroundColor: '#273238',
   },
   BottomSheetItem: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   BottomSheetItemText: {
      fontFamily: Theme.SemiBold,
      fontSize: 20,
      color: 'white',
      marginLeft: 16,
   },
   ModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
});

export default GlobalStyle;
