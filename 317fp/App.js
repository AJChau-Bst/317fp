import { NavigationContainer, Navigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, Slider, TouchableOpacity, Scroll, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native'
import * as Progress from 'react-native-progress';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { // for email/password authentication: 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
  // for logging out:
  signOut
} from "firebase/auth";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEVXzUI5empQDcg9s6b6kskX4K3xujPoQ",
  authDomain: "cs317final.firebaseapp.com",
  projectId: "cs317final",
  storageBucket: "cs317final.appspot.com",
  messagingSenderId: "854675465399",
  appId: "1:854675465399:web:a0c32269a0a878874c1932"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();


const images = {
  happy: require('./happycat.png'),
  sad: require('./sadcat.png'),
  neutral: require('./neutralcat.png')
  // ... other images
}

const healthContext = createContext({
  checkedBreakfast: null, 
  setBreakfast: false, 
  checkedLunch: null, 
  setCheckedLunch: false , 
  checkedDinner: null, 
  setCheckedDinner: false, 
  waterProgress: null, 
  setWaterProgress: 0, 
  hygieneProgress: null, 
  setHygieneProgress:0,
  sleepProgress: null,
  setSleepProgress:0

});

function MapScreen() {
  // let subscription = null;
  // const [location, setLocation] = useState(null);
  // const [errorMsg, setErrorMsg] = useState(null);
  const [showStartRec, setStartRec] = useState(true);
  const [showEndRec, setEndRec] = useState(false);
  // const [myCoord, setMyCoord] = useState(null);
  // const [coords, setCoords] = useState([
  //   {
  //     "latitude": 42.2938,
  //     "longitude": -71.30128
  //   },
  //   {
  //     "latitude": 42.29276,
  //     "longitude": -71.30063
  //   },
  //   {
  //     "latitude": 42.29161,
  //     "longitude": -71.30172
  //   }]);
  //   const [permissionText, setPermissionText] 
  //   = useState('Location permission not requested yet');

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return;
  //     }

  //     let currentLocation = await Location.getCurrentPositionAsync({});
  //     setLocation(currentLocation);
  //   })();
  // }, []);
  return (
<SafeAreaView style={styles.container}>
    <MapView style={styles.map} 
    initialRegion={{
    latitude: 41,
    longitude: -72,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    }}
    showsCompass={true} 
    showsUserLocation={true} 
    rotateEnabled={true}
  >
  </MapView>
  <View style={styles.controls}>
        {showStartRec && <Button title="Start Tracking" onPress={startTracking} color='green'/>}
        {showEndRec && <Button title="Stop Tracking" onPress={stopTracking} color='red'/>}
        </View>
    </SafeAreaView>
  );
}
function startTracking(){
  return 0;
}

function stopTracking(){
  return 0;
}

function HomeScreen(){
  const [checkedBreakfast, setCheckedBreakfast] = React.useState(false);
  const [checkedLunch, setCheckedLunch] = React.useState(false);
  const [checkedDinner, setCheckedDinner] = React.useState(false);
  const toggleCheckbox = () => setChecked(!checked);

  const [waterProgress, setWaterProgress] = React.useState(0);
  const handleAddWater = () => {
    setWaterProgress(prevProgress => Math.min(prevProgress + 1 / 15, 1)); // Increment by 1/15 because 15 cups of water, max is 1
  };

  const [sleepProgress, setSleepProgress] = React.useState(0);
  const handleAddSleep = () => {
    setSleepProgress(prevProgress => Math.min(prevProgress + 1 / 7, 1)); // Increment by 1/15 because 15 cups of water, max is 1
  };

  const [hygieneProgress, setHygieneProgress] = React.useState(0);
  const handleAddHygiene = () => {
    setHygieneProgress(prevProgress => Math.min(prevProgress + 1 / 7, 1)); // Increment by 1/15 because 15 cups of water, max is 1
  };

  const [imageKey, setImageKey] = useState('sad');
  const [emotionText, setEmotionText] = useState("");

  const calculateAverageProgress = () => {
    // Assuming each checkbox contributes equally and dividing by total number of progress elements
    const checkboxProgress = (checkedBreakfast + checkedLunch + checkedDinner) / 3;
    const totalProgress = waterProgress + sleepProgress + hygieneProgress + checkboxProgress;
    return totalProgress / 4; // Average of the four progress values
  };

  const averageProgress = calculateAverageProgress();
  
  useEffect(() => {
    let newImageKey = 'happy';
    let newEmotionText = "Ayyy...I feel great!";

    const averageProgress = calculateAverageProgress();

    if (averageProgress < 0.3) {
      newImageKey = 'sad';
      newEmotionText = "Ehhh...I'm not feeling so good";
    } else if (averageProgress < 0.6) {
      newImageKey = 'neutral';
      newEmotionText = "Hmmm...I'm doing alright";
    }

    setImageKey(newImageKey);
    setEmotionText(newEmotionText);
  }, [averageProgress, checkedBreakfast, checkedLunch, checkedDinner, waterProgress, sleepProgress, hygieneProgress]);


  //having progress bars automatically reset at the end of the day
  //const [lastResetDate, setLastResetDate] = useState(null);

  // Function to reset progress bars
  const resetProgressBars = async () => {
    setWaterProgress(0);
    setSleepProgress(0);
    setHygieneProgress(0);
    setCheckedBreakfast(false);
    setCheckedLunch(false);
    setCheckedDinner(false);

    // Update the last reset timestamp to the current time
    const currentTime = new Date().getTime();
    //setLastResetTimestamp(currentTime);
    await AsyncStorage.setItem('lastResetTimestamp', JSON.stringify(currentTime));
  };

  // UseEffect hook to check for reset condition every minute
  useEffect(() => {
    const checkReset = async () => {
      const currentTime = new Date().getTime();
      const storedTimestamp = await AsyncStorage.getItem('lastResetTimestamp');
      const lastResetTimestamp = storedTimestamp ? JSON.parse(storedTimestamp) : 0;
  
      // Check if a day has passed since the last reset
      if (currentTime - lastResetTimestamp >= 30000) { // 86400000 milliseconds = 24 hours, 60000 = 1 minute
        await resetProgressBars();
        await AsyncStorage.setItem('lastResetTimestamp', JSON.stringify(currentTime));
      }
    };
  
    // Check every 24 hours
    const interval = setInterval(() => {
      checkReset();
    }, 30000); // 86400000 milliseconds = 24 hours, 60000 = 1 minute
  
    // Run checkReset immediately on component mount
    checkReset();
  
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.containerHome}>

        <Image
          style={styles.petImage}
          source={images[imageKey]}

        />

        <Text>{emotionText}</Text>

        <TouchableOpacity onPress={resetProgressBars} style={styles.testButtonStyle}>
          <Text style={styles.buttonText}>Test Reset</Text>
        </TouchableOpacity>

        <View style={styles.inlineContainer}>
          <Text>Water </Text>
          <Progress.Bar 
            progress={waterProgress} 
            width={200} 
            height={30} 
            borderRadius={8} 
            color='pink'/>
          <TouchableOpacity onPress={handleAddWater} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

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

      <View style={styles.inlineContainer}>
        <Text>Sleep </Text>
        <Progress.Bar 
          progress={sleepProgress} 
          width={200} 
          height = {30} 
          borderRadius = {8} 
          color = 'blue'/>
        <TouchableOpacity onPress={handleAddSleep} style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

        
      <View style={styles.inlineContainer}>
        <Text>Hygiene </Text>
        <Progress.Bar 
        progress={hygieneProgress} 
        width={200} 
        height = {30} 
        borderRadius = {8} 
        color = 'green'/>
        <TouchableOpacity onPress={handleAddHygiene} style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      </ScrollView>
    </SafeAreaView>
  );
}

function SocialScreen() {
  return (
    <Text>Social!</Text>
  );
}


const formatYAxisLabel = (value) => {
  return `${value * 100}`;
};

function StatusScreen({ checkedBreakfast, checkedLunch, checkedDinner, waterProgress, hygieneProgress }) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * 0.6;

  const {sleepProgress, setSleepProgress} = useContext(healthContext);


  const mealData = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [{
      data: [
        ((checkedBreakfast ? 100 : 0) + (checkedLunch ? 100 : 0) + (checkedDinner ? 100 : 0)) / 3,
        // The above line is repeated for other days, replace with actual data
      ]
    }]
  };

  const waterData = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [{
      data: [
        (waterProgress / 15) * 100,
        // Repeat for other days, replace with actual data
      ]
    }]
  };

  const sleepData = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [{
      data: [
        (sleepProgress / 7) * 100,
        // Repeat for other days, replace with actual data
      ]
    }]
  };

  const hygieneData = {
    labels: ["Day 1", "Day 2", "Day 3"],
    datasets: [{
      data: [
        (hygieneProgress / 7) * 100,
        // Repeat for other days, replace with actual data
      ]
    }]
  };

  const chartConfig = {
    backgroundColor: 'blue',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 2,
    formatYLabel: formatYAxisLabel,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <Text>Meal Completion</Text>
          <BarChart
            data={mealData}
            width={chartWidth}
            height={220}
            yAxisLabel="%"
            chartConfig={chartConfig}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text>Water Consumption</Text>
          <BarChart
            data={waterData}
            width={chartWidth}
            height={220}
            yAxisLabel="%"
            chartConfig={chartConfig}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text>Sleep Quality</Text>
          <BarChart
            data={sleepData}
            width={chartWidth}
            height={220}
            yAxisLabel="%"
            chartConfig={chartConfig}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text>Hygiene Level</Text>
          <BarChart
            data={hygieneData}
            width={chartWidth}
            height={220}
            yAxisLabel="%"
            chartConfig={chartConfig}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function AccountScreen() {
  return (
    <Text>Account!</Text>
  );
}

function SettingsScreen() {
  const [friend, addFriend] = useState('');
  const uploadString = async (stringToUpload) => {
    try {
      // Get the reference to the collection
      const newFriendsCollectionRef = collection(db, "newFriends");
  
      // Add the string to the collection
      await addDoc(newFriendsCollectionRef, {
        string: friend,
      });
      console.log("String uploaded successfully!");
    } catch (error) {
      console.error("Error uploading string:", error);
    }
  }
  return (
<View style={styles.container}>
    <Text> Enter Friend Username To Add: </Text>
    <TextInput style={styles.input}
      onSubmitEditing={(value) => addFriend(value.nativeEvent.text)} />
    <Button title="Submit" onPress={() => uploadString()} color='green'/>
    </View>
  );
}

function UserScreen(){
  return(
      <MyTabs/>
  );
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
    <Button title="Sign Up" onPress={() => navigation.navigate('Sign Up')} color='blue'/>
    </View>
  )
}

