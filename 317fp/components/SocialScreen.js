import { useState, useEffect, useContext, Component } from 'react';
import { Button, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import StateContext from './StateContext.js';
import { getDoc, arrayUnion, set, addDoc, setDoc, getDocs, doc, query, onValue, collection, where } from "firebase/firestore";
import styles from "./styles.js";
import MoodMessage from './MoodMessage.js';
import { simpleValueEquals, simpleObjectEquals } from "../equalityUtils.js";


export default function SocialScreen() {

    const [hasComposedMessage, setHasComposedMessage] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    const [friendMessages, setFriendMessages] = useState([]);
    const [moodMessageInputText, setMoodMessageInputText] = useState("");
    const [currentMood, setCurrentMood] = useState("");



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
        console.log("here's the date in turnISOtoNormal: ", date);
        console.log("the toLocaleString function: ", date.toLocaleString());
        return date.toLocaleString();
    }

    function docToMoodMessage(inputDoc) {
        console.log("docToMoodMessage inputDoc: ", inputDoc);
        const data = inputDoc.data();
        console.log("here's the data in docToMoodMessage: ", data);
        return { ...data, date: turnISOtoNormal(JSON.parse(data.timestamp)) }

    }
    function userMoodToMoodMessage() {
        const docRef = doc(db, "MoodMessages", email);
        getDoc(docRef).then(
            (docSnap) => {
                if (docSnap.exists()) {
                    console.log("what we're returning", docToMoodMessage(docSnap));
                    return (docToMoodMessage(docSnap));
                    //console.log(friendsList);
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
            });

    }


    /*
        function retrieveMessagesFromFirebase(listOfFriends) {
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
                        }
                        else {
                            // docSnap.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    });
    
            });
            // the message array ends empty? and I'm not quite sure why
            console.log("here's the messages: ", JSON.stringify(messages));
            if (JSON.stringify(messages) !== JSON.stringify(friendMessages)) {
                console.log("the two are different!");
                setFriendMessages(messages);
            }
        };
        */
    // Returns a *promise* for a document snapshot
    function getDocSnapshotPromise(friendEmail) {
        console.log("this is friendEmail: ", friendEmail);
        const docRef = doc(db, "MoodMessages", friendEmail);
        return getDoc(docRef); 
    }
    function messageListEquals(mList1, mList2) {
        // console.log("Calling messageListEquals ", mList1, mList2);
        const len1 = mList1.length;
        const len2 = mList2.length;
        result = (len1 === len2)
            && mList1.every((obj, index) => simpleObjectEquals(obj, mList2[index]));
        // console.log("messageListEquals returns", result);
        return result;
    }

    function retrieveMessagesFromFirebase(listOfFriends) {
        console.log("In retrieveMessagesFromFirebase, listOfFriends is", JSON.stringify(listOfFriends))
        // here's our issue atm, the getDocSnapshotPromise
        const docSnapshotPromiseList = listOfFriends.map(getDocSnapshotPromise);
        console.log("In retrieveMessagesFromFirebase, docSnapshotPromiseList is", JSON.stringify(docSnapshotPromiseList))
        Promise.all(docSnapshotPromiseList).then(docSnaps => {
            const newFriendMessages = docSnaps.map(docToMoodMessage);
            console.log("In retrieveMessagesFromFirebase, newFriendMessages is", newFriendMessages);
            console.log("In retrieveMessagesFromFirebase, friendMessages is", friendMessages);
            if (!messageListEquals(newFriendMessages, friendMessages)) {
                console.log("In retrieveMessagesFromFirebase, setFriendMessages to newFriendMessages.")
                setFriendMessages(newFriendMessages);
            }
        })};


        retrieveMessagesFromFirebase(friendsList)
        const MoodMessageItem = ({ message }) => {
            console.log("message before it broke: ", message);
            return (
                <View>
                    <Card>
                        <Card.Title title={message.currentMood} titleStyle={{ color: "green" }} />
                        <Card.Content>
                            <Text variant="bodyMedium">
                                Posted by your friend: {message.email}
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
            setCurrentMood(prevMood => (moodMessageInputText));
            setHasComposedMessage(true);
            setMoodMessageInputText(''); // clear text input for next time
            const now = new Date();
            const timestampInt = now.getTime(); // millsecond timestamp

            setDoc(doc(db, 'MoodMessages', email), {
                currentMood: moodMessageInputText,
                email: email,
                timestamp: timestampInt
            });

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
                {(hasComposedMessage) ?
                    <View style={styles.personalMoodMessage}>
                        <Card>
                            <Card.Title title={currentMood} titleStyle={{ color: "pink" }} />
                            <Card.Content>
                                <Text variant="headlineMedium">Posted by you: {email}</Text>
                                <Text variant="bodySmall">Posted at: will be real once i figure out firebase!</Text>
                            </Card.Content>
                        </Card>
                    </View>
                    :
                    <Text> You have yet to post your first Mood </Text>
                }
                <Text> Friend's Mood Messages</Text>
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