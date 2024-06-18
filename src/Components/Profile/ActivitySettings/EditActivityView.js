import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { authAPI, endPoints } from '../../../Configs/APIs.js';
import { statusCode } from '../../../Configs/Constants.js';
import { initalActivity } from '../../../Utils/Fields.js';
import { getTokens, mapValues, refreshAccessToken } from '../../../Utils/Utilities.js';
import Loading from '../../Common/Loading.js';
import ActivityForm from './ActivityForm.js';

const EditActivityView = ({ navigation, route }) => {
   const { activityID } = route?.params;

   const [activityData, setActivityData] = useState(initalActivity);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const loadActivity = async () => {
         if (!activityID) return;

         setLoading(true);
         try {
            const { accessToken } = await getTokens();
            let response = await authAPI(accessToken).get(endPoints['activity-detail'](activityID));

            if (response.status === statusCode.HTTP_200_OK) {
               setActivityData(mapValues(initalActivity, response.data));
            }
         } catch (error) {
            console.error('Activity details of edit', error);
            Alert.alert('Thông báo', 'Hệ thống đang bận, vui lòng thử lại sau!');
         } finally {
            setLoading(false);
         }
      };

      loadActivity();
   }, []);

   const handleEditActivity = async (activity) => {
      let form = new FormData();
      for (let [key, field] of Object.entries(activity)) {
         if (field.required && !field.value) {
            Alert.alert('Thông báo', `${field.label} không được trống`);
            return;
         }

         if (!field.required && !field.value) {
            continue;
         }

         if (key === 'image' && typeof field.value === 'string') {
            continue;
         }

         form.append(key, field.value);
      }

      const { accessToken } = await getTokens();
      return await authAPI(accessToken).patch(endPoints['activity-detail'](activityID), form);
   };

   const handleDeleteActivity = () => {
      Alert.alert('Cảnh báo', 'Hành động không thể hoàn tác, tiếp tục?', [
         {
            text: 'Xóa',
            onPress: () => deleteActivity(),
         },
         {
            text: 'Hủy',
            style: 'cancel',
         },
      ]);

      const deleteActivity = async () => {
         const { accessToken, refreshToken } = await getTokens();
         try {
            let response = await authAPI(accessToken).delete(endPoints['activity-detail'](activityID));

            if (response.status === statusCode.HTTP_204_NO_CONTENT) {
               Alert.alert('Thông báo', 'Xóa hoạt động thành công!', [
                  {
                     text: 'OK',
                     onPress: () => navigation.goBack(),
                  },
               ]);
            }
         } catch (error) {
            if (
               error.response &&
               (error.response.status === statusCode.HTTP_401_UNAUTHORIZED ||
                  error.response.status === statusCode.HTTP_403_FORBIDDEN)
            ) {
               const newAccessToken = await refreshAccessToken(refreshToken, dispatch);
               if (newAccessToken) {
                  handleUpdateProfile();
               }
            } else {
               console.error(error);
               Alert.alert('Thông báo', 'Có lỗi xảy ra khi cập nhật hoạt động');
            }
         } finally {
         }
      };
   };

   if (loading) return <Loading />;

   return (
      <ActivityForm
         activityData={activityData}
         navigation={navigation}
         isEditMode={true}
         onSubmit={handleEditActivity}
         onDelete={handleDeleteActivity}
      />
   );
};

export default EditActivityView;
