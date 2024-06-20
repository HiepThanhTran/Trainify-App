import React from 'react';
import { Alert } from 'react-native';
import { authAPI, endPoints } from '../../../Configs/APIs';
import { initialActivity } from '../../../Utils/Fields';
import { getTokens } from '../../../Utils/Utilities';
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
         activityData={initialActivity}
         navigation={navigation}
         isEditMode={false}
         onSubmit={handleCreateActivity}
      />
   );
};

export default CreateActivityView;
