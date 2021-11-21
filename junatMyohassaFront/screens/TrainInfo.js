import React, { useState, useEffect, useRef } from "react";
import { Text, View, FlatList, Button, Alert } from "react-native";
import { styles } from "../styles/Styles";
import Map from "../components/Map";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton, Colors } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


export default function TrainInfo({ route }) {
  const { ID, trainNr, title } = route.params;
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const createAlertWhenFavorited = (train) =>
  Alert.alert('Lisätty juna suosikkeihin!', `Juna numero ${train} lisätty suosikkeihisi!`, [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);

  //Funktio, jonka kutsuu nappula, joka lisää train numberin async storageen
 // Tämän voi toteuttaa samanlailla kuin EditUserInfo.js tehdään aseman kohdalla
 const storeData = async () => {
   let value = trainNr.toString();

  try {
    await AsyncStorage.setItem('train', value)
    createAlertWhenFavorited(value);
  } catch (e) {
    console.log(e);
    // saving error
  }
}

const minutesBeforeLeaving = () =>{
  var minutesTo=10;
  const leavesIn = title.timeTableRows[0].scheduledTime;
  const tenMinutesBefore = new Date(leavesIn.getTime() - minutesToAdd*60000);
  return tenMinutesBefore;
  
}

  return (
    <View>
      <IconButton
        icon="heart"
        color={Colors.red500}
        size={24}
        onPress={async () => { 
          storeData();
          await schedulePushNotification();
        }}
      /><Text>Lisää juna suosikkeihin</Text>
      <View>
        <Text>Junan ID: {ID}</Text>
        <Text>Junan numero: {trainNr}</Text>
        <Text>Juna tällä hetkellä myöhässä: {title.timeTableRows[0].differenceInMinutes} minuuttia</Text>
        <Text>Junan suunniteltu lähtöaika on: {title.timeTableRows[0].scheduledTime.slice(11, 16)}</Text>
      </View>
      <Map data={title} />
    </View>
  );

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Juna ilmoitus tilattu!",
        body: `Junasi ${trainNr} lähijunakirjain ${ID} suunniteltu lähtöaika on ${title.timeTableRows[0].scheduledTime.slice(11, 16)} `,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 1 },
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Juna lähdössä!",
        body: `Junasi ${trainNr} lähijunakirjain ${ID} suunniteltu lähtöaika on ${title.timeTableRows[0].scheduledTime.slice(11, 16)} ja on tällä hetkellä myöhässä ${title.timeTableRows[0].differenceInMinutes} minuuttia `,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 600 },
    });
  }
  
  async function registerForPushNotificationsAsync() {
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
}
