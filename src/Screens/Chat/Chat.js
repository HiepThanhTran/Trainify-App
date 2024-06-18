import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { firestore } from '../../Configs/Firebase';
import { useAccount } from '../../Store/Contexts/AccountContext';

const Chat = ({ navigation, route }) => {
   const { user } = route?.params;
   const currentAccount = useAccount();

   const [messages, setMessages] = useState([]);

   useEffect(() => {
      navigation.setOptions({
         headerLeft: () => (
            <TouchableOpacity
               style={{ marginRight: 12 }}
               onPress={() =>
                  navigation.navigate('ProfileStack', {
                     screen: 'EditProfile',
                  })
               }
            >
               <Image source={{ uri: user.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            </TouchableOpacity>
         ),
      });
   }, [navigation]);

   useLayoutEffect(() => {
      const collectionRef = collection(firestore, 'chats');
      const q = query(collectionRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
         setMessages(
            querySnapshot.docs.map((doc) => ({
               _id: doc.data()._id,
               createdAt: doc.data().createdAt.toDate(),
               text: doc.data().text,
               user: doc.data().user,
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
      });
   }, []);

   return (
      <GiftedChat
         messages={messages}
         showAvatarForEveryMessage={false}
         onSend={(messages) => onSend(messages)}
         messagesContainerStyle={{
            backgroundColor: '#fff',
         }}
         textInputStyle={{
            backgroundColor: '#fff',
            borderRadius: 20,
         }}
         user={{
            // _id: auth?.currentUser?.email,
            _id: currentAccount.data.id,
            avatar: currentAccount.data.avatar,
         }}
      />
   );
};

export default Chat;
