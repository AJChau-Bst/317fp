import { useState, useEffect } from "react";
import { Alert, Text, TextInput, View } from 'react-native';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
         signOut
  } from "firebase/auth";
import { Button } from 'react-native-paper';
import { emailOf } from './utils';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native'
export default function SignInOutPScreen( {auth, loginProps} ) {
  const navigation = useNavigation();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
      console.log(`on enter: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
      console.log(`on enter: emailOf(loginProps.loggedInUser)=${emailOf(loginProps.loggedInUser)}`);
      if (loginProps.email !== '' && loginProps.password !== '') {
      } 
      setErrorMsg('');

      return () => {
        // Executed when exiting component
        console.log(`on exit: emailOf(auth.currentUser)=${emailOf(auth.currentUser)}`);
        console.log(`on exit: emailOf(logingProps.loggedInUser)=${emailOf(loginProps.loggedInUser)}`);
      }
    }, []);

    function signUpUserEmailPassword() {
      console.log('called signUpUserEmailPassword');
      if (auth.currentUser) {
        signOut(auth); // sign out auth's current user (who is not loggedInUser, 
                       // or else we wouldn't be here
      }
      if (!loginProps.email.includes('@')) {
        setErrorMsg('Not a valid email address');
        return;
      }
      if (loginProps.password.length < 6) {
        setErrorMsg('Password too short');
        return;
      }
      // Invoke Firebase authentication API for Email/Password sign up 
      createUserWithEmailAndPassword(auth, loginProps.email, loginProps.password)
        .then((userCredential) => {
          console.log(`signUpUserEmailPassword: sign up for email ${loginProps.email} succeeded (but email still needs verification).`);
  
          // Clear email/password inputs
          loginProps.setEmail(loginProps.defaultEmail);
          loginProps.setPassword(loginProps.defaultPassword);
          console.log('signUpUserEmailPassword: about to send verification email');
          sendEmailVerification(auth.currentUser)
          .then(() => {
              console.log('signUpUserEmailPassword: sent verification email');
              setErrorMsg(`A verification email has been sent to ${loginProps.email}. You will not be able to sign in to this account until you click on the verification link in that email.`); 
              // Email verification sent!
              // ...
            });
        })
        .catch((error) => {
          console.log(`signUpUserEmailPassword: sign up failed for email ${loginProps.email}`);
          const errorMessage = error.message;
          // const errorCode = error.code; // Could use this, too.
          console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
          setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
        });
    }

    function signInUserEmailPassword() {
      console.log('called signInUserEmailPassword');
      console.log(`signInUserEmailPassword: emailOf(currentUser)0=${emailOf(auth.currentUser)}`); 
      console.log(`signInUserEmailPassword: emailOf(loginProps.loggedInUser)0=${emailOf(loginProps.loggedInUser)}`); 
      // Invoke Firebase authentication API for Email/Password sign in 
      // Use Email/Password for authentication 
      signInWithEmailAndPassword(auth, loginProps.email, loginProps.password)
                                 /* 
                                 defaultEmail ? defaultEmail : email, 
                                 defaultPassword ? defaultPassword : password
                                 */
        .then((userCredential) => {
          console.log(`signInUserEmailPassword succeeded for email ${loginProps.email}; have userCredential for emailOf(auth.currentUser)=${emailOf(auth.currentUser)} (but may not be verified)`); 
          console.log(`signInUserEmailPassword: emailOf(currentUser)1=${emailOf(auth.currentUser)}`); 
          console.log(`signInUserEmailPassword: emailOf(loginProps.loggedInUser)1=${emailOf(loginProps.loggedInUser)}`); 
  
          // Only log in auth.currentUser if their email is verified
          checkEmailVerification();
  
          // Clear email/password inputs 
          loginProps.setEmail(loginProps.defaultEmail);
          loginProps.setPassword(loginProps.defaultPassword);

          navigation.navigate('Main Screen')
      
          })
        .catch((error) => {
          console.log(`signUpUserEmailPassword: sign in failed for email ${loginProps.email}`);
          const errorMessage = error.message;
          // const errorCode = error.code; // Could use this, too.
          console.log(`signInUserEmailPassword: ${errorMessage}`);
          setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
        });
    }
  
    function checkEmailVerification() {
      if (auth.currentUser) {
        console.log(`checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`);
        if (auth.currentUser.emailVerified) {
          console.log(`checkEmailVerification: setLoggedInUser for ${auth.currentUser.email}`);
          loginProps.setLoggedInUser(auth.currentUser);
          console.log("checkEmailVerification: setErrorMsg('')");
          setErrorMsg('');
        } else {
          console.log('checkEmailVerification: remind user to verify email');
          setErrorMsg(`You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`)
        }
      }
    }

  return (
    <View style={styles.screen}>
      <View style={loginProps.loggedInUser === null ? styles.signInOutPane : styles.hidden}>
        <Text>SignInPane</Text>
        <View style={styles.labeledInput}>
            <Text style={styles.inputLabel}>Email:</Text>
    <TextInput style={styles.input} label="Username"
      onSubmitEditing={(value) => loginProps.setEmail(value)} />
    <Text style={styles.inputLabel}>Password:</Text>
    <TextInput
      style={styles.input}
      label="Password"
      secureTextEntry
      onSubmitEditing={(value) => loginProps.setPassword(value)}
    />
          </View>
          <View style={styles.labeledInput}>
          </View>
          <View style={styles.buttonHolder}>
            <Button
              mode="contained" 
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={() => signInUserEmailPassword()}>
                Sign In
            </Button>
            <Button
              mode="contained" 
              style={styles.button}
              labelStyle={styles.buttonText}
              onPress={() => signUpUserEmailPassword()}>
                Sign Up
            </Button>
          </View>
          <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
            <Text style={styles.errorMessage}>{errorMsg}</Text>
          </View>
      </View>
    </View>
 );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
jsonContainer: {
    flex: 1,
    width: '98%',
    borderWidth: 1,
    borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
    borderColor: 'blue',
},
json: {
    padding: 10, 
    color: 'blue', 
},
  subComponentContainer: {
    padding: 10, 
    color: 'blue', 
    borderWidth: 1,
    borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
    borderColor: 'coral',
    backgroundColor: 'pink',
  },
  buttonHolder: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'center',
  },
  hidden: {
    display: 'none',
  },
  visible: {
    display: 'flex',
  },
loginLogoutPane: {
    flex: 3, 
    alignItems: 'center',
    justifyContent: 'center',
}, 
labeledInput: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
}, 
inputLabel: {
    fontSize: 20,
}, 
textInput: {
    width: "80%",
    fontSize: 20,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
},
buttonHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    flexWrap: 'wrap',

},
button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'steelblue',
    margin: 3,
},
buttonDisabled: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'powderblue',
    margin: 3,
},
buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
},
smallButtonText: {
  fontSize: 13,
  fontWeight: 'bold',
  color: 'white',
},
errorBox: {
    width: '80%',
    borderWidth: 1,
    borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
    borderColor: 'red',
},
errorMessage: {
    color: 'red',
    padding: 10, 
},
chatPane: {
  flex: 1,
  width:'100%',
  alignItems: "center",
  backgroundColor: 'white',
},
header: {
  marginTop: 10,
  fontSize: 25,
  fontWeight: 'bold'
},
pickerStyles:{
  width:'70%',
  backgroundColor:'plum',
  color:'black'
},
messageList: {
  width:'90%',
  marginTop: 5,
},
messageItem: {
  marginTop: 5,
  marginBottom: 5,
  backgroundColor:'bisque',
  color:'black',
  borderWidth: 1,
  borderColor: 'blue',
},
messageDateTime: {
  paddingLeft: 5,
  color:'gray',
},
messageAuthor: {
  paddingLeft: 5,
  color:'blue',
},
messageContent: {
  padding: 5,
  color:'black',
},
composePane: {
  width:'100%',
  borderWidth: 1,
  borderColor: 'blue',
},
textInputArea: {
  fontSize: 14, 
  padding: 5,
},
composeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'salmon',
    margin: 5,
    marginLeft: 10,
},
composeButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
},
signInOutPane: {
  flex: 3, 
  alignItems: 'center',
  justifyContent: 'center',
},
container: {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: '#ecf0f1',
  padding: 20,
  width: '100%',
  height: '100%', 
},
input: {
  borderColor: "gray",
  width: "50%",
  margin: "auto",
  borderWidth: 1,
  borderRadius: 10,
  padding: 10,
},
});