function SignUpScreen({navigation}){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

       // Invoke Firebase authentication API for Email/Password sign up 
       createUserWithEmailAndPassword(auth, username, password)
       .then((userCredential) => {
         console.log(`signUpUserEmailPassword: sign up for email ${loginProps.email} succeeded (but email still needs verification).`);
       })
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
    <Button title="Submit" onPress={() => navigation.navigate('Main Screen')} color='green'/>
    </View>
  )
}


const Tab = createBottomTabNavigator();

function MyTabs() {
  const [checkedBreakfast, setCheckedBreakfast] = React.useState(false);
  const [checkedLunch, setCheckedLunch] = React.useState(false);
  const [checkedDinner, setCheckedDinner] = React.useState(false);
  const [waterProgress, setWaterProgress] = React.useState(0);
  const [sleepProgress, setSleepProgress] = React.useState(0);
  const [hygieneProgress, setHygieneProgress] = React.useState(0);
  return (
    <healthContext.Provider value = {{checkedBreakfast, setCheckedBreakfast, checkedLunch, setCheckedLunch, checkedDinner, setCheckedDinner, waterProgress, setWaterProgress, hygieneProgress, setHygieneProgress, sleepProgress, setSleepProgress}}>
    <Tab.Navigator>
      <Tab.Screen name="Your Pet" component= {HomeScreen } />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
    </healthContext.Provider>
  );
}

