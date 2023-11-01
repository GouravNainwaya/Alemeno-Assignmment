import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import ClientUrl from '../../config';

const showToast = ({type, message, message2}) => {
  Toast.show({
    type: type, // or 'error', 'info', 'warning'
    text1: message,
    text2: message2
  });
};

const DetailedScreen = ({ route ,navigation}) => {
  const { course, loggedinUserData } = route.params;
    const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState(false); 
  const [enrollText, setEnrollText] = useState('Enroll')

  const onEnrolledToCourse = async() => {
    try {
      setLoading(true);
      // Define the URL of the API you want to call
      const apiUrl = `${ClientUrl}enroll`

      // Make an Axios GET request to fetch data from the API using async/await
      const response = await axios.post(apiUrl, {
        "courseId": course?._id,
        "student": loggedinUserData?.username
      });

      showToast({ type: "success", message: `${loggedinUserData?.username} Successfully Enrollled In`, message2: `${course?.name}`});
      // navigation?.navigate("EnrolledCourses")
      setEnrollText("Enrolled")
      setLoading(false);
    } catch (error) {
      showToast({ type: "error", error });
      console.log("error", error);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.thumbnail?.length ? course.thumbnail : "https://th.bing.com/th/id/OIP.NmWgaOzjOJL_3mdAy-_37QHaDx?w=324&h=177&c=7&r=0&o=5&dpr=1.8&pid=1.7"  }} style={styles.thumbnail} />
      <Text style={styles.courseName}>{course.name}</Text>
      <Text style={styles.instructor}>Instructor: {course.instructor}</Text>
      <Text style={styles.description}>{course.description}</Text>
      <View style={styles.enrollmentContainer}>
        <Text style={styles.enrollmentStatus}>
          Enrollment Status: {course.enrollmentStatus}
        </Text>
        {course.enrollmentStatus == "Open" && (
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={onEnrolledToCourse}
            disabled={enrollText == "Enrolled" ? true : false}
          >
            <Text style={styles.enrollButtonText}>{loading ? <ActivityIndicator size={20} color={"red"}/> : enrollText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.text}>Course Duration: {course.duration}</Text>
      <Text style={styles.text}>Schedule: {course.schedule}</Text>
      <Text style={styles.text}>Location: {course.location}</Text>
      <Text style={styles.text}>
        Pre-requisites: {course.prerequisites.join(', ')}
      </Text>
      <TouchableOpacity
        style={styles.syllabusButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.syllabusButtonText}>
          {expanded ? 'Hide Syllabus' : 'Show Syllabus'}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={course.syllabus}
          keyExtractor={(item) => item.week.toString()}
          renderItem={({ item }) => (
            <View style={styles.syllabusItem}>
              <Text style={styles.syllabusWeek}>
                {`Week ${item.week}: ${item.topic}`}
              </Text>
              <Text style={styles.syllabusContent}>{item.content}</Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  courseName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'grey'
  },
  instructor: {
    fontSize: 20,
    marginBottom: 10,
    color: 'grey'
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    lineHeight: 24,
    color: 'grey'
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: 'grey'
  },
  syllabusButton: {
    fontSize: 22,
    marginBottom: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20
  },
  syllabusButtonText: {
    fontSize: 22,
    textDecorationLine: 'underline',
    color: 'grey'
  },
  syllabusItem: {
    marginBottom: 20,
    color: 'grey'
  },
  syllabusWeek: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey'
  },
  syllabusContent: {
    fontSize: 18,
    lineHeight: 24,
    color: 'grey'
  },
  enrollmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  enrollmentStatus: {
    fontSize: 18,
    color: 'grey'
  },
  enrollButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
  },
  enrollButtonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default DetailedScreen;
