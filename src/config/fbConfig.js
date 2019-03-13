import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyA3TTtv2xRmowz6IpAb2Uisf8hQCyEnu5Q",
  authDomain: "twoeasy-signal.firebaseapp.com",
  databaseURL: "https://twoeasy-signal.firebaseio.com",
  projectId: "twoeasy-signal",
  storageBucket: "twoeasy-signal.appspot.com",
  messagingSenderId: "891201655372"
};
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
