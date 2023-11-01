import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/auth/SigIn';
import Loading from '../screens/auth/Loading';
import Login from '../screens/auth/Login';
import HomeScreen from '../screens/HomeScreen';
import DetailedScreen from '../screens/DetailedScreen';
import EnrolledCourses from '../screens/EnrolledCourses';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import the icon library

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'EnrolledCourses') {
          iconName = focused ? 'school' : 'school-outline';
        }
        // Return the icon component with the appropriate name
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="EnrolledCourses" component={EnrolledCourses} />
  </Tab.Navigator>
  );
}

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeScreen" options={{headerShown: false}} component={Home} />
        <Stack.Screen name="DetailedScreen" component={DetailedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation

const styles = StyleSheet.create({})