import { useState, useEffect, useContext, Component } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import StateContext from './StateContext.js';
import { getDoc, arrayUnion, setDoc, doc } from "firebase/firestore";
import styles from "./styles.js";


export default function FriendsScreen() {

  const [friendInputText, setFriendInputText] = useState('');
  const [isRequestingFriend, setIsRequestingFriend] = useState(false);
  const [friendsList, setFriendsList] = useState([])
  const [testerString, setTesterString] = useState("test!");


  const { firebaseProps, socialProps } = useContext(StateContext);
  //console.log("here is socialProps: ", socialProps);
  const db = firebaseProps.db;
  const auth = firebaseProps.auth;
  const email = auth.currentUser?.email

// this is still in progress!
// a little unsure about the async lol
//results in unhandled promise rejection errors
  async function requestFriend(friendEmail) {
    const now = new Date();
    const curTimestampString = now.getTime().toString()
    await setDoc(doc(db, "FriendRequests", curTimestampString),
      {
        requestTo: friendEmail,
        requestFrom: email,
        timestamp: curTimestampString,

      });
      setTesterString(prevString => ("yay! friend requested"))
  }

  //issues with "set"
  function writeFriendRequest(friendEmail) {
    //here's something else i found?
    //const cityRef = doc(db, 'cities', 'BJ');
    //setDoc(cityRef, { capital: true }, { merge: true });

    const now = new Date();
    const curTimestamp = now.getTime()
    set(ref(db, "FriendRequestList", curTimestamp)), {
      requestTo: friendEmail,
      requestFrom: email,
      timestamp: curTimestamp,
    };
  }

  function fetchFriends() {
    //console.log("email in fetchFriends: ", email)
    const docRef = doc(db, "FriendsLists", email);
    //console.log("This is the docRef: ", docRef);
    getDoc(docRef).then(
      (docSnap) => {
        if (docSnap.exists()) {
          //console.log("This is the docSnap: ", docSnap.data());
          setFriendsList(prevFriendList => (docSnap.data().friendArray));
          //console.log(friendsList);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      });

  } 
  fetchFriends();
  /*
  // need to do like a whole components thing? maybe make it a touchable opacity? who knows
  function formatFriends(friendArr) {
    friendArr.forEach(element => {
      return (
        <Ul>{JSON.stringify(element)}</Ul>
      )
    });
  }*/
  function testerEnter(){ 
    setTesterString(prev => ("hello"));
    return 0;
   }

  //we'll probably sort it into two different sections
  // the top will give you the option to add a friend
  return (
    <View>
      <Text>Friends Screen! </Text>
      <Text>Request Friends</Text>
      <TextInput
        style={styles.friendInput}
        onChangeText={setFriendInputText}
        onSubmitEditing={() => requestFriend(friendInputText)}
        value={friendInputText}
        placeholder="sample@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />
      
      <Text> Pending Requests </Text>
      <Text>{testerString}</Text>
      <Text> Incoming Requests </Text>
    

      <Text>{email}'s friends</Text>
    <View>
    <Text>{JSON.stringify(friendsList)}</Text>
    </View>

    </View>

  )

}