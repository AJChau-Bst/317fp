import * as React from 'react';
import { useState, useEffect} from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'

export default function Settings() {
    const navigation = useNavigation();
    return (
  <View style={styles.container}>
      <Text> Enter Friend Username To Add: </Text>
      <TextInput style={styles.input}
      onSubmitEditing={(value) => addFriend(value.nativeEvent.text)}/>
      <Button title="Submit" onPress={() => addNewFriend()} color='green'/>
      <Button title = "Log Out"
        onPress={() => {loginProps.logOut(); navigation.navigate('Log In') }}>
        </Button>
      </View>
    );
  }

  const styles = StyleSheet.create({

    input: {
    borderColor: "gray",
    width: "50%",
    margin: "auto",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }})