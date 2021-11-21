import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import styles from '../styles/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import GetClosestStations from '../components/GetClosestStations';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


export default function Home({ navigation }) {

  const [inputText, setInputText] = useState('')
  const [pressed, setPressed] = useState(0);
  const [station, setValue] = useState('');
  const [haut, setHaut] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
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


    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        //TÄMÄ ON KORJAUS KUN EMULAATTORI VIE KOORDINAATIT CALIFORNIAAN
        if (location.coords.longitude < -120.084) {
          console.log("Emulator coords")
          location.coords.longitude = 24.951468537760
          location.coords.latitude = 60.1807317519
        }
      })();
    }, []);

    const getData = async () => {
      console.log("Getting the station from async...")
      try {
        const value = await AsyncStorage.getItem('station')
        console.log("got a " + value + " from async")
        setValue(value)
        if (value !== null) {
          // value previously stored
          setValue(value);
        }
        const value2 = await AsyncStorage.getItem('train')
        console.log(value2)
      } catch (e) {
        console.log(e)
        // error reading value
      }
    }

    const navigateToStationListing = () => {
      setPressed(pressed + 1);
      /* Navigate to the Listing route with param from async storage */
      navigation.navigate('Station', {
        userInput: inputText,
        pressed: pressed,
      });
    }



    useEffect(() => {
      getData();
    }, [station]);


    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <Text>Your expo push token: {expoPushToken}</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Title: {notification && notification.request.content.title} </Text>
            <Text>Body: {notification && notification.request.content.body}</Text>
            <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
          </View>
          <Button
            title="Press to schedule a notification"
            onPress={async () => {
              await schedulePushNotification();
            }}
          />
        </View>

        <View>
          <GetClosestStations
            navigateToStationListing={navigateToStationListing}
            location={location}
            pressed={pressed}
            setPressed={setPressed}
            setInputText={setInputText}
          />

          <Button
            title="Use your favourite station"
            onPress={navigateToStationListing}
          />
        </View>
        <View>
          <TextInput
            textAlign={'center'}
            style={styles.input}
            keyboardType={'default'}
            //This is hacky way to get the text from TextInput :D
            onChangeText={text => setInputText(text)} value={inputText}
            placeholder="Syötä asema"
          />

          <Button
            title="Go to stationlisting"
            onPress={() => {
              setPressed(pressed + 1);
              /* Navigate to the Listing route with param from TextInput */
              console.log(inputText)
              navigation.navigate('Station', {
                userInput: inputText,
                pressed: pressed,
              });
            }}
          />
        </View>


      </View>
    );

    async function schedulePushNotification() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You've got mail! 📬",
          body: 'Here is the notification body',
          data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
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
