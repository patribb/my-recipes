import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCGrMtcW_UXhgzTzH87a_u_XfRYLzV1t1U",
    authDomain: "my-recipes-eb1f3.firebaseapp.com",
    projectId: "my-recipes-eb1f3",
    storageBucket: "my-recipes-eb1f3.appspot.com",
    messagingSenderId: "503444536791",
    appId: "1:503444536791:web:4391f52bf8b5deb6145f92"
  };

// initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };