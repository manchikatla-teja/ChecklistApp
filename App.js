import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './app/TabNavigation/TabNavigation';
import change from './app/global/global'
import {firebase} from './app/firebaseConfig'
// import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDMHMy2iKC01XY9vhTLlewuiFYgpoDSFaQ",
  authDomain: "checklist-a7cd6.firebaseapp.com",
  projectId: "checklist-a7cd6",
  storageBucket: "checklist-a7cd6.appspot.com",
  messagingSenderId: "105249621291",
  appId: "1:105249621291:web:3b8358386edacef79a316e",
  measurementId: "G-QECP31RQD5"
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
       <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

       <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
}

// const storeUser = async (userJSON) => {
//   try {
//     await AsyncStorage.setItem('user', userJSON);
//     console.log('User stored successfully in Async Storage!');
//   } catch (error) {
//     console.error('Error storing user:', error);
//   }
// };

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  change('set', user);
  // const userJSON = JSON.stringify(user);
  // storeUser(userJSON);
  return (
    <>
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Company</Text>
      {/* <Text style={styles.emailText}>{user.email}</Text> */}
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
      
      
      <TabNavigation />
      </>
  );
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
        const todoRef = firebase.firestore().collection('users');
        const userExists = todoRef.where('useremail', '==', user.email);
        const userInfo = {userID:user.uid, useremail:user.email};
        userExists.get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
      // If no matching documents found, add the user information
          todoRef.add(userInfo)
        .then(() => {
          //console.log('User information added successfully');
        })
        .catch((err) => {
          console.error('Error adding user information:', err);
        });
    } else {
      // User information already exists in the collection
      //console.log('User information already exists');
    }
  })
  .catch((err) => {
    console.error('Error checking user information:', err);
  });
        // console.log("inside a user", userExists);
        // const userInfo = {userID:user.uid, useremail:user.email};
        // todoRef.add(userInfo).then(()=>{}).catch((err)=>console.log(err));
      }
     );

    return () => unsubscribe();
  }, [auth]);

  
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        change('set', '');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <NavigationContainer>
      {user ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
        />
      )}
    </NavigationContainer>
  );


  // return (
  //   <NavigationContainer>
  //     <TabNavigation />
  //   </NavigationContainer>
  // );

}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 18,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight:16,
    marginLeft: 16,
    borderRadius: 8,
    elevation: 3,
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent:'center',
    // alignContent:'space-between'
  },
  headerContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 38,
    marginBottom: 4,
    marginRight:16,
    marginLeft: 16,
    borderRadius: 8,
    elevation: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});