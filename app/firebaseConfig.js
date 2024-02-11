// import firebase from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyDMHMy2iKC01XY9vhTLlewuiFYgpoDSFaQ",
  authDomain: "checklist-a7cd6.firebaseapp.com",
  projectId: "checklist-a7cd6",
  storageBucket: "checklist-a7cd6.appspot.com",
  messagingSenderId: "105249621291",
  appId: "1:105249621291:web:3b8358386edacef79a316e",
  measurementId: "G-QECP31RQD5"
};
  
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};