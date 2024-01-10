import { useState, useEffect, useContext, Component } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import StateContext from './StateContext.js';
import { getDoc, set, arrayUnion, addDoc, updateDoc, setDoc, getDocs, doc, query, onValue, collection, where } from "firebase/firestore";
import styles from "./styles.js";


export default function FriendsScreen() {

  const [friendInputText, setFriendInputText] = useState('');
  const [friendsList, setFriendsList] = useState([])
  const [confirmationString, setConfirmationString] = useState("");

  //requestList state hook would be used in tandem with the
  //inactive request friends function
  const [requestList, setRequestList] = useState([]);

  /*
  the approvalList state hook is used in the defunct
  recieveRequests function
  const [approvalList, setApprovalList] = useState([]);
  */


  const { firebaseProps } = useContext(StateContext);
  const db = firebaseProps.db;
  const auth = firebaseProps.auth;
  const email = auth.currentUser?.email

  /*
    An unused and partially functional function to write
    friend requests to firebase. While the function of retreiving requests
    is not operational, this function will succesfully write the friend request
    For the future, we would like to add a conditional that will not allow
    Friend requests to be put in if the user has already requested the friend 
  */
  async function requestFriend(friendEmail) {
    const now = new Date();
    const curTimestampString = now.getTime().toString()

    await setDoc(doc(db, "FriendRequests", curTimestampString),
      {
        requestTo: friendEmail,
        requestFrom: email,
        timestamp: curTimestampString,

      });

    setConfirmationString(prevString => ("your friend request was sent"));
    setRequestList(prevList => [...prevList, friendEmail]);
  }

  async function addFriend(friendEmail) {

    const docRef = doc(db, "FriendsLists", email);

    
    const newFriendArray = [...friendsList, friendEmail];
    console.log("here's the friends list: ", newFriendArray);
    const userFriendRef = doc(db, "FriendsLists", email);
    await updateDoc(userFriendRef, {
      friendArray: newFriendArray
    });
    setConfirmationString(prevString => ("They were added to your friends list"));
    setFriendInputText("");
    setFriendsList(prevList => [...prevList, friendEmail]);

  }



  /*
  The bones of a recieveRequest function that is not functional
  Leaving the code here for future development purposes
  */
  /*
  async function recieveRequests() {
    const friendRequestsRef = collection(db, "FriendRequests");
    //to make sure we're not rerendering the page!
    var docRecieveList = [];
    //grabbing all documents that are particularly requesting the user
    const q = query(friendRequestsRef, where("requestTo", "==", email));
    //retrive results of the query
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      docRecieveList = [...docRecieveList, doc.data().requestFrom]
      console.log("Helper List Value: ", docRecieveList);
      //setApprovalList(prevList => [...prevList, doc.data().requestFrom]);
      //if (JSON.stringify(docRecieveList) !== JSON.stringify(approvalList)) {
        //setApprovalList(prevList => [...prevList, doc.data().requestFrom]);
      //}
    });
  }
  */

  function fetchFriends() {
    //console.log("email in fetchFriends: ", email)
    const docRef = doc(db, "FriendsLists", email);
    //console.log("This is the docRef: ", docRef);
    getDoc(docRef).then(
      (docSnap) => {
        if (docSnap.exists()) {
          //console.log("This is the docSnap: ", docSnap.data());

          // compare the friendArray, if it hasn't changed don't call setFriends
          if (JSON.stringify(docSnap.data().friendArray) !== JSON.stringify(friendsList)) {
            setFriendsList(prevFriendList => (docSnap.data().friendArray));
          }
          //console.log(friendsList);
        } else {

          setDoc(docRef, { friendArray: [] });

          // docSnap.data() will be undefined in this case

          console.log("No such document!");
        }
      });

  }
  fetchFriends();
  return (
    <View>
      <Text>Add Friends</Text>
      <TextInput
        style={styles.friendInput}
        onChangeText={setFriendInputText}
        onSubmitEditing={() => addFriend(friendInputText)}
        value={friendInputText}
        placeholder="sample@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />

      <Text>{confirmationString}</Text>


      <Text>{email}'s friends</Text>
      <View>
        <Text>{JSON.stringify(friendsList)}</Text>
      </View>

    </View>

  )

}