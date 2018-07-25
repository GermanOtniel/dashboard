import firebase from "firebase";
// Initialize Firebase
var config = {
  apiKey: "back",
  authDomain: "filetest-210500.firebaseapp.com",
  databaseURL: "https://filetest-210500.firebaseio.com",
  projectId: "filetest-210500",
  storageBucket: "filetest-210500.appspot.com",
  messagingSenderId: "591063749568"
};
firebase.initializeApp(config);

export default firebase;
