import { NavigationContainer, Navigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { emailOf } from './utils.js';
import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDoc, arrayUnion, setDoc, doc } from "firebase/firestore";
import * as Location from 'expo-location';
import StateContext from './components/StateContext.js';
import FriendsScreen from "./components/FriendsScreen.js";
import SocialScreen from "./components/SocialScreen.js";
import styles from "./components/styles.js";

export default function App() {

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

//Create Authentication Use States
const [loggedInUser, setLoggedInUser] = useState(null);
//const [email, setEmail] = useState(""); //input email
//const [password, setPassword] = useState(""); //input password
const [email, setEmail] = useState("ma108@wellesley.edu"); //testing email
const [password, setPassword] = useState("password"); //testing password
const [friend, addFriend] = useState([]);

  //Create Health Use States
  const [checkedBreakfast, setCheckedBreakfast] = useState(false);
  const [checkedLunch, setCheckedLunch] = useState(false);
  const [checkedDinner, setCheckedDinner] = useState(false);
  const [waterProgress, setWaterProgress] = useState(0);
  const [hygieneProgress, setHygieneProgress] = useState(0);
  const [sleepProgress, setSleepProgress] = useState(0);
  const [petName, setPetName] = useState(0);

  //Create Social Use States
  const [statusMessage, setStatusMessage] = useState("")
  const [friendMessages, setFriendMessages] = useState([]); //
  const [liked, setLiked] = useState("")
  const [emoji, setemoji] = useState("");
  const [isComposingMessage, setIsComposingMessage] = useState(false);

  //Create Props for Contexts
  const healthProps = { checkedBreakfast, setCheckedBreakfast, checkedLunch, setCheckedLunch, checkedDinner, setCheckedDinner, waterProgress, setWaterProgress, hygieneProgress, setHygieneProgress, sleepProgress, setSleepProgress, petName, setPetName };
  const loginProps = { loggedInUser, setLoggedInUser, logOut, email, setEmail, password, setPassword, friend, addFriend }
  const socialProps = { email, setEmail, friend, addFriend, statusMessage }
  const firebaseProps = {auth, db}
  const allProps = { loginProps, healthProps, socialProps, firebaseProps }


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

  // Image States
  const images = {
    happy: require('./happycat.png'),
    sad: require('./sadcat.png'),
    neutral: require('./neutralcat.png')
  }

  function MapScreen() {
    let subscription = null;
    const [showTextbox, setShowTextbox] = useState(false);
    const [showStartRec, setStartRec] = useState(true);
    const [showEndRec, setEndRec] = useState(false);
    const [showAddMarker, setAddMarker] = useState(false);
    const [permissionText, setPermissionText]
      = useState('Location permission not requested yet');

    const [showMap, setShowMap] = useState(false);
    const [myCoord, setMyCoord] = useState(null);
    const [coords, setCoords] = useState([])

    async function startTracking() {
      setStartRec(false);
      setEndRec(true);
      setAddMarker(true);

      let perm = await Location.requestForegroundPermissionsAsync();
      setPermissionText(perm);
      if (perm.status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Shut down a foreground service subscription that's already running
      if (subscription !== null) {
        console.log('Stopping active location subscription service.')
        subscription.remove();
      }

      //Reset myCoord and coords state variables for new tracking session 
      setMyCoord(null)
      setCoords([]);

      console.log('Starting location subscription service.')
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 1
        },
        newLocation => {
          const newCoord = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude
          }
          console.log('Moved to new coord.', newCoord);
          console.log('myCoord =', myCoord, '; coords =', coords);
          setMyCoord(prevMyCoord => {
            console.log('prevMyCoord =', prevMyCoord);
            return newCoord;
          });
          setCoords(prevCoords => {
            console.log('prevCoords =', prevCoords);
            return [...prevCoords, newCoord];
          });
        })
    }
    // Stop foreground location tracking
    function stopTracking() {
      setEndRec(false);
      if (subscription !== null) {
        console.log('Stopping active location subscription service.')
        subscription.remove();
      }
      setShowStartRec(true)
    };
    return (
      <SafeAreaView style={styles.container}>
        {(myCoord === null) ?
          <Text>Waiting for location to display map ...</Text> :
          <MapView style={styles.map}
            initialRegion={{
              latitude: myCoord.latitude,
              longitude: myCoord.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsCompass={true}
            showsUserLocation={true}
            rotateEnabled={true}
          >
          </MapView>}
        <View style={styles.controls}>
          {showStartRec && <Button title="Start Tracking" onPress={startTracking} color='green' />}
          {showEndRec && <Button title="Stop Tracking" onPress={stopTracking} color='red' />}
        </View>
      </SafeAreaView>
    );
  }

  // The Main Pet Screen
  function HomeScreen() {
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
              color='pink' />
            <TouchableOpacity onPress={handleAddWater} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text>Breakfast!</Text>
            <Checkbox
              style={styles.elementHome}
              value={checkedBreakfast}
              onValueChange={setCheckedBreakfast} />
            <Text>Lunch!</Text>
            <Checkbox
              style={styles.elementHome}
              value={checkedLunch}
              onValueChange={setCheckedLunch} />
            <Text>Dinner!</Text>
            <Checkbox
              style={styles.elementHome}
              value={checkedDinner}
              onValueChange={setCheckedDinner} />
          </View>

          <View style={styles.inlineContainer}>
            <Text>Sleep </Text>
            <Progress.Bar
              progress={sleepProgress}
              width={200}
              height={30}
              borderRadius={8}
              color='blue' />
            <TouchableOpacity onPress={handleAddSleep} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.inlineContainer}>
            <Text>Hygiene </Text>
            <Progress.Bar
              progress={hygieneProgress}
              width={200}
              height={30}
              borderRadius={8}
              color='green' />
            <TouchableOpacity onPress={handleAddHygiene} style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <Button title="Save Data" onPress={saveProgressToFirebase} color='red' />
          <Button title="Get Data" onPress={getData} color='blue' />
        </ScrollView>
      </SafeAreaView>
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
          onSubmitEditing={(value) => addFriend(value.nativeEvent.text)} />
        <Button title="Submit" onPress={() => addNewFriend()} color='green' />
        <Button title="Log Out"
          onPress={() => { loginProps.logOut(); navigation.navigate('Log In') }}>
        </Button>
      </View>
    );
  }

  //Updated Friends List
  //function addNewFriend(){
  //try {
  //const friendPath = doc(db, "friends", email);
  //setDoc(friendPath, {
  //currentFriends:{
  //friends: arrayUnion(friend)
  //}
  //}, {merge: true});
  //console.log("Updated Friends List")
  //} catch (error) {
  //console.error("Error uploading string:", error);
  //}
  //}

  //Update Social Use States
  function updateMessage() {
    const friendPath = doc(db, "friends", email);
    setDoc(friendPath, {
      message: statusMessage
      //Add Any Other Social Screen Option here
    })
  }


  function UserScreen() {
    return (
      <MyTabs />
    );
  }


  function SignInScreen() {
    const defaultEmail = "chaujannette@gmail.com";
    const defaultPassword = 'hellooo'

  //Default
  // setEmail("chaujannette@gmail.com")
  // setPassword('hellooo')
  
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
        {/*<Tab.Screen name="Your Pet" component={HomeScreen} /> */}
        <Tab.Screen name="Social" component={SocialScreen} />
        <Tab.Screen name="Friends" component={FriendsScreen} />
        {/*<Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Map" component={MapScreen} />*/}
      </Tab.Navigator>
    );
  }

  const stackN = createStackNavigator();

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
              headerLeft: () => null,
            }} />
          <stackN.Screen name="Settings" component={SettingsScreen} />
        </stackN.Navigator>
      </StateContext.Provider>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
