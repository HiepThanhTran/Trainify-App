import { Ionicons } from '@expo/vector-icons';
import { addDoc, and, collection, onSnapshot, or, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Icon } from 'react-native-paper';
import { firestore } from '../../Configs/Firebase';
import { useAccount } from '../../Store/Contexts/AccountContext';
import Theme from '../../Styles/Theme';

const Chat = ({ navigation, route }) => {
   const { toUser } = route?.params;
   const currentAccount = useAccount();

   const [messages, setMessages] = useState([]);

   useEffect(() => {
      navigation.setOptions({
         headerLeft: () => (
            <View
               style={{
                  width: '100%',
                  marginRight: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
               }}
            >
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                     activeOpacity={0.8}
                     style={{
                        width: 40,
                        height: 40,
                        marginLeft: 12,
                        marginRight: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                     }}
                     onPress={() => navigation.goBack()}
                  >
                     <Ionicons name="chevron-back" color="white" size={30} />
                  </TouchableOpacity>
                  <Image
                     source={{ uri: toUser?.avatar }}
                     style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: Theme.SecondaryColor,
                     }}
                  />
                  <Text
                     style={{
                        fontSize: 20,
                        color: 'white',
                        marginLeft: 16,
                        fontFamily: Theme.Bold,
                     }}
                  >
                     {toUser?.user?.full_name || toUser?.fullName}
                  </Text>
               </View>
               <View style={{ marginRight: 20 }}>
                  <TouchableOpacity style={{}}>
                     <Icon source="dots-vertical" size={28} color="white" />
                  </TouchableOpacity>
               </View>
            </View>
         ),
      });
   }, [navigation]);

   useLayoutEffect(() => {
      let toUserID = toUser?.id || toUser?._id;
      let fromUserID = currentAccount.data.id;

      const collectionRef = collection(firestore, 'chats');
      const q = query(
         collectionRef,
         orderBy('createdAt', 'desc'),
         or(
            and(where('toUser._id', '==', toUserID), where('user._id', '==', fromUserID)),
            and(where('toUser._id', '==', fromUserID), where('user._id', '==', toUserID)),
         ),
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
         setMessages(
            querySnapshot.docs.map((doc) => ({
               _id: doc.data()._id,
               createdAt: doc.data().createdAt.toDate(),
               text: doc.data().text,
               user: doc.data().user,
               toUser: doc.data().toUser,
            })),
         );
      });

      return unsubscribe;
   }, []);

   const onSend = useCallback((messages = []) => {
      setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
      const { _id, createdAt, text, user } = messages[0];
      addDoc(collection(firestore, 'chats'), {
         _id,
         createdAt,
         text,
         user,
         toUser: {
            _id: toUser?.id || toUser?._id,
            fullName: toUser?.user?.full_name || toUser?.fullName,
            avatar: toUser?.avatar,
         },
      });
   }, []);

   return (
      <ImageBackground source={require('../../Assets/Images/ChatBackground.jpg')} style={{ flex: 1 }}>
         <GiftedChat
            messages={messages}
            showUserAvatar={true}
            showAvatarForEveryMessage={false}
            onSend={(messages) => onSend(messages)}
            user={{
               _id: currentAccount.data.id,
               fullName: currentAccount.data.user.full_name,
               avatar: currentAccount.data.avatar,
            }}
         />
      </ImageBackground>
   );
};

export default Chat;
