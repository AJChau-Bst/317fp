import { useState } from 'react';
import { Text, FlatList, View, SafeAreaView, ScrollView, 
         StyleSheet, TouchableOpacity } from 'react-native';
import SignInOutPScreen from '.SignInOutPScreen';
// import { firebaseConfig } from './firebaseConfig.js'
import { emailOf } from './utils.js';
import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from 'firebase/app';
import { // access to authentication features:
         getAuth, 
         // for logging out:
         signOut
} from "firebase/auth";
import {
         getFirestore, 
} from "firebase/firestore";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// New for images:
const db = getFirestore(firebaseApp); // for storaging messages in Firestore


const storage = getStorage(firebaseApp, 
    firebaseConfig.storageBucket) // for storaging images in Firebase storage

const firebaseProps = {auth, db, 
                       storage // New for images
                      }

export default function fireBase() {
    const defaultEmail = "perses7010@gmail.com";
    const defaultPassword = 'hellooo'

    function logOut() {
        console.log('logOut'); 
        console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
        console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
        console.log(`logOut: setLoggedInUser(null)`);
        setLoggedInUser(null);
        console.log('logOut: signOut(auth)');
        signOut(auth); // Will eventually set auth.currentUser to null     
      }
    
      const loginProps = { 
        defaultEmail, defaultPassword, 
        email, setEmail, 
        password, setPassword, 
        loggedInUser, setLoggedInUser, logOut
       }
    
    return (
    <SafeAreaView style={styles.container}>
        {
        <SignInOutPScreen 
            loginProps={loginProps} 
            auth={auth}
            setPscreen={changePscreen}/>
        }
        {
        <ChatViewPScreen 
            loginProps={loginProps} 
            firebaseProps={firebaseProps}/>
        }
    </SafeAreaView>
    );
}