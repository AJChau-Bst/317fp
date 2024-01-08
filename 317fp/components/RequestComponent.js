import * as React from 'react';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import { useState, useEffect, useContext, Component } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import StateContext from './StateContext.js';
import styles from "./styles.js";

export default function RequestComponent({ incomingReqEmail }) {
    const [waitingApproval, setWaitingApproval] = useState(true);
    const [rejected, setIsRejected] = useState(false);
    const [accepted, setIsAccepted] = useState(false);

    return (
        <Button mode="contained" onPress={() => console.log('Pressed')}>
            Accept
        </Button>
    );
}

