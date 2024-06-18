import { StyleSheet } from 'react-native';
import Theme from '../../../Styles/Theme';

const ActivitySettingsFormStyle = StyleSheet.create({
   FormContainer: {
      marginBottom: 24,
      paddingVertical: 20,
      paddingHorizontal: 16,
   },
   InputRow: {
      flexDirection: 'row',
   },
   InputContainer: {
      flex: 1,
      width: '100%',
      marginBottom: 20,
   },
   InputTitle: {
      flexDirection: 'row',
      marginBottom: 12,
      alignItems: 'center',
   },
   InputTitleText: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      marginLeft: 8,
   },
   InputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderRadius: 8,
      paddingHorizontal: 10,
      borderColor: Theme.PrimaryColor,
      backgroundColor: Theme.SecondaryColor,
   },
   TextInput: {
      flex: 1,
      padding: 10,
      color: 'black',
   },

   PickerWrapper: {
      flex: 1,
      height: 48,
      color: 'black',
      justifyContent: 'center',
   },
   Picker: {
      height: '100%',
      width: '100%',
      color: 'black',
   },
   ImageContainer: {
      height: 200,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: Theme.PrimaryColor,
   },
   Image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
   },
   ImageTitle: {
      fontFamily: Theme.SemiBold,
      fontSize: 16,
   },
   RichEditor: {
      height: 200,
      borderWidth: 2,
      borderColor: Theme.PrimaryColor,
   },
   RichEditorToolbar: {
      backgroundColor: Theme.PrimaryColor,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
   },

   ButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20,
   },
   Button: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ff0000',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
   },
   ButtonText: {
      fontFamily: Theme.Bold,
      fontSize: 16,
      color: '#eee',
   },
});

export default ActivitySettingsFormStyle;
