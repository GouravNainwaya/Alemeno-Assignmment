/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle } from '@notifee/react-native';

async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId,
      style: { type: AndroidStyle.BIGPICTURE, picture: 'https://th.bing.com/th/id/OIP.Symfk_VkJnp8zBW-pgekGgHaEK?w=324&h=182&c=7&r=0&o=5&dpr=1.8&pid=1.7.png' },

      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
// Handle background messages using setBackgroundMessageHandler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log("hellowe");
  setTimeout(onDisplayNotification, 5000)
});
AppRegistry.registerComponent(appName, () => App);
