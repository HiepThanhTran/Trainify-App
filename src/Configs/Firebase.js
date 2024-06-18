// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: 'AIzaSyBvuH0mr_6ZuLW3-u1GyYiBuyfTz_sF5PQ',
   authDomain: 'tpmchat-8c705.firebaseapp.com',
   projectId: 'tpmchat-8c705',
   storageBucket: 'tpmchat-8c705.appspot.com',
   messagingSenderId: '483024035539',
   appId: '1:483024035539:web:1f5e32556672048aad7e26',
   databaseUrRL: 'https://tpmchat-8c705-default-rtdb.firebaseio.com/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(AsyncStorage),
});
export { auth };

export const database = getDatabase(app);
export const firestore = getFirestore(app);
