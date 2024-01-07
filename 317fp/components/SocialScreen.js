import { useState, useEffect, useContext, Component } from 'react';
import { Button, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import StateContext from './StateContext.js';
import { getDoc, arrayUnion, set, addDoc, setDoc, getDocs, doc, query, onValue, collection, where } from "firebase/firestore";
import styles from "./styles.js";
import MoodMessage from './MoodMessage.js';


export default function SocialScreen() {

    const [isComposingMessage, setIsComposingMessage] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    const [friendMessages, setFriendMessages] = useState([]);
    const [moodMessageInputText, setMoodMessageInputText] = useState("");


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

                    // compare the friendArray, if it hasn't changed don't call setFriends
                    if (JSON.stringify(docSnap.data().friendArray) !== JSON.stringify(friendsList)) {
                        setFriendsList(prevFriendList => (docSnap.data().friendArray));
                    }
                    //console.log(friendsList);
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
            });

    }
    fetchFriends();

    function turnISOtoNormal(time) {
        let date = new Date(time);
        return date.toLocaleString();
    }

    function docToMoodMessage(inputDoc) {
        const data = inputDoc.data();
        return { ...data, date: turnISOtoNormal(data.timestamp) }

    }
    function currentMoodAsData() {

    }




    //pausing this a moment as we work on the friendsScreen
    function retriveMessagesFromFirebase(listOfFriends) {
        const messages = [];
        //console.log("email in fetchFriends: ", email)
        listOfFriends.map((element) => {
            console.log("this is my elm: ", element);
            const docRef = doc(db, "MoodMessages", element);
            getDoc(docRef).then(
                (docSnap) => {
                    if (docSnap.exists()) {
                        console.log("This is the docSnap: ", docSnap.data());
                        console.log("we're pushing!");
                        messages.push(docToMoodMessage(docSnap));
                        console.log("here's message post docSnap push: ", messages);
                        // could make a doc.message to fix the timestamp
                    }
                    else {
                        // docSnap.data() will be undefined in this case
                        console.log("No such document!");
                    }
                });

        });
        // first issue is that message ends empty, so there is some issue there
        // i changed to "===" instead of "!===" and got an error
        // Type Error setFreindMessages as Read Only
        console.log("here's the messages: ", JSON.stringify(messages));
        if (JSON.stringify(messages) !== JSON.stringify(friendMessages)) {
            console.log("the two are different!");
            setFriendMessages = (messages);
        }
    };
    retriveMessagesFromFirebase(friendsList)
    const MoodMessageItem = ({ message }) => {
        return (
            <View>
                <Card>
                    <Card.Title title={message.email + "'s MoodMessage"} />
                    <Card.Content>
                        <Text variant="bodyMedium">
                            {message.currentMood}
                        </Text>
                        <Text variant="bodyMedium">
                            Posted at: {message.date}
                        </Text>
                    </Card.Content>
                </Card>
            </View>
        );
    }

    function writeMoodMessage() {
        setMoodMessageInputText(''); // clear text input for next time
        const now = new Date();
        const timestampString = JSON.stringify(now.getTime()); // millsecond timestamp

        setDoc(doc(db, 'MoodMessages', email), {
            currentMood: moodMessageInputText,
            email: email,
            timestamp: timestampString
        });

        return (
            <View>

            </View>
        )

    };

    return (
        <View>
            <Text> Social Screen! </Text>
            <Text>Write Your MoodMessage</Text>
            <TextInput
                style={styles.friendInput}
                onChangeText={setMoodMessageInputText}
                onSubmitEditing={() => writeMoodMessage(moodMessageInputText)}
                value={moodMessageInputText}
                placeholder="tell your friends how you're feeling"
                keyboardType="default"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={true}
            />
            <Text>Your Current Mood</Text>
            {(friendMessages.length === 0) ?
                <Text></Text> :
                <Text></Text>
            }
            <MoodMessageItem message={datum.item}></MoodMessageItem>
            <Text>Friend's Mood Messages</Text>
            {(friendMessages.length === 0) ?
                <Text>Your Friends Haven't Posted Their Moods Yet</Text> :
                <FlatList style={styles.messageList}
                    data={friendMessages}
                    renderItem={datum =>
                        <MoodMessageItem message={datum.item}></MoodMessageItem>
                    }
                    // keyExtractor extracts a unique key for each item, 
                    // which removes warnings about missing keeys 
                    keyExtractor={item => item.timestamp}
                />

            }</View>
    )

}