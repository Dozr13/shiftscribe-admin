// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAi3VNkSdKVXzYousXdwJEQHg1Ycld1NXE',
  authDomain: 'shiftscribe-1666d.firebaseapp.com',
  databaseURL: 'https://shiftscribe-1666d-default-rtdb.firebaseio.com',
  projectId: 'shiftscribe-1666d',
  storageBucket: 'shiftscribe-1666d.appspot.com',
  messagingSenderId: '1089687742419',
  appId: '1:1089687742419:web:c0b437b9caa5dbe15df126',
  measurementId: 'G-8CE2L7G6JW',
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: browserLocalPersistence,
});

export const auth = getAuth();
