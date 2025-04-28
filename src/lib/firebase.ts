import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBT5mRhSmtqoRnBxyJml-U4m3ppSx0YtjY",
  authDomain: "my-scheduler-b537f.firebaseapp.com",
  projectId: "my-scheduler-b537f",
  storageBucket: "my-scheduler-b537f.firebasestorage.app",
  messagingSenderId: "423998612043",
  appId: "1:423998612043:web:5cf5b16b32771a8673a3ce",
  measurementId: "G-PB3QGGBH0G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
