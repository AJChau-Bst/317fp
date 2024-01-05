import { useState, useEffect, useContext, Component } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import StateContext from './StateContext.js';
import { getDoc, arrayUnion, setDoc, doc } from "firebase/firestore";
import styles from "./styles.js";


export default function SocialScreen() {

    const [isComposingMessage, setIsComposingMessage] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    const [friendMessages, setFriendMessages] = useState([]);

    const { firebaseProps, socialProps } = useContext(StateContext);
    console.log("here is socialProps: ", socialProps);
    const db = firebaseProps.db;
    const auth = firebaseProps.auth;
    const email = auth.currentUser?.email



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

    //pausing this a moment as we work on the friendsScreen
    function retriveMessages(friendsList) {
        //console.log("email in fetchFriends: ", email)
        friendsList.array.map
            (element => {
                const docRef = doc(db, "MoodMessages", element);
                //console.log("This is the docRef: ", docRef);
                getDoc(docRef).then(
                    (docSnap) => {
                        if (docSnap.exists()) {
                            //console.log("This is the docSnap: ", docSnap.data());
                            setFriendMessages(prevList => ([...prevList, docSnap.data().currentMood]));
                            //console.log(friendsList);
                        } else {
                            // docSnap.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    });

            });

        //a function to format the friend messages that are displayed
        // want to grab from the friend array --> then take the pet name
        // and grab their status message
        // i think it can return a JSX component
    }
    //retriveMessages(friendsList)
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
            <Text> Social Screen! </Text>
            <Text>friendMessages</Text>
        </View>

    )

}