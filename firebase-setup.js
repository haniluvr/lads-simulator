// Initialize Firebase using the compat libraries loaded in index.html

const firebaseConfig = {
  apiKey: "AIzaSyDoeJzZtkT2XOBkTtVkhWm7fWl9XgZVXPY",
  authDomain: "lads-simulator.firebaseapp.com",
  projectId: "lads-simulator",
  storageBucket: "lads-simulator.firebasestorage.app",
  messagingSenderId: "458327612687",
  appId: "1:458327612687:web:8f131858a825df3a01f27a",
  measurementId: "G-65JRVG4RZG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();
const auth = firebase.auth();

window.db = db;
window.auth = auth;
