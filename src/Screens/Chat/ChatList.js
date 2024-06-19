import { collection, onSnapshot, or, orderBy, query, where } from 'firebase/firestore';
import { useLayoutEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import DismissKeyboard from '../../Components/Common/DismissKeyboard';
import Loading from '../../Components/Common/Loading';
import { firestore } from '../../Configs/Firebase';
import { useAccount } from '../../Store/Contexts/AccountContext';
import GlobalStyle from '../../Styles/Style';
import Theme from '../../Styles/Theme';

const ChatList = ({ navigation }) => {
   const currentAccount = useAccount();

   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);

   useLayoutEffect(() => {
      const collectionRef = collection(firestore, 'chats');
      const q = query(
         collectionRef,
         orderBy('createdAt', 'desc'),
         or(where('user._id', '==', currentAccount.data.id), where('toUser._id', '==', currentAccount.data.id)),
      );

      setLoading(true);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
         const rawMessages = querySnapshot.docs.map((doc) => ({
            _id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            toUser: doc.data().toUser,
         }));

         const groupedMessages = [];
         const messageMap = {};

         rawMessages.forEach((message) => {
            const userPairKey = `${Math.min(message.user._id, message.toUser._id)}-${Math.max(
               message.user._id,
               message.toUser._id,
            )}`;

            if (!messageMap[userPairKey]) {
               messageMap[userPairKey] = { ...message };
            } else {
               if (new Date(message.createdAt) > new Date(messageMap[userPairKey].createdAt)) {
                  messageMap[userPairKey] = { ...message };
               }
            }
         });

         for (const key in messageMap) {
            groupedMessages.push(messageMap[key]);
         }

         groupedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
         setMessages(groupedMessages);
         setLoading(false);
      });

      return unsubscribe;
   }, []);

   if (loading) return <Loading />;

   return (
      <View style={{ ...GlobalStyle.BackGround, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
         <DismissKeyboard>
            <View style={{ marginHorizontal: 8, marginTop: 8 }}>
               <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                  {messages.map((item, index) => (
                     <TouchableOpacity
                        key={`message-${index}`}
                        onPress={() =>
                           navigation.navigate('ChatStack', {
                              screen: 'Chat',
                              params: { toUser: item.user._id === currentAccount.data.id ? item.toUser : item.user },
                           })
                        }
                     >
                        <View
                           style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 12,
                              marginHorizontal: 12,
                           }}
                        >
                           <View style={{ width: '20%' }}>
                              <Image
                                 source={{
                                    uri:
                                       item.user._id === currentAccount.data.id ? item.toUser.avatar : item.user.avatar,
                                 }}
                                 style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 40,
                                    backgroundColor: Theme.SecondaryColor,
                                 }}
                              />
                           </View>
                           <View style={{ width: '80%' }}>
                              <Text style={{ fontFamily: Theme.SemiBold }}>
                                 {item.user._id === currentAccount.data.id ? item.toUser.fullName : item.user.fullName}
                              </Text>
                              <Text style={{ color: 'gray' }}>{item.text}</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  ))}
               </ScrollView>
            </View>
         </DismissKeyboard>
      </View>
   );
};

export default ChatList;
