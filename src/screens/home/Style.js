import { StyleSheet } from 'react-native';
import { screenHeight } from '../../styles/Style';
import Theme from '../../styles/Theme';

const HomeStyle = StyleSheet.create({
   Image: {
      width: '100%',
      height: screenHeight / 3,
   },
   Body: {
      flex: 1,
      padding: 20,
      marginTop: -30,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: 'white',
   },
   Header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   HeaderTitle: {
      fontSize: 28,
      color: Theme.PrimaryColor,
      fontFamily: Theme.Bold,
   },
   HeaderText: {
      flex: 1,
      flexWrap: 'wrap',
      fontSize: 24,
      fontFamily: Theme.Bold,
   },
   TabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderTopWidth: 0.5,
      marginVertical: 12,
      justifyContent: 'space-between',
   },
   TabItem: {
      marginHorizontal: 12,
      paddingVertical: 16,
   },
   TabText: {
      fontSize: 16,
      fontFamily: Theme.SemiBold,
   },
   DetailsContainer: {},
   DetailsWrap: {
      marginBottom: 12,
      flexDirection: 'row',
   },
   DetailsItem: {
      width: '50%',
      alignItems: 'center',
      flexDirection: 'row',
   },
   DetailsIcon: {
      padding: 8,
      marginRight: 12,
      borderRadius: 8,
      backgroundColor: 'lightgrey',
   },
   Details: {
      flex: 1,
   },
   DetailsText: {
      fontSize: 16,
   },
   DetailsValue: {
      fontSize: 16,
      fontWeight: '700',
   },
   DetailsCreatedBy: {
      fontStyle: 'italic',
      color: 'gray',
      fontWeight: 'normal',
   },
   DetailsDescription: {
      fontSize: 16,
      lineHeight: 28,
      fontFamily: Theme.Regular,
   },
   MoreButton: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      color: 'grey',
   },
});

export default HomeStyle;
