// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth/react-native';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDAi22quoFkTHAaPrn_urIB-457cKT1TAs',
    authDomain: 'training-point-management.firebaseapp.com',
    projectId: 'training-point-management',
    storageBucket: 'training-point-management.appspot.com',
    messagingSenderId: '556643709558',
    appId: '1:556643709558:web:129a35c486b38a1293e557',
    measurementId: 'G-GX9XXJRYX9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
