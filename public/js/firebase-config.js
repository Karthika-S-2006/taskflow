
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZuuytmiWYG778datEnrROZJeeQQztLzg",
  authDomain: "taskflow-332de.firebaseapp.com",
  projectId: "taskflow-332de",
  storageBucket: "taskflow-332de.firebasestorage.app",
  messagingSenderId: "1057270407977",
  appId: "1:1057270407977:web:21ffcb84493e9a1470cd38",
  measurementId: "G-GQR2J9265K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
