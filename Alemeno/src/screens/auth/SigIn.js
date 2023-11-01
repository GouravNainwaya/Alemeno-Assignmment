import axios, { all } from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import ClientUrl from '../../../config';

const SignIn = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState()

  const requestData = {
    username: name.trim()?.toLowerCase(),
    password: password.trim()?.toLowerCase(),
  };

  const showToast = ({type, message}) => {
    Toast.show({
      type: type, // or 'error', 'info', 'warning'
      text1: message,
    });
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('my-key', jsonValue);
      // alert("succedssd storeData signing")
    } catch (e) { 
      console.log("er storeData siging", e);
      // saving error
    }
  };

  // Function to handle account creation
  const handleSignup = async () => {
    if (name && password) {
      try {
        const response = await axios.post(`${ClientUrl}signup`, requestData);
  
        if (response.status === 201) {
          await storeData(response.data.Students);
          showToast({ type: "success", message: response.data.message });
          navigation.navigate('HomeScreen');
        } else if (response.status === 409) {
          showToast({ type: "error", message: response.data.message });
        } else {
          console.log("response", response);
          showToast({ type: "error", message: "Unknown error occurred" });
        }
      } catch (error) {
        if (error?.message === 'Network Error') {
          showToast({ type: "error", message: "Network Error" });
        } else if (error.response) {
          // Handle response error from the API
          showToast({ type: "error", message: error.response.data.message });
        } else {
          showToast({ type: "error", message: "An unexpected error occurred" });
        }
        // console.warn('Error fetching data: handleSignup', error.message);
      }
    } else {
      showToast({ type: "error", message: "Please fill All Fields" });
    }
  };
  

  const handleBackButton = () => {
    // Add a confirmation dialog or logic to exit the app.
    // You may want to ask the user for confirmation.
    // For a simple exit without confirmation:
    BackHandler.exitApp();
    return true;
  };
  

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    
    return () => {
      backHandler.remove();
    };
  }, []);
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create An Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={'black'}
        onChangeText={(text) => setName(text)}
        value={name}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={'black'}
        onChangeText={(text) => setEmail(text)}
        value={email}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'black'}
        onChangeText={(text) => setPassword(text)}
        value={password}
        // secureTextEntry
      />
      <Button title="Sign up" onPress={handleSignup} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: 'gray', textAlign: 'center', marginTop: 10 }}>
          If you have an already account{' '}
          <Text style={{ color: 'blue' }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: 'black',
  },
});

export default SignIn;
