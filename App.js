import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	ScrollView,
} from "react-native";
import auth from '@react-native-firebase/auth';
import { initializeApp } from "firebase/app";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./app/TabNavigation/TabNavigation";
import change from "./app/global/global";
import { firebase } from "./app/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

const firebaseConfig = {
	apiKey: "AIzaSyDMHMy2iKC01XY9vhTLlewuiFYgpoDSFaQ",
	authDomain: "checklist-a7cd6.firebaseapp.com",
	projectId: "checklist-a7cd6",
	storageBucket: "checklist-a7cd6.appspot.com",
	messagingSenderId: "105249621291",
	appId: "1:105249621291:web:3b8358386edacef79a316e",
	measurementId: "G-QECP31RQD5",
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({
	email,
	setEmail,
	password,
	setPassword,
	isLogin,
	setIsLogin,
	handleAuthentication,
}) => {
	return (
		<View style={styles.normalauthContainer}>
			<Text style={styles.title}>{isLogin ? "Sign In" : "Sign Up"}</Text>

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
				<Button
					title={isLogin ? "Sign In" : "Sign Up"}
					onPress={handleAuthentication}
					color="#3498db"
				/>
			</View>

			<View style={styles.bottomContainer}>
				<Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
					{isLogin
						? "Need an account? Sign Up"
						: "Already have an account? Sign In"}
				</Text>
			</View>

			{/* <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={this._signIn}
        disabled={this.state.isSigninInProgress}
      />; */}
		</View>
	);
};

const storeUser = async (userJSON) => {
	try {
		await AsyncStorage.setItem("user", userJSON);
		console.log("User stored successfully in Async Storage!");
	} catch (error) {
		console.error("Error storing user:", error);
	}
};

const removeUserFromStorage = async () => {
	try {
		// Remove the user information from AsyncStorage
		await AsyncStorage.removeItem("user");
		console.log("User removed from AsyncStorage successfully!");
	} catch (error) {
		console.error("Error removing user from AsyncStorage:", error);
	}
};

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
	change("set", user);
	const userJSON = JSON.stringify(user);
	storeUser(userJSON);
	return (
		<>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Company</Text>

				<Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
			</View>

			<TabNavigation />
		</>
	);
};

