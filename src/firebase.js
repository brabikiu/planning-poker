
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'


export const db = getFirestore(app)t firebaseConfig = {
  apiKey: "AIzaSyCpOu8fwq8GfCxh3BrG5B1gFhIWSweQPa0",
  authDomain: "planning-poker-1b5a8.firebaseapp.com",
  projectId: "planning-poker-1b5a8",
  storageBucket: "planning-poker-1b5a8.firebasestorage.app",
  messagingSenderId: "1060374744733",
  appId: "1:1060374744733:web:0ad48910e2f4f1161cce74"
};


const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()