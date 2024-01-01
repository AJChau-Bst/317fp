import { useState, useEffect, useContext, Component } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import StateContext from './StateContext.js';
import { getDoc, arrayUnion, setDoc, doc } from "firebase/firestore";
import styles from "./styles.js";


export default function FriendsScreen() {

  const [friendInputText, setFriendInputText] = useState('');
  const [isRequestingFriend, setIsRequestingFriend] = useState(false);
  const [friendsList, setFriendsList] = useState([])


  const { firebaseProps, socialProps } = useContext(StateContext);
  console.log("here is socialProps: ", socialProps);
  const db = firebaseProps.db;
  const auth = firebaseProps.auth;
  const email = auth.currentUser?.email

  /*async function requestFriend(friendEmail) {
    const now = new Date();
    const curTimestamp = now.getTime()
    await setDoc(doc(db, "FriendRequests", curTimestamp),
      {
        requestTo: friendEmail,
        requestFrom: email,
        timestamp: curTimestamp,

      });
  }*/

  function fetchFriends() {
    //console.log("email in fetchFriends: ", email)
    const docRef = doc(db, "FriendsLists", email);
    console.log("This is the docRef: ", docRef);
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
        <ul>{JSON.stringify(element)}</ul>
      )
    });
  }*/

  //we'll probably sort it into two different sections
  // the top will give you the option to add a friend
  return (
    <View>
      <Text>Friends Screen!</Text>
      <TextInput
        style={styles.friendInput}
        onChangeText={setFriendInputText}
        value={friendInputText}
        placeholder="sample@email.com"
      />
      <Text>{email}'s friends</Text>
      <Text>{JSON.stringify(friendsList)}</Text>

    </View>

  )

}