import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Toast from 'react-native-toast-message';
import ClientUrl from '../../../config';

const Login = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const requestData = {
    username: name.trim()?.toLowerCase(),
    password: password.trim()?.toLowerCase(),
  };

  const storeData = async (value) => {
    console.log("value", value);
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('my-key', jsonValue);
      // alert("succedssd storeData login")
    } catch (e) { 
      console.log("er storeData login", e);
      // saving error
    }
  };

  const showToast = ({type, message}) => {
    Toast.show({
      type: type, // or 'error', 'info', 'warning'
      text1: message,
    });
  };

  const handleLogin = async () => {
    if (name && password) {
      try {
        const response = await axios.post(`${ClientUrl}login`, requestData);
  
        if (response.status === 201) {
          await storeData(response.data.Students);
          showToast({ type: "success", message: response.data.message });
          navigation.navigate('HomeScreen');
        } else if (response.status === 401 || response.status === 501) {
          showToast({ type: "error", message: response.data.message });
        } else {
          console.log("response handleLogin", response);
          showToast({ type: "error", message: "Unknown error occurred" });
        }
  
        // You can process any other data from the response as needed.
        const { data } = response;
        // setQuote(data.quote);
        // setLoading(false);
      } catch (error) {
        if (error?.message === 'Network Error') {
          showToast({ type: "error", message: "Network Error" });
        } else if (error.response) {
          // Handle response error from the API
          showToast({ type: "error", message: error.response.data.message });
        } else {
          showToast({ type: "error", message: "An unexpected error occurred" });
        }
        // console.warn('Error fetching data: handleLogin', error.message);
      }
    } else {
      showToast({ type: "error", message: "Please fill All Fields" });
    }
  };
  

  // console.log('fds', email, pas/);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Login </Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={'black'}
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'black'}
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
    </ScrollView>
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
export default Login;
