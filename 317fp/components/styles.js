import { StyleSheet } from 'react-native';
import * as React from 'react';
const styles = StyleSheet.create({
    containerHome: {
      // alignItems: 'center',
      padding: 2,
      // justifyContent: 'space-between',
  
      // Add space between inlineContainer views
      paddingBottom: 10, // Space at the bottom of each container
    },
    fullScreenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch', // This will stretch the child components to fill the width
      padding: 20, // Adjust as needed
    },
    inlineContainer: {
      flexDirection: 'row', // Aligns children horizontally
      alignItems: 'center', // Centers children vertically in the container
      marginBottom: 20, // Add bottom margin to each inlineContainer
      marginTop: 20
  
    },
    chartContainer: {
      marginBottom: 20, // Space between charts
    },
    testButtonStyle: {
      backgroundColor: 'red', // Example color for visibility
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      marginTop: 20
    },
  
    buttonStyle: {
      backgroundColor: '#DA63E9', // Example background color
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginLeft: 10
    },
    buttonText: {
      color: 'white', // Example text color
      fontSize: 16,
    },
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
    },
    petImage: {
      justifyContent: 'center',
      width: 300,
      height: 300,
      resizeMode: 'contain'
  
    },
    elementHome: {
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 10,
    },
    map: {
      flex: 2,
      width: '100%',
      height: '100%',
    },
    controls: {
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'cyan'
    },
    friendInput: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    personalMoodMessage: {
      backgroundColor: 'pink',
    },
  });
  export default styles;