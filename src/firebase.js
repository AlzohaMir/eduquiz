import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "",
    authDomain: "eduquizhub-b4693.firebaseapp.com",
    projectId: "eduquizhub-b4693",
    storageBucket: "eduquizhub-b4693.firebasestorage.app",
    messagingSenderId: "929984299381",
    appId: "1:929984299381:web:15b09da5a8eb6f29bf933c"
  };

  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
