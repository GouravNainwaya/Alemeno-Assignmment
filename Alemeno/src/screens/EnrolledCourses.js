import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar'; // Import the ProgressBar component from react-native-progress
import ClientUrl from '../../config';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CustomAcrivitityIndicator from '../components/CustomAcrivitityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import notifee, { AndroidStyle } from '@notifee/react-native';

const showToast = ({type, message}) => {
  Toast.show({
    type: type, // or 'error', 'info', 'warning'
    text1: message,
  });
};

  // Your array with 5 objects
  const myArray = [
    { title: 'Title 1', body: 'Body 1' },
    { title: 'Title 2', body: 'Body 2' },
    { title: 'Title 3', body: 'Body 3' },
    { title: 'Title 4', body: 'Body 4' },
    { title: 'Title 5', body: 'Body 5' },
  ];

const EnrolledCourses = ({navigation}) => {
  const [coureses, setcoureses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedinUserData, setLoggedinUserData] = useState();

    // Function to send a notification
    async function sendNotification(title, body, image) {
      // Request permissions (required for iOS)
      await notifee.requestPermission();
    
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    
      // Display a notification
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId,
          style: { type: AndroidStyle.BIGPICTURE, picture: `${image}` },
          pressAction: {
            id: 'default',
          },
        },
      });
    }
    
    // Function to send notifications for all elements in the array
    async function sendNotificationsSequentially() {
      for (const item of coureses) {
        await sendNotification(item.name, item.dueDate, item?.thumbnail);
        // Introduce a delay between notifications (e.g., 5 seconds)
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    const startNotifications = () => {
      if (coureses && coureses.length) {
        sendNotificationsSequentially()
      }
    };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('my-key');
          const localStorage = jsonValue != null ? JSON.parse(jsonValue) : null;
          setLoggedinUserData(localStorage);
          // Define the URL of the API you want to call
          const apiUrl = `${ClientUrl}getloggedinUserEnrolledCourses`;
  
          // Make an Axios GET request to fetch data from the API using async/await
          const response = await axios.post(apiUrl, {
            studentID: localStorage?._id,
          });
          // Assuming the API response is an array of data objects
          setcoureses(response?.data?.enrolledCourses);
          setLoading(false);
        } catch (error) {
          showToast({type: 'error', error});
          setLoading(false);
        }
      };
  
      // Call the async fetchData function
      fetchData();
    }, [setLoggedinUserData, setcoureses, setLoading, showToast])
  );

  useEffect(() => {
    startNotifications()
  }, [coureses])
  

  const userData = {
    name: 'John Doe',
    enrolledCourses: [
      {
        id: 1,
        name: 'Course 1',
        instructor: 'Instructor 1',
        dueDate: '2023-12-01',
        progress: 0.1, // Progress between 0.0 and 1.0
        image: 'https://example.com/course1.jpg',
      },
      {
        id: 2,
        name: 'Course 2',
        instructor: 'Instructor 2',
        dueDate: '2023-11-15',
        progress: 0.1,
        image: 'https://example.com/course2.jpg',
      },
    ],
  };

  const renderItem = ({item}) => (
    <View style={styles.courseItem}>
      <Image source={{uri: item.thumbnail}} style={styles.courseImage} />
      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
        <Text style={styles.dueDate}>Due Date: {item.dueDate}</Text>
        <ProgressBar
          progress={item.progress}
          width={null} // Auto width to fill the parent container
          height={10}
          color={'#007AFF'} // Customize the color
          style={styles.progressBar}
        />
      </View>
    </View>
  );

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('my-key');
    } catch (e) {
      console.log('error removeValue', e);
      // remove error
    }
    showToast({type: 'error', message: 'User Logout Successfully'});
  };

  return (
    <View style={styles.container}>
      {loading ? ( // Show loader if loading is true
        <CustomAcrivitityIndicator />
      ) : (
        <>
          <Text style={styles.userName}>
            {loggedinUserData?.username}'s Dashboard
          </Text>
          <FlatList
            data={coureses}
            keyExtractor={item => item._id.toString()}
            renderItem={renderItem}
          />
           <TouchableOpacity style={styles.logoutButtonContainer} onPress={() => {
              removeValue();
              navigation.navigate('SignIn');
            }}>
            <Text style={styles.logoutButton}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  courseItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  courseImage: {
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
  },
  instructor: {
    fontSize: 16,
  },
  dueDate: {
    fontSize: 16,
  },
  progressBar: {
    marginTop: 5,
  },
  logoutButton: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    bottom: 5
  },
  logoutButtonContainer: {
    alignItems: 'center',
  },
});
export default EnrolledCourses;
