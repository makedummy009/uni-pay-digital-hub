// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth , GoogleAuthProvider} from "firebase/auth"
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnF04CsOWkkkXuh990VoogN0Lva5TAuxw",
  authDomain: "login-auth-488a5.firebaseapp.com",
  projectId: "login-auth-488a5",
  storageBucket: "login-auth-488a5.firebasestorage.app",
  messagingSenderId: "642085718429",
  appId: "1:642085718429:web:5a104dd4ba106c9bb14774",
  measurementId: "G-DE3T6ZR6EW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
// export {app , analytics};
