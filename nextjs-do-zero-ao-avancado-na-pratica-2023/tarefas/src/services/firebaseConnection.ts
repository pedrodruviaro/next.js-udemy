import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDnuhwVTSTOHuNNkiGq3_XDf6F2mw8qjqU",
    authDomain: "tarefasplus-d102e.firebaseapp.com",
    projectId: "tarefasplus-d102e",
    storageBucket: "tarefasplus-d102e.appspot.com",
    messagingSenderId: "877541124071",
    appId: "1:877541124071:web:1aefa84f126afcd2a97f42",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();

export { db };
