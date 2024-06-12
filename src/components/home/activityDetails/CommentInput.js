import { FontAwesome } from '@expo/vector-icons';
import { memo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { RichEditor } from 'react-native-pell-rich-editor';
import { authAPI, endPoints } from '../../../configs/APIs';
import { statusCode } from '../../../configs/Constants';
import { useAccountDispatch } from '../../../store/contexts/AccountContext';
import Theme from '../../../styles/Theme';
import { getTokens, refreshAccessToken } from '../../../utils/Utilities';

const CommentInput = memo((props) => {
   const dispatch = useAccountDispatch();

   const refScrollView = useRef(ScrollView);

   const [newComment, setNewComment] = useState('');

   const handleAddComment = async () => {
      if (!newComment) return;

      let form = new FormData();
      form.append('content', newComment);

      props?.setModalVisible(true);
      props?.refEditorComment?.current?.dismissKeyboard();
      const { accessToken, refreshToken } = await getTokens();
      try {
         let res = await authAPI(accessToken).post(endPoints['activity-comments'](props?.activityID), form, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         if (res.status === statusCode.HTTP_201_CREATED) {
            setNewComment('');
            props?.setComments((prevComments) => [res.data, ...prevComments]);
            props?.refEditorComment?.current?.setContentHTML('');
         }
      } catch (error) {
         if (error.response && error.response.status === statusCode.HTTP_401_UNAUTHORIZED) {
            const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
            if (newAccessToken) handleAddComment();
         } else console.error('Add commnet', error);
      } finally {
         props?.setModalVisible(false);
      }
   };

   const handleRichTextOnChange = (value) => {
      setNewComment(value);
      refScrollView?.current?.scrollToEnd();
   };

   return (
      <Portal>
         <View style={CommentInputStyle.CommentInput}>
            <ScrollView
               ref={refScrollView}
               style={CommentInputStyle.RichText}
               showsVerticalScrollIndicator={false}
               showsHorizontalScrollIndicator={false}
            >
               <RichEditor
                  ref={props?.refEditorComment}
                  onChange={handleRichTextOnChange}
                  placeholder="Nhập bình luận của bạn..."
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  style={{ borderRadius: 16, overflow: 'hidden' }}
                  editorStyle={{ backgroundColor: '#d5deef', placeholderColor: 'gray' }}
               />
            </ScrollView>
            <TouchableOpacity style={CommentInputStyle.SendIcon} onPress={handleAddComment}>
               <FontAwesome name="send" size={24} color={Theme.PrimaryColor} />
            </TouchableOpacity>
         </View>
      </Portal>
   );
});

const CommentInputStyle = StyleSheet.create({
   CommentInput: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      zIndex: 999,
      bottom: 0,
      backgroundColor: 'white',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: 'grey',
   },
   RichText: {
      flex: 1,
      minHeight: 40,
      maxHeight: 80,
      overflow: 'hidden',
   },
   SendIcon: {
      marginLeft: 10,
      padding: 5,
   },
});

export default CommentInput;
