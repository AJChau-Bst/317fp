import { useState, useEffect, useContext, Component } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import StateContext from './StateContext.js';
import { getDoc, arrayUnion, setDoc, doc, query, onValue, collection } from "firebase/firestore";
import styles from "./styles.js";


export default function FriendsScreen() {

  const [friendInputText, setFriendInputText] = useState('');
  const [isRequestingFriend, setIsRequestingFriend] = useState(false);
  const [friendsList, setFriendsList] = useState([])
  const [confirmationString, setConfirmationString] = useState("test!");
  const [requestList, setRequestList] = useState([]);
  const [approvalList, setApprovalList] = useState([]);


  const { firebaseProps, socialProps } = useContext(StateContext);
  //console.log("here is socialProps: ", socialProps);
  const db = firebaseProps.db;
  const auth = firebaseProps.auth;
  const email = auth.currentUser?.email

  //need to add an if statement
  async function requestFriend(friendEmail) {
    const now = new Date();
    const curTimestampString = now.getTime().toString()

    await setDoc(doc(db, "FriendRequests", curTimestampString),
      {
        requestTo: friendEmail,
        requestFrom: email,
        timestamp: curTimestampString,

      });

    setConfirmationStringconfirmationString(prevString => ("your friend request was sent"));
    setFriendInputText("");
    setRequestList(prevList => [...prevList, friendEmail]);
  }

  //once again causing a million unhandled promises
  async function recieveRequests() {
    const friendRequestsRef = collection(db, "FriendRequests");
    //grabbing all documents that are particularly requesting the user
    const q = query(friendRequestsRef, where("requestTo", "==", email));
    //retrive results of the query
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setApprovalList(prevList => [...prevList, doc.data().requestFrom]);
    });
  }
  recieveRequests();

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
      <Text>{JSON.stringify(requestList)}</Text>
      <Text>{confirmationString}</Text>
      <Text> Incoming Requests </Text>
      <Text>{JSON.stringify(approvalList)}</Text>


      <Text>{email}'s friends</Text>
      <View>
        <Text>{JSON.stringify(friendsList)}</Text>
      </View>

    </View>

  )

}