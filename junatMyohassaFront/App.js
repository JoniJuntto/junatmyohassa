import Home from './screens/Home';
import TrainListing from './screens/TrainListing';
import TrainsOnStation from './screens/TrainsOnStation';
import TrainInfo from './screens/TrainInfo';
import * as React from 'react';
import {useEffect} from 'react'; 
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Profile from './screens/Profile';
import {  AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from "expo-constants"

const Drawer = createDrawerNavigator();



export default function App() {

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;

  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={Home}
          options={
            {
              drawerLabel: "Home",
              drawerIcon: ({ tintColor }) => <AntDesign name="home" size={30} color={tintColor} />
            }}
        />

        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={
            {
              drawerLabel: "Profile",
              drawerIcon: ({ tintColor }) => <AntDesign name="profile" size={30} color={tintColor} />
            }}
        />


        <Drawer.Screen
          name="Station"
          component={TrainsOnStation}
          options={{
            drawerLabel: () => null,
            title: null,
            drawerIcon: () => null
          }}
        />

        <Drawer.Screen
          name="TrainInfo"
          component={TrainInfo}
          options={{
            drawerLabel: () => null,
            title: null,
            drawerIcon: () => null
          }}
        />

      </Drawer.Navigator>
    </NavigationContainer>
  );
}