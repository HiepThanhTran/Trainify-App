import { StyleSheet, TextInput, View } from 'react-native';
import Theme from '../../styles/Theme';

const Searchbar = ({ placeholder, value, onChangeText }) => {
   return (
      <View style={SearchbarStyle.Searchbar}>
         <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            style={SearchbarStyle.SearchInput}
         />
      </View>
   );
};

const SearchbarStyle = StyleSheet.create({
   Searchbar: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: Theme.PrimaryColor,
      borderRadius: 10,
      padding: 12,
      marginTop: 20,
      marginBottom: 20,
   },
   SearchInput: {
      width: '100%',
      fontSize: 15,
      fontFamily: Theme.SemiBold,
   },
});

export default Searchbar;
