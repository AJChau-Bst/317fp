import { NavigationContainer, Navigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useState } from 'react';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


//Questions
/*
Are Stack Navigator Screens considered real screens? What about tabs? 
Will need to create the readme for the alpha version. 

*/

//Firebase Stuff
import { initializeApp } from 'firebase/app';
// import { // access to authentication features:
//          getAuth, 
//          // for logging out:
//          signOut
// } from "firebase/auth";
// import { // access to Firestore features:
//          getFirestore, 
// } from "firebase/firestore";


// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);

// TODO: Replace the following with your app's Firebase project configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDEVXzUI5empQDcg9s6b6kskX4K3xujPoQ",
//   authDomain: "cs317final.firebaseapp.com",
//   projectId: "cs317final",
//   storageBucket: "cs317final.appspot.com",
//   messagingSenderId: "854675465399",
//   appId: "1:854675465399:web:a0c32269a0a878874c1932"
// };

function LoginScreen(){
  
  return(
    <Text>Settings!</Text>
  );

}

function HomeScreen() {
  return (
    <Text>Settings!</Text>
  );
}

function SettingsScreen() {
  return (
    <Text>Settings!</Text>
  );
}

function TestScreen() {
  return (
    <Text>Settings!</Text>
  );
}

function AnotherTestScreen() {
  return (
    <Text>Settings!</Text>
  );
}

function UserScreen(){
  return(
      <MyTabs/>
  );
}

function firebase(){

}

function SignInScreen({navigation}){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return(
    <View style={styles.container}>
    <Text> Username: </Text>
    <TextInput style={styles.input} label="Username"
      onSubmitEditing={(value) => setUsername(value.nativeEvent.text)} />
    <Text> Password: </Text>
    <TextInput
      style={styles.input}
      label="Password"
      secureTextEntry
      onSubmitEditing={(value) => setPassword(value.nativeEvent.text)}
    />
    <Button title="Next Page" onPress={() => navigation.navigate('Main Screen')} color='green'/>
    </View>
  )
}


const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="1" component={HomeScreen} />
      <Tab.Screen name="2" component={SettingsScreen} />
      <Tab.Screen name="3" component={TestScreen} />
      <Tab.Screen name="4" component={AnotherTestScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Log In" component={SignInScreen} />
      <Stack.Screen name="Main Screen" component={UserScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    input: {
    borderColor: "gray",
    width: "50%",
    margin: "auto",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }
});
