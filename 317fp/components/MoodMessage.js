import * as React from 'react';
import { useState, useEffect, useContext, Component } from 'react';
import { Button, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import StateContext from './StateContext.js';
import { getDoc, arrayUnion, setDoc, doc } from "firebase/firestore";
import styles from "./styles.js";

export default function MoodMessage({ friendEmail, friendMessage, timestampString }) {
    return (
        <Card>
            <Card.Title title={friendEmail + "'s MoodMessage"} />
            <Card.Content>
                <Text variant="bodyMedium">{friendMessage}</Text>
                <Text variant="bodyMedium">Posted at: {timestampString}</Text>
            </Card.Content>
        </Card>
    );
}