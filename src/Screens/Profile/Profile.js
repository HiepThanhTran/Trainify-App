import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Loading from '../../Components/Common/Loading';
import SectionItem from '../../Components/Common/SectionItem';
import { auth } from '../../Configs/Firebase';
import { SignOutAction } from '../../Store/Actions/AccountAction';
import { useAccount, useAccountDispatch } from '../../Store/Contexts/AccountContext';
import GlobalStyle, { screenHeight, screenWidth } from '../../Styles/Style';
import Theme from '../../Styles/Theme';
import { profileSections } from '../../Utils/Fields';
import { removeTokens } from '../../Utils/Utilities';

const Profile = ({ navigation }) => {
   const dispatch = useAccountDispatch();
   const currentAccount = useAccount();

   const [isRendered, setIsRendered] = useState(false);

   useEffect(() => {
      setIsRendered(true);
   }, []);

   const handleSignout = () => {
      Alert.alert(
         'Đăng xuất',
         'Bạn chắc chắn muốn đăng xuất?',
         [
            {
               text: 'Đăng xuất',
               onPress: () => {
                  signOut(auth).catch((error) => {
                     console.error('Error logging out: ', error);
                     Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
                  });
                  removeTokens();
                  dispatch(SignOutAction());
               },
            },
            {
               text: 'Hủy',
               style: 'cancel',
            },
         ],
         { cancelable: true },
      );
   };

   const goToScreen = ({ screen, params, otherStack, otherTab }) => {
      if (otherStack) {
         navigation.navigate(otherStack, { screen, params });
      } else if (otherTab) {
         navigation.navigate(otherTab, params);
      } else {
         navigation.navigate('ProfileStack', { screen, params });
      }
   };

   if (!isRendered) return <Loading />;

   return (
      <LinearGradient
         style={{ flex: 1 }}
         end={{ x: 0.5, y: 0.5 }}
         colors={['rgba(62,154,228,1)', 'rgba(255,255,255, 0.8)']}
      >
         <ScrollView
            bounces={false}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            //    useNativeDriver: false,
            // })}
         >
            <View style={{ ...GlobalStyle.Container, ...ProfileStyle.Header }}>
               <Image style={ProfileStyle.Avatar} source={{ uri: currentAccount.data.avatar }} />
               <View style={{ ...GlobalStyle.Center, marginTop: 8 }}>
                  <Text style={{ ...GlobalStyle.Bold, fontSize: 24 }}>{currentAccount.data.user.full_name}</Text>
                  <Text style={{ ...GlobalStyle.Medium, color: 'gray', fontSize: 16 }}>
                     {currentAccount.data.user.code}
                  </Text>
               </View>
               <TouchableOpacity
                  onPress={() =>
                     goToScreen({ screen: 'EditProfile', params: { fullName: currentAccount.data.user.full_name } })
                  }
                  style={{ ...GlobalStyle.Center, ...ProfileStyle.HeaderButton }}
               >
                  <Text style={ProfileStyle.ButtonText}>Trang cá nhân</Text>
                  <Icon color="white" source="chevron-right" size={20} />
               </TouchableOpacity>
            </View>

            {profileSections(currentAccount).map((section, index) => {
               if (section.roles.includes(currentAccount.data.role)) {
                  return (
                     <View key={'section-' + index} style={ProfileStyle.Section}>
                        <Text style={ProfileStyle.SectionTitle}>{section.title}</Text>
                        <View style={ProfileStyle.SectionBody}>
                           {section.items.map((item, itemIndex) => {
                              if (item.roles) {
                                 if (item.roles.includes(currentAccount.data.role)) {
                                    return (
                                       <SectionItem key={'item-' + itemIndex} instance={item} onPress={goToScreen} />
                                    );
                                 }
                              } else {
                                 return <SectionItem key={'item-' + itemIndex} instance={item} onPress={goToScreen} />;
                              }
                           })}
                        </View>
                     </View>
                  );
               }
            })}

            <View style={{ ...GlobalStyle.Center, ...ProfileStyle.Footer }}>
               <TouchableOpacity
                  onPress={handleSignout}
                  style={{ ...GlobalStyle.Center, ...ProfileStyle.FooterButton }}
               >
                  <Icon color="white" source="logout" size={20} />
                  <Text style={ProfileStyle.ButtonText}>Đăng xuất</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </LinearGradient>
   );
};

const ProfileStyle = StyleSheet.create({
   Header: {
      backgroundColor: Theme.SecondaryColor,
      marginTop: screenHeight * 0.05,
      height: screenHeight * 0.25,
      borderRadius: 16,
      marginHorizontal: 12,
   },
   HeaderAnimated: {
      position: 'absolute',
      top: -200,
      left: 0,
      right: 0,
      opacity: 1,
      ...Platform.select({
         android: {
            elevation: 3,
         },
         ios: {
            shadowColor: '#a8bed2',
            shadowOpacity: 1,
            shadowRadius: 16,
            shadowOffset: {
               width: 4,
               height: 3,
            },
         },
      }),
   },
   Avatar: {
      marginTop: -screenHeight * 0.1,
      width: screenWidth * 0.3,
      height: screenWidth * 0.3,
      borderWidth: 4,
      borderRadius: (screenWidth * 0.3) / 2,
      borderColor: 'white',
      backgroundColor: Theme.SecondaryColor,
   },
   HeaderButton: {
      position: 'absolute',
      bottom: 0,
      padding: 8,
      width: '100%',
      flexDirection: 'row',
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      backgroundColor: Theme.PrimaryColor,
   },
   HeaderButtonAnimated: {
      padding: 12,
      width: '100%',
      flexDirection: 'row',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      backgroundColor: '#273238',
   },
   ButtonText: {
      color: 'white',
      fontSize: 14,
      fontFamily: Theme.Bold,
      marginHorizontal: 8,
   },
   Footer: {
      marginVertical: 16,
   },
   FooterButton: {
      width: '60%',
      flexDirection: 'row',
      backgroundColor: Theme.PrimaryColor,
      padding: 12,
      borderRadius: 12,
   },
   Section: {
      marginTop: 40,
      marginHorizontal: 12,
   },
   SectionTitle: {
      textTransform: 'uppercase',
      fontFamily: Theme.SemiBold,
      fontSize: 16,
   },
   SectionBody: {
      borderWidth: 1,
      marginTop: 12,
      borderRadius: 8,
      borderColor: '#eee',
      overflow: 'hidden',
      borderBottomWidth: 0,
   },
});

export default Profile;
