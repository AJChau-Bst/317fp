/*
AJ's To Do List:
- Map
- Polish Sign In and Outt Screen, Polish Main screen
https://firebase.google.com/docs/database/web/lists-of-data#append_to_a_list_of_data

*/
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
import SignInOutPScreen from './SignInOutPScreen';
import StateContext from './StateContext.js';
import { emailOf } from './utils.js';
import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from 'firebase/app';
import { // access to authentication features:
         getAuth, 
         // for logging out:
         signOut
} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { collection, addDoc, getDoc, updateDoc, arrayUnion, setDoc, doc, setData } from "firebase/firestore"; 


export default function App() {

  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// New for images:
const db = getFirestore(firebaseApp); // for storaging messages in Firestore

const [loggedInUser, setLoggedInUser] = React.useState(null);
const [email, setEmail] = useState(""); // Provide default email for testing
const [password, setPassword] = useState(""); // Provide default passwored for testing
const [friend, addFriend] = useState([]);

const [checkedBreakfast, setCheckedBreakfast] = React.useState(false);
const [checkedLunch, setCheckedLunch] = React.useState(false);
const [checkedDinner, setCheckedDinner] = React.useState(false);
const [waterProgress, setWaterProgress] = React.useState(0);
const [hygieneProgress, setHygieneProgress] = React.useState(0);
const [sleepProgress, setSleepProgress] = React.useState(0);
const [petName, setPetName] = React.useState(0);
const [statusMessage, setStatusMessage] = React.useState("")
const [friendMessages, setFriendMessages] = React.useState([]); //
const [liked, setLiked] = React.useState("")//Create a Dictionary Here. 
const [emoji, setemoji] = React.useState("");
const [isComposingMessage, setIsComposingMessage] = React.useState(false);


const healthProps = { checkedBreakfast, setCheckedBreakfast, checkedLunch, setCheckedLunch, checkedDinner, setCheckedDinner, waterProgress, setWaterProgress, hygieneProgress, setHygieneProgress, sleepProgress, setSleepProgress, petName, setPetName};
const loginProps = {loggedInUser, setLoggedInUser, logOut, email, setEmail, password, setPassword, friend, addFriend}
const socialProps = {email, setEmail, friend, addFriend, statusMessage}
const allProps = {loginProps, healthProps, socialProps}

const date = new Date();
const timestamp = date.getTime(); // millsecond timestamp
const timestampString = timestamp.toString();


function logOut() {
    console.log('logOut'); 
    console.log(`logOut: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
    console.log(`logOut: emailOf(loggedInUser)=${emailOf(loggedInUser)}`);
    console.log(`logOut: setLoggedInUser(null)`);
    setLoggedInUser(null);
    console.log('logOut: signOut(auth)');
    signOut(auth); // Will eventually set auth.currentUser to null    
  }

const images = {
  happy: require('./happycat.png'),
  sad: require('./sadcat.png'),
  neutral: require('./neutralcat.png')
  // ... other images
}

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
  const toggleCheckbox = () => setChecked(!checked);
  const handleAddWater = () => {
    setWaterProgress(previousWaterProgress => {
      const newWaterProgress = Math.min(previousWaterProgress + 1 / 15, 1); // Increment by 1/15 because 15 cups of water, max is 1
      saveProgressToFirebase(); // Save progress after updating
      return newWaterProgress;
    });
  };

  const handleAddSleep = () => {
    setSleepProgress(previousSleepProgress => {
      const newSleepProgress = Math.min(previousSleepProgress + 1 / 7, 1); // Increment by 1/7 because 7 hours of sleep, max is 1
      saveProgressToFirebase(); // Save progress after updating
      return newSleepProgress;
    });
  };

  const handleAddHygiene = () => {
    setHygieneProgress(previousHygieneProgress => {
      const newHygieneProgress = Math.min(previousHygieneProgress + 1 / 7, 1); // Increment by 1/7 because 7 steps of hygiene, max is 1
      saveProgressToFirebase(); // Save progress after updating
      return newHygieneProgress;
    });
  };

  function saveProgressToFirebase() {
    // Assuming 'email' contains the current user's email
    const docRef = doc(db, "App Storage", email);
  
    // Prepare the data to save
    const dataToSave = {
      waterProgress,
      sleepProgress,
      hygieneProgress,
      checkedBreakfast,
      checkedLunch,
      checkedDinner,
      // ... any other data you want to save
    };
  
    //Save the data to Firestore
    setDoc(docRef, dataToSave, { merge: true })
      .then(() => console.log("Data saved successfully!"))
      .catch(error => console.error("Error saving data:", error));
  }

  useEffect(() => {
    // This function will be called when the component is unmounted
    return () => {
      saveProgressToFirebase(); // Save progress when navigating away
    };
  }, []);

  function getData() {
    const docRef = doc(db, "App Storage", email);
    getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        // Here, you can set the state or handle the fetched data as needed
      } else {
        console.log("No such document!");
      }
    }).catch(error => {
      console.error("Error getting document:", error);
    });
  }

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
      if (currentTime - lastResetTimestamp >= 86400000) { // 86400000 milliseconds = 24 hours, 60000 = 1 minute
        await resetProgressBars();
        await AsyncStorage.setItem('lastResetTimestamp', JSON.stringify(currentTime));
      }
    };
  
    // Check every 24 hours
    const interval = setInterval(() => {
      checkReset();
    }, 86400000); // 86400000 milliseconds = 24 hours, 60000 = 1 minute
  
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
      <Button title="Save Data" onPress={saveProgressToFirebase} color='red'/>
      <Button title="Get Data" onPress={getData} color='blue'/>
      </ScrollView>
    </SafeAreaView>
  );
}


function SocialScreen() {
  // ideally, this function grabs your friend's messages from Firestore,
  // and will display them-- we'll need their pet's name as the display name
  function populateMoodBoard(){
    //a function to format the friend messages that are displayed
    // want to grab from the friend array --> then take the pet name
    // and grab their status message
    // i think it can return a JSX component 
    return 0;
  }
  function updateStatusMessage() {
    return 0;
  }
    /**
   * Open an area for message composition. Currently uses conditional formatting
   * (controlled by isComposingMessage state variabel) to do this within ChatViewScreen,
   * but really should be done by a Modal or separate screen. 
   */ 
    function composeMessage() {
      setIsComposingMessage(true);
    }
  
  return (
    <View>
      <Text>Social!</Text>
      <Text>{populateMoodBoard()}</Text>
    </View>
  );
}


const formatYAxisLabel = (value) => {
  return `${value * 100}`;
};

function StatusScreen() {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * 0.6;

  // State variables hold the completion data
  const [mealCompletion, setMealCompletion] = useState([0, 0, 0]);
  const [waterCompletion, setWaterCompletion] = useState([0]);
  const [sleepCompletion, setSleepCompletion] = useState([0]);
  const [hygieneCompletion, setHygieneCompletion] = useState([0]);
  
  useEffect(() => {
    const userEmail = email;
    const documentReference = doc(db, "App Storage", userEmail);
  
    getDoc(documentReference).then(documentSnapshot => {
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
  
        // Compute and set the meal completion percentages
        setMealCompletion([
          data.checkedBreakfast ? 100 : 0,
          data.checkedLunch ? 100 : 0,
          data.checkedDinner ? 100 : 0,
        ]);
  
        // Compute and set the water completion percentage
        setWaterCompletion([data.waterProgress * 100]);
  
        // Compute and set the sleep completion percentage
        setSleepCompletion([data.sleepProgress * 100]);
  
        // Compute and set the hygiene completion percentage
        setHygieneCompletion([data.hygieneProgress * 100]);

        console.log(data)

        console.log("getDoc setWaterCompletion:" + data.waterProgress + ", setMealCompletion: " + setMealCompletion + ", setSleepCompletion: " + data.sleepProgress + ", setHygieneCompletion: " + data.hygieneProgress)
  
      } else {
        console.log("No document exists for the specified user email:", userEmail);
      }
    }).catch(error => {
      console.error("Error fetching data for userEmail:", userEmail, error);
    });
  }, [email, db]);

  // Define the chart data using the state directly
  const mealChartData = {
    labels: ["Day One", "Day Two", "Day Three"],
    datasets: [{
      data: mealCompletion
    }]
  };

  // Continue using the state variables directly for the other charts
  const waterChartData = {
    labels: ["Day One", "Day Two", "Day Three"],
    datasets: [{
      data: waterCompletion,
      barColors: ["transparent", "transparent"]
    }]
  };

  const sleepChartData = {
    labels: ["Day One", "Day Two", "Day Three"],
    datasets: [{
      data: sleepCompletion
    }]
  };

  const hygieneChartData = {
    labels: ["Day One", "Day Two", "Day Three"],
    datasets: [{
      data: hygieneCompletion
    }]
  };
  
  // Configure chart settings
  const chartConfig = {
    backgroundColor: 'blue',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    // Add any other configuration you need for static y-axis labels here
  };

  console.log("Render StatusScreen with state:", {
    mealCompletion,
    waterCompletion,
    sleepCompletion,
    hygieneCompletion,
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <Text>Meal Completion</Text>
          <BarChart
            data={mealChartData}
            width={chartWidth}
            height={220}
            yAxisLabel="%"
            chartConfig={chartConfig}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text>Water Consumption</Text>
          <BarChart
            data={waterChartData}
            width={chartWidth}
            height={220}
            yAxisLabel="%"
            chartConfig={chartConfig}
            fromZero={true}
            // yAxisInterval={1} // Adjust this based on how many labels you want to show
            // yAxisRange={[0, 100]} // Optional: Define the range explicitly if needed
          />
        </View>

        <View style={styles.chartContainer}>
          <Text>Sleep Quality</Text>
          <BarChart
            data={sleepChartData}
            width={chartWidth}
            height={220}
            yAxisLabel="%"
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text>Hygiene Level</Text>
          <BarChart
            data={hygieneChartData}
            width={chartWidth}
            height={220}
            yAxisLabel="%"
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function SettingsScreen() {
  const navigation = useNavigation();
  return (
<View style={styles.container}>
    <Text> Enter Friend Username To Add: </Text>
    <TextInput style={styles.input}
    onSubmitEditing={(value) => addFriend(value.nativeEvent.text)}/>
    <Button title="Submit" onPress={() => addNewFriend()} color='green'/>
    <Button title = "Log Out"
      onPress={() => {loginProps.logOut(); navigation.navigate('Log In') }}>
      </Button>
    </View>
  );
}

function addNewFriend(){
    try {
      console.log("Wild. ")
      const friendPath = doc(db, "friends", email);
      setDoc(friendPath, {
        currentFriends:{
          friends: arrayUnion(friend)
        }
      }, {merge: true});
    } catch (error) {
      console.error("Error uploading string:", error);
    }
}

function updateMessage(){
  const friendPath = doc(db, "friends", email);
  setDoc(friendPath, {
      message: statusMessage
      //Add Any Other Social Screen Option here
  })
}


function UserScreen(){
  return(
      <MyTabs/>
  );
}


function SignInScreen(){
  const defaultEmail = "chaujannette@gmail.com";
  const defaultPassword = 'hellooo'

  setEmail("chaujannette@gmail.com")
  setPassword('hellooo')
  // Shared state for authentication 
  // const [email, setEmail] = useState(''); // Provide default email for testing
  // const [password, setPassword] = useState(''); // Provide default passwored for testing
  return(
    <View style={styles.fullScreenContainer}>
      <SignInOutPScreen 
        loginProps={loginProps} 
        auth={auth}/>
    </View>
  )
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Your Pet" component= {HomeScreen } />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

const stackN= createStackNavigator();

function MyStack() {
  const navigation = useNavigation();
  return (
    <StateContext.Provider value={allProps}>
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
          headerLeft: ()=> null,
        }} />
      <stackN.Screen name="Settings" component={SettingsScreen} />
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
    containerHome: {
    // alignItems: 'center',
    padding: 2,
    // justifyContent: 'space-between',

    // Add space between inlineContainer views
    paddingBottom: 10, // Space at the bottom of each container
  },
    fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch', // This will stretch the child components to fill the width
    padding: 20, // Adjust as needed
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