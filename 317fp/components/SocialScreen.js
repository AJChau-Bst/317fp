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


    function populateMoodBoard() {
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
          <Text> Social Screen! </Text>  
        </View>
    
      )

}