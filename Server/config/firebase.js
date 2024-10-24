// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxF9GOgBH_tZTyURvfSFHlTVnE-pD1DGk",
  authDomain: "employee-task-manager-d834e.firebaseapp.com",
  projectId: "employee-task-manager-d834e",
  storageBucket: "employee-task-manager-d834e.appspot.com",
  messagingSenderId: "676077519375",
  appId: "1:676077519375:web:65b1dba6cf356305da197a",
  measurementId: "G-06Z2QV7GZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app, auth};