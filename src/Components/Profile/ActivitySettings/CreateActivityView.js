import React from 'react';
import { Alert } from 'react-native';
import { authAPI, endPoints } from '../../../Configs/APIs.js';
import { initalActivity } from '../../../Utils/Fields.js';
import { getTokens } from '../../../Utils/Utilities.js';
import ActivityForm from './ActivityForm.js';

const CreateActivityView = ({ navigation }) => {
   const handleCreateActivity = async (activity) => {
      let form = new FormData();
      for (let [key, field] of Object.entries(activity)) {
         if (field.required && !field.value) {
            Alert.alert('Lỗi', `${field.label} không được trống`);
            return;
         }

         if (!field.required && !field.value) {
            continue;
         }

         form.append(key, field.value);
      }

      const { accessToken } = await getTokens();
      return await authAPI(accessToken).post(endPoints['activities'], form);
   };

   return (
      <ActivityForm
         activityData={initalActivity}
         navigation={navigation}
         isEditMode={false}
         onSubmit={handleCreateActivity}
      />
   );
};

export default CreateActivityView;
