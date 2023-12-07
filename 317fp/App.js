import { NavigationContainer, Navigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useState } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, Slider } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native'
import * as Progress from 'react-native-progress';
import Checkbox from 'expo-checkbox';
//Progress Bar: https://www.npmjs.com/package/react-native-progress

//Firebase Stuff
// import { initializeApp } from 'firebase/app';
// import { // access to authentication features:
//          getAuth, 
//          // for logging out:
//          signOut
// } from "firebase/auth";
// import { // access to Firestore features:
//          getFirestore, 
// } from "firebase/firestore";

// // New for images:
// import { // access to Firebase storage features (for files like images, video, etc.)
//          getStorage, 
// } from "firebase/storage";

// Initialize Firebase
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


function HomeScreen(){
  const [checkedBreakfast, setCheckedBreakfast] = React.useState(false);
  const [checkedLunch, setCheckedLunch] = React.useState(false);
  const [checkedDinner, setCheckedDinner] = React.useState(false);
  const toggleCheckbox = () => setChecked(!checked);
  states = ['./happy.png', './neutral.png', './sad.png'];
  index = 1;



  return (
    <View style={styles.containerHome}>

      <Image
      style={styles.petImage}
      source={require(states[index])}
    />
    <Text>Water!</Text>
    <Progress.Bar 
      progress={0.3} 
      width={200} 
      height = {30} 
      borderRadius = {8} 
      color = 'pink'/>


    <View style={{ flexDirection: 'row' }}>
    <Text>Breakfast!</Text>
    <Checkbox
      style = {styles.elementHome}
      value={checkedBreakfast} 
      onValueChange={setCheckedBreakfast} />
      <Text>Lunch!</Text>
    <Checkbox
      style = {styles.elementHome}
      value={checkedLunch} 
      onValueChange={setCheckedLunch} />
      <Text>Dinner!</Text>
    <Checkbox
      style = {styles.elementHome}
      value={checkedDinner} 
      onValueChange={setCheckedDinner} />   

    </View>  

    <Text>Sleep!</Text>
    <Progress.Bar 
      progress={0.3} 
      width={200} 
      height = {30} 
      borderRadius = {8} 
      color = 'blue'/>

    <Text>Hygiene!</Text>
    <Progress.Bar 
    progress={0.3} 
    width={200} 
    height = {30} 
    borderRadius = {8} 
    color = 'green'/>
    </View>
  );
}

function SocialScreen() {
  return (
    <Text>Settings!</Text>
  );
}

function SettingsScreen() {
  return (
    <Text>Settings!</Text>
  );
}

function StatusScreen() {
  return (
    <Text>Settings!</Text>
  );
}

function DecorationScreen() {
  return (
    <Text>Settings!</Text>
  );
}

function UserScreen(){
  return(
      <MyTabs/>
  );
}

function TrophiesScreen(){

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
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Your Pet" component={HomeScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Decoration" component={DecorationScreen} />
      <Tab.Screen name="Trophies" component={TrophiesScreen} />
    </Tab.Navigator>
  );
}

const stackN= createStackNavigator();

function MyStack() {
  const navigation = useNavigation();
  return (
    <stackN.Navigator>
      <stackN.Screen name="Log In" component={SignInScreen} />
      <stackN.Screen name="Main Screen" component={UserScreen}
      options={{
          headerRight: () => (
            <Button
              title="Settings"
              onPress={() => navigation.navigate('Settings')}
            />
          ),
        }} />
      <stackN.Screen name="Settings" component={SettingsScreen} />
    </stackN.Navigator>
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
  },
    petImage: {
    justifyContent: 'center',
    width: '50%',
    height: '50%',
    resizeMode: 'center'
    },
    containerHome: {
    alignItems: 'center',
    padding: 2,
    justifyContent: 'space-between'
  },
  elementHome: {
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    
  }
});
