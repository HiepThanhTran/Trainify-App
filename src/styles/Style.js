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
      backgroundColor: '#fff',
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
   Header: {},
   HeaderWrap: {
      paddingBottom: 12,
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: Theme.PrimaryColor,
   },
   HeaderTitle: {
      flex: 1,
      marginTop: 12,
      marginLeft: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   HeaderTitleText: {
      fontFamily: Theme.Bold,
      fontSize: 20,
      color: '#fff',
   },
   HeaderButton: {
      height: 40,
      padding: 8,
      marginRight: 12,
      borderRadius: 16,
      backgroundColor: '#eee',
   },
   HeaderButtonText: {
      color: 'black',
      fontFamily: Theme.Bold,
   },
   BackButton: {
      backgroundColor: 'white',
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: '#d5deef',
      marginTop: 12,
      marginLeft: 12,
   },
});

export default GlobalStyle;