export default function App() {
	// const [initializing , setInitializing] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null); // Track user authentication state
	const [isLogin, setIsLogin] = useState(true);

	const normalauth = getAuth(app);

	GoogleSignin.configure({
		webClientId: '804516530685-5903u0jmq8si7cig2kbnso385bc3idnr.apps.googleusercontent.com',
	});

	function onAuthStateChanged(user){
		setUser(user);
		change("set", user);
		const userJSON = JSON.stringify(user);
		storeUser(userJSON);
	  if(user){
        const todoRef = firebase.firestore().collection("users");
        const userExists = todoRef.where("useremail", "==", user.email);
        const userInfo = { userID: user.uid, useremail: user.email };
        userExists
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              // If no matching documents found, add the user information
              todoRef
                .add(userInfo)
                .then(() => {
                  console.log('User information added successfully');
                })
                .catch((err) => {
                  console.error("Error adding user information:", err);
                });
            } else {
              // User information already exists in the collection
              console.log('User information already exists');
            }
          })
          .catch((err) => {
            console.error("Error checking user information:", err);
          });
      }
		if(initializing) setInitializing(false);
	}

	useEffect(()=>{
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	const onGoogleButtonPress = async () =>{
		// Check if your device supports Google Play
		await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
		// Get the users ID token
		const { idToken } = await GoogleSignin.signIn();
	  
		// Create a Google credential with the token
		const googleCredential = auth.GoogleAuthProvider.credential(idToken);
	  
		// Sign-in the user with the credential
		const user_sign_in = auth().signInWithCredential(googleCredential);
		user_sign_in.then((user)=>{
		  console.log(user);
		}).catch((err)=>console.log(err));
	  }
	
	  const signOut = async()=>{
		try{
		  await GoogleSignin.revokeAccess();
		  await auth().signOut();
		  setUser(null);
		  console.log("User logged out successfully!");
		  change("set", "");
		  removeUserFromStorage();
		}catch(error){
		  console.log(error);
		}
	  }
	
	  if(initializing) return null;

	  if(!user){
		return(
		  <View style={styles.container}>
			<GoogleSigninButton
			style={{width:300, height: 65, marginTop: 300}}
			onPress={onGoogleButtonPress}
			></GoogleSigninButton>
		  </View>
		)
	  }
	
	  return (
		// <View style={styles.container}>
		//   <Text>Welcome, {user.uid}</Text>
		//   <Button title='signout' onPress={signOut}></Button>
		// </View>
		<>
		<View style={styles.headerContainer}>
		<Text style={styles.title}>Company</Text>

		<Button title="Logout" onPress={signOut} color="#e74c3c" />
	</View>

	<TabNavigation />
	</>
	  )
	
	

	// useEffect(() => {
	// 	const getUserFromStorage = async () => {
	// 		try {
	// 			// Retrieve the user JSON string from AsyncStorage
	// 			const userJSON = await AsyncStorage.getItem("user");

	// 			// If userJSON is not null, parse it into an object
	// 			if (userJSON) {
	// 				const user = JSON.parse(userJSON);
	// 				// console.log('User retrieved successfully:', user);
	// 				setUser(user);
	// 				// return user;
	// 			} else {
	// 				console.log("No user information found in AsyncStorage.");
	// 				return null;
	// 			}
	// 		} catch (error) {
	// 			console.error("Error retrieving user from AsyncStorage:", error);
	// 			return null;
	// 		}
	// 	};
	// 	getUserFromStorage();
	// }, []);

	// useEffect(() => {
	// 	const unsubscribe = onAuthStateChanged(normalauth, (user) => {
	// 		setUser(user);
	// 		// console.log("USER HERE: ", user);
      
    //   if(user){
    //     const todoRef = firebase.firestore().collection("users");
    //     const userExists = todoRef.where("useremail", "==", user.email);
    //     const userInfo = { userID: user.uid, useremail: user.email };
    //     userExists
    //       .get()
    //       .then((querySnapshot) => {
    //         if (querySnapshot.empty) {
    //           // If no matching documents found, add the user information
    //           todoRef
    //             .add(userInfo)
    //             .then(() => {
    //               //console.log('User information added successfully');
    //             })
    //             .catch((err) => {
    //               console.error("Error adding user information:", err);
    //             });
    //         } else {
    //           // User information already exists in the collection
    //           //console.log('User information already exists');
    //         }
    //       })
    //       .catch((err) => {
    //         console.error("Error checking user information:", err);
    //       });
    //   }

	// 	});

	// 	return () => unsubscribe();
	// }, [normalauth]);

	// const handleAuthentication = async () => {
	// 	try {
	// 		if (user) {
	// 			// If user is already normalauthenticated, log out
	// 			console.log("User logged out successfully!");
	// 			change("set", "");
	// 			setUser(null);
	// 			removeUserFromStorage();
	// 			await signOut(normalauth);
	// 		} else {
	// 			// Sign in or sign up
	// 			if (isLogin) {
	// 				// Sign in
	// 				await signInWithEmailAndPassword(normalauth, email, password);
	// 				console.log("User signed in successfully!");
	// 			} else {
	// 				// Sign up
	// 				await createUserWithEmailAndPassword(normalauth, email, password);
	// 				console.log("User created successfully!");
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.error("Authentication error:", error.message);
	// 	}
	// };

	// return (
	// 	<NavigationContainer>
	// 		{user ? (
	// 			// Show user's email if user is normalauthenticated
	// 			<AuthenticatedScreen
	// 				user={user}
	// 				handleAuthentication={handleAuthentication}
	// 			/>
	// 		) : (
	// 			// Show sign-in or sign-up form if user is not normalauthenticated
	// 			<AuthScreen
	// 				email={email}
	// 				setEmail={setEmail}
	// 				password={password}
	// 				setPassword={setPassword}
	// 				isLogin={isLogin}
	// 				setIsLogin={setIsLogin}
	// 				handleAuthentication={handleAuthentication}
	// 			/>
	// 		)}
	// 	</NavigationContainer>
	// );

	// // return (
	// //   <NavigationContainer>
	// //     <TabNavigation />
	// //   </NavigationContainer>
	// // );
}
const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#f0f0f0",
	},
	normalauthContainer: {
		width: "90%",
		maxWidth: 400,
		backgroundColor: "#fff",
		padding: 18,
		marginTop: "auto",
		marginBottom: "auto",
		marginRight: 16,
		marginLeft: 16,
		borderRadius: 8,
		elevation: 3,
		// display: 'flex',
		// flexDirection: 'row',
		// justifyContent:'center',
		// alignContent:'space-between'
	},
	headerContainer: {
		width: "90%",
		maxWidth: 400,
		backgroundColor: "#fff",
		paddingTop: 6,
		paddingBottom: 6,
		paddingLeft: 12,
		paddingRight: 12,
		marginTop: 38,
		marginBottom: 4,
		marginRight: 16,
		marginLeft: 16,
		borderRadius: 8,
		elevation: 1,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 24,
		textAlign: "center",
	},
	input: {
		height: 40,
		borderColor: "#ddd",
		borderWidth: 1,
		marginBottom: 16,
		padding: 8,
		borderRadius: 4,
	},
	buttonContainer: {
		marginBottom: 16,
	},
	toggleText: {
		color: "#3498db",
		textAlign: "center",
	},
	bottomContainer: {
		marginTop: 20,
	},
	emailText: {
		fontSize: 18,
		textAlign: "center",
		marginBottom: 20,
	},
});
