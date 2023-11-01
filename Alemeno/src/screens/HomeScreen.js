import { FlatList, StyleSheet, Text, View ,Image, TouchableOpacity,BackHandler, Button} from 'react-native'
import React, { useEffect, useState ,useCallback} from 'react'
import axios from 'axios';
import ClientUrl from '../../config';
import CustomAcrivitityIndicator from '../components/CustomAcrivitityIndicator';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useFocusEffect } from '@react-navigation/native';

const showToast = ({type, message}) => {
  Toast.show({
    type: type, // or 'error', 'info', 'warning'
    text1: message,
  });
};

const HomeScreen = ({navigation}) => {
  const [coureses, setcoureses] = useState([])
  const [loading, setLoading] = useState(true);
  const [loggedinUserData, setLoggedinUserData] = useState();

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          const jsonValue = await AsyncStorage.getItem('my-key');
          const localStorage = jsonValue != null ? JSON.parse(jsonValue) : null;
          setLoggedinUserData(localStorage);
          const apiUrl = `${ClientUrl}getAllCourses`;
          const response = await axios.get(apiUrl);
          setcoureses(response?.data?.fetchUser);
          setLoading(false);
        } catch (error) {
          showToast({ type: "error", error });
          setLoading(false);
        }
      }
  
      fetchData();
    }, [setLoggedinUserData, setcoureses, setLoading, showToast])
  );

  const handleBackButton = () => {
    // Add a confirmation dialog or logic to exit the app.
    // You may want to ask the user for confirmation.
    // For a simple exit without confirmation:
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);



  return (
    <View style={styles.container}>
    {loading ? ( // Show loader if loading is true
      <CustomAcrivitityIndicator />
    ) : (
      <View style={{}}>
      <FlatList
        data={coureses}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation?.navigate("DetailedScreen", {course: item, loggedinUserData})} style={styles.courseItem}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      </View>
    )}
  </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff'
  },
  courseItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey'
  },
  instructor: {
    fontSize: 16,
    color: 'grey'
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: 'grey'
  },
});