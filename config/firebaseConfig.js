import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var config = {
  apiKey: "AIzaSyDMfJroPPu9TOi6SPXZ3cR7ncvBXSML5yo",
  authDomain: "youvincy-football-app.firebaseapp.com",
  databaseURL: "https://youvincy-football-app.firebaseio.com",
  projectId: "youvincy-football-app",
  storageBucket: "youvincy-football-app.appspot.com",
  messagingSenderId: "832964454378",
  appId: "1:832964454378:web:597a10ce1b594814617493"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();

export default db;
