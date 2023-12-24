import { NavigationContainer, Navigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useState, useEffect} from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native'
import * as Progress from 'react-native-progress';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";
import SignInOutPScreen from './SignInOutPScreen';
import StateContext from './StateContext.js';
import { emailOf } from './utils.js';
import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from 'firebase/app';
import {getAuth, signOut} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getDoc, arrayUnion, setDoc, doc} from "firebase/firestore"; 
import * as Location from 'expo-location';
import Settings from "./Components/settings.js"
import mainscreen from "./Components/mainscreen.js"

export default function App() {

  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

//Create Authentication Use States
const [loggedInUser, setLoggedInUser] = React.useState(null);
<<<<<<< Updated upstream
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
=======
const [email, setEmail] = useState("chaujannette@gmail.com"); //input email
const [password, setPassword] = useState("hellooo"); //input password
>>>>>>> Stashed changes
const [friend, addFriend] = useState([]);

//Create Health Use States
const [checkedBreakfast, setCheckedBreakfast] = React.useState(false);
const [checkedLunch, setCheckedLunch] = React.useState(false);
const [checkedDinner, setCheckedDinner] = React.useState(false);
const [waterProgress, setWaterProgress] = React.useState(0);
const [hygieneProgress, setHygieneProgress] = React.useState(0);
const [sleepProgress, setSleepProgress] = React.useState(0);
const [petName, setPetName] = React.useState(0);

//Create Social Use States
const [statusMessage, setStatusMessage] = React.useState("")
const [friendMessages, setFriendMessages] = React.useState([]); //
const [liked, setLiked] = React.useState("")
const [emoji, setemoji] = React.useState("");
const [isComposingMessage, setIsComposingMessage] = React.useState(false);

//Create Props for Contexts
const healthProps = { checkedBreakfast, setCheckedBreakfast, checkedLunch, setCheckedLunch, checkedDinner, setCheckedDinner, waterProgress, setWaterProgress, hygieneProgress, setHygieneProgress, sleepProgress, setSleepProgress, petName, setPetName};
const loginProps = {loggedInUser, setLoggedInUser, logOut, email, setEmail, password, setPassword, friend, addFriend}
const socialProps = {email, setEmail, friend, addFriend, statusMessage}
const allProps = {loginProps, healthProps, socialProps}


//Logs Out of Firebase
function logOut() {
    console.log('logOut'); 
    console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
    console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    console.log(`logOut: setLoggedInUser(null)`);
    setLoggedInUser(null);
    console.log('logOut: signOut(auth)');
    signOut(auth);  
  }

function SignInScreen(){
  const defaultEmail = "chaujannette@gmail.com";
  const defaultPassword = 'hellooo'

  //Default
  setEmail("chaujannette@gmail.com")
  setPassword('hellooo')
  
  return(
    <View style={styles.fullScreenContainer}>
      <SignInOutPScreen 
        loginProps={loginProps} 
        auth={auth}/>
    </View>
  )
}


const stackN= createStackNavigator();

function MyStack() {
  const navigation = useNavigation();
  return (
    <StateContext.Provider value={allProps}>
    <stackN.Navigator>
      <stackN.Screen name="Log In" component={SignInScreen} />
      <stackN.Screen name="Main Screen" component={mainscreen}
      options={{
          headerRight: () => (
            <Button
              title="Settings"
              onPress={() => navigation.navigate('Settings')}
            />
          ), 
          headerLeft: ()=> null,
        }} />
      <stackN.Screen name="Settings" component={Settings} />
    </stackN.Navigator>
    </StateContext.Provider>
  );
}
  
  return (
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'stretch', // This will stretch the child components to fill the width
  padding: 20, // Adjust as needed
}
});
