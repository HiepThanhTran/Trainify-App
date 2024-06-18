import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { authAPI, endPoints } from '../../../Configs/APIs';
import { statusCode } from '../../../Configs/Constants';
import { useAccountDispatch } from '../../../Store/Contexts/AccountContext';
import GlobalStyle from '../../../Styles/Style';
import Theme from '../../../Styles/Theme';
import { getTokens, refreshAccessToken } from '../../../Utils/Utilities';

const OptionsModal = (props) => {
   const dispatch = useAccountDispatch();

   const handleDeleteComment = async () => {
      props?.setModalVisible(true);
      props?.setModalSettingsVisible(false);
      const { accessToken, refreshToken } = await getTokens();
      try {
         let response = await authAPI(accessToken).delete(endPoints['comment-detail'](props?.selectedComment.id));

         if (response.status === statusCode.HTTP_204_NO_CONTENT) {
            props?.setComments(props?.comments.filter((c) => c.id !== props?.selectedComment.id));
         }
      } catch (error) {
         if (
            error.response &&
            (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
               error.response.status === statusCode.HTTP_403_FORBIDDEN)
         ) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) {
               handleDeleteComment();
            }
         } else {
            console.error('Delete comment:', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         }
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
            {
               text: 'Hủy',
               style: 'cancel',
            },
         ],
         { cancelable: true },
      );
   };

   return (
      <Portal>
         <Modal
            visible={props?.modalSettingsVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => props?.setModalSettingsVisible(false)}
         >
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
};

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
