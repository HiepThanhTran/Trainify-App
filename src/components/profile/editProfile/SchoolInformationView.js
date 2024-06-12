import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAccount } from '../../../store/contexts/AccountContext';
import Theme from '../../../styles/Theme';
import { schoolFields } from '../../../utils/Fields';

const SchoolInformationView = ({ navigation }) => {
   const currentAccount = useAccount();

   useEffect(() => {
      navigation.setOptions({ headerRight: null });
   }, [navigation]);

   return (
      <View style={{ ...SchoolInformationViewStyle.SchoolContainer, ...SchoolInformationViewStyle.SectionContainer }}>
         <Text style={SchoolInformationViewStyle.Header}>Thông tin trường</Text>
         {schoolFields.map((f) => {
            const name = currentAccount?.data?.user[f.name] ?? 'Không có';
            return (
               <View key={f.name} style={SchoolInformationViewStyle.SchoolItem}>
                  <Icon color={Theme.PrimaryColor} source={f.icon} size={28} />
                  <View style={{ flex: 1 }}>
                     <Text style={SchoolInformationViewStyle.SchoolItemText}>{`${f.label}: ${name}`}</Text>
                  </View>
               </View>
            );
         })}
      </View>
   );
};

const SchoolInformationViewStyle = StyleSheet.create({
   Header: {
      fontSize: 20,
      marginBottom: 12,
      fontFamily: Theme.Bold,
   },
   SectionContainer: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: Theme.PrimaryColor,
      marginHorizontal: 12,
   },
   SchoolContainer: {
      marginBottom: 20,
      backgroundColor: Theme.SecondaryColor,
   },
   SchoolItem: {
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   SchoolItemText: {
      fontSize: 16,
      marginLeft: 12,
      fontFamily: Theme.SemiBold,
   },
});

export default SchoolInformationView;
