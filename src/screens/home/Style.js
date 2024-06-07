import { StyleSheet } from 'react-native';
import { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';

const ActivityStyle = StyleSheet.create({
   Container: {
      marginHorizontal: 12,
      marginTop: 32,
   },
   Header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   Title: {
      fontSize: 28,
      color: Theme.PrimaryColor,
      fontFamily: Theme.Bold,
   },
   DetailContainer: {
      borderWidth: 1,
      borderColor: Theme.PrimaryColor,
      padding: 10,
      borderRadius: 16,
      marginTop: 20,
   },
   DetailImage: {
      justifyContent: 'center',
      width: '100%',
      height: screenHeight / 4,
   },
   ImageDetail: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
   },
   DetailDescription: {
      fontSize: 18,
      fontFamily: Theme.Regular,
      lineHeight: 30,
      marginTop: 8,
      marginBottom: 20,
   },
   AcitivityDetailText: {
      fontSize: 18,
      fontFamily: Theme.SemiBold,
      marginBottom: 10,
   },
   MoreButton: {
      fontFamily: Theme.Bold,
      fontSize: 17.2,
      marginTop: -15,
      marginBottom: 10,
   },
   DetailDate: {
      fontSize: 13.2,
      fontFamily: Theme.SemiBold,
      color: 'gray',
   },

   RichEditorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: Theme.PrimaryColor,
   },
   RichText: {
      flex: 1,
      minHeight: 40,
      borderRightWidth: 1,
      borderRightColor: Theme.PrimaryColor,
      paddingRight: 10,
   },
   SendIcon: {
      marginLeft: 10,
      padding: 5,
   },
   ReactContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
   },
   Like: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
   },
   LikeDetail: {
      fontFamily: Theme.Bold,
      fontSize: 18,
      marginLeft: 8,
   },

   Card: {
      flexDirection: 'column',
      marginBottom: 20,
      borderWidth: 1,
      padding: 12,
      borderRadius: 16,
      borderColor: Theme.PrimaryColor,
   },
   CardImage: {
      justifyContent: 'center',
      width: '100%',
      height: screenHeight / 4,
   },
   Image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
   },
   CardTitle: {
      fontSize: 24,
      marginVertical: 12,
      fontFamily: Theme.Bold,
   },
   CardDescription: {
      width: '100%',
      fontSize: 20,
      fontFamily: Theme.Regular,
   },
   CardDate: {
      fontSize: 16,
      marginVertical: 12,
      fontFamily: Theme.SemiBold,
   },
});

export default ActivityStyle;