const stackN= createStackNavigator();

function MyStack() {
  const navigation = useNavigation();
  return (
    <stackN.Navigator>
      <stackN.Screen name="Log In" component={SignInScreen} />
      <stackN.Screen name="Sign Up" component={SignUpScreen} />
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
    containerHome: {
    // alignItems: 'center',
    padding: 2,
    // justifyContent: 'space-between',

    // Add space between inlineContainer views
    paddingBottom: 10, // Space at the bottom of each container
  },
    inlineContainer: {
    flexDirection: 'row', // Aligns children horizontally
    alignItems: 'center', // Centers children vertically in the container
    marginBottom: 20, // Add bottom margin to each inlineContainer
    marginTop: 20
      
  },
    chartContainer: {
    marginBottom: 20, // Space between charts
  },
    testButtonStyle: {
    backgroundColor: 'red', // Example color for visibility
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20
  },
  
    buttonStyle: {
    backgroundColor: '#DA63E9', // Example background color
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10
  },
  buttonText: {
    color: 'white', // Example text color
    fontSize: 16,
  }, 
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
    width: 300,
    height: 300,
    resizeMode: 'contain'
    
  },
  elementHome: {
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  map: {
    flex: 2, 
    width: '100%',
    height: '100%',
  },
  controls: {
    marginTop: 10, 
    padding: 10, 
    borderRadius: 10, 
    backgroundColor: 'cyan'
  }
});