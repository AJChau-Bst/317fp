import { useState, useEffect, useContext, Component } from 'react';
import { Button, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import StateContext from './StateContext.js';
import { getDoc, arrayUnion, set, addDoc, setDoc, getDocs, doc, query, onValue, collection, where } from "firebase/firestore";
import styles from "./styles.js";
import MoodMessage from './MoodMessage.js';


export default function SocialScreen() {

    const [hasComposedMessage, setHasComposedMessage] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    const [friendMessages, setFriendMessages] = useState([]);
    const [moodMessageInputText, setMoodMessageInputText] = useState("");
    const [currentMood, setCurrentMood] = useState("")


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
        setCurrentMood(prevMood => (moodMessageInputText));
        setHasComposedMessage(true);
        setMoodMessageInputText(''); // clear text input for next time
        const now = new Date();
        const timestampString = JSON.stringify(now.getTime()); // millsecond timestamp

        setDoc(doc(db, 'MoodMessages', email), {
            currentMood: moodMessageInputText,
            email: email,
            timestamp: timestampString
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
            <Text>Your Current Mood</Text>
            {(hasComposedMessage) ?
                <Card>
                    <Card.Title title={email + "'s MoodMessage"} />
                    <Card.Content>
                        <Text variant="bodyLarge">{currentMood}</Text>
                        <Text variant="bodySmall">Posted at: will be real once i figure out firebase!</Text>
                    </Card.Content>
                </Card> :
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