import { AntDesign, Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { authAPI, endPoints } from '../../../configs/APIs';
import { statusCode } from '../../../configs/Constants';
import { useAccountDispatch } from '../../../store/contexts/AccountContext';
import GlobalStyle from '../../../styles/Style';
import Theme from '../../../styles/Theme';
import { getTokens, refreshAccessToken } from '../../../utils/Utilities';

const OptionsModal = memo((props) => {
   const dispatch = useAccountDispatch();

   const handleDeleteComment = async () => {
      props?.setModalVisible(true);
      props?.setModalSettingsVisible(false);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let res = await authAPI(accessToken).delete(endPoints['comment-detail'](props?.selectedComment.id));

         if (res.status === statusCode.HTTP_204_NO_CONTENT) {
            props?.setComments(props?.comments.filter((c) => c.id !== props?.selectedComment.id));
         }
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_401_UNAUTHORIZED) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) handleDeleteComment();
         } else console.error('Delete comment', error);
      } finally {
         props?.setModalVisible(false);
      }
   };

   const alertDeleteComment = () => {
      Alert.alert(
         'Xóa bình luận',
         'Hành động không thể hoàn tác, tiếp tục?',
         [
            {
               text: 'Xóa',
               onPress: () => handleDeleteComment(),
            },
            { text: 'Hủy', style: 'cancel' },
         ],
         { cancelable: true },
      );
   };

   return (
      <Portal>
         <Modal visible={props?.modalSettingsVisible} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={() => props?.setModalSettingsVisible(false)}>
               <View style={GlobalStyle.ModalContainer}>
                  <View style={OptionsModalStyle.Options}>
                     <TouchableOpacity
                        onPress={() => props?.setModalEditCommentVisible(true)}
                        style={{ ...OptionsModalStyle.OptionsWrap, padding: 28 }}
                     >
                        <AntDesign name="edit" color="black" size={24} />
                        <Text style={OptionsModalStyle.OptionsText}>Chỉnh sửa bình luận</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        onPress={alertDeleteComment}
                        style={{
                           ...OptionsModalStyle.OptionsWrap,
                           paddingHorizontal: 28,
                           paddingBottom: 28,
                        }}
                     >
                        <Ionicons name="trash" color="black" size={24} />
                        <Text style={OptionsModalStyle.OptionsText}>Xóa bình luận</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </TouchableWithoutFeedback>
         </Modal>
      </Portal>
   );
});

const OptionsModalStyle = StyleSheet.create({
   Options: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: '#fff',
   },
   OptionsWrap: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   OptionsText: {
      fontFamily: Theme.SemiBold,
      fontSize: 20,
      marginLeft: 16,
      color: 'black',
   },
});

export default OptionsModal;
