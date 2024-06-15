import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useAccount } from '../../../store/contexts/AccountContext';
import Theme from '../../../styles/Theme';
import { schoolFields } from '../../../utils/Fields';
import Loading from '../../common/Loading';

const SchoolView = ({ navigation }) => {
   const currentAccount = useAccount();

   const [isRendered, setIsRedered] = useState(false);

   useEffect(() => {
      navigation.setOptions({ headerRight: null });

      setTimeout(() => {
         setIsRedered(true);
      }, 500);
   }, [navigation]);

   if (!isRendered) return <Loading />;

   return (
      <View style={{ ...SchoolViewStyle.SchoolContainer, ...SchoolViewStyle.SectionContainer }}>
         <Text style={SchoolViewStyle.Header}>Thông tin trường</Text>
         {schoolFields.map((f) => {
            const name = currentAccount?.data?.user[f.name] ?? 'Không có';
            return (
               <View key={f.name} style={SchoolViewStyle.SchoolItem}>
                  <Icon color={Theme.PrimaryColor} source={f.icon} size={28} />
                  <View style={{ flex: 1 }}>
                     <Text style={SchoolViewStyle.SchoolItemText}>{`${f.label}: ${name}`}</Text>
                  </View>
               </View>
            );
         })}
      </View>
   );
};

const SchoolViewStyle = StyleSheet.create({
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

export default SchoolView;
