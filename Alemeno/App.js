import {Alert, StyleSheet, Text, View,PermissionsAndroid, DeviceEventEmitter} from 'react-native';
import React, { useEffect } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Navigation from './src/navigation/Navigation';
// import { Provider } from 'react-redux';
// import { store } from './src/redux/MyStore';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

const App = () => {

  useEffect(() => {
    getDeviceToken()
  }, [])

  const getDeviceToken = async() => {
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    let token = await messaging().getToken()
    console.log("token", token);
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  
  return (
      <SafeAreaView style={styles.container}>
      {/* <Provider store={store}> */}
        <Navigation/>
        <Toast />
      {/* </Provider> */}
      </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
