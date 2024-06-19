import React from 'react';
import { Alert } from 'react-native';
import { authAPI, endPoints } from '../../../Configs/APIs.js';
import { initalActivity } from '../../../Utils/Fields.js';
import { getTokens } from '../../../Utils/Utilities.js';
import ActivityForm from './ActivityForm.js';

const CreateActivityView = ({ navigation }) => {
   const handleCreateActivity = async (activity) => {
      let form = new FormData();
      for (let key in activity) {
         if (activity[key].required && !activity[key].value) {
            Alert.alert('Lỗi', `${activity[key].label} không được trống`);
            return;
         }

         if (!activity[key].required && !activity[key].value) {
            continue;
         }

         form.append(key, activity[key].value);
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
