import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import Map from '../components/Map'
import styles from '../styles/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ButtonGroup } from 'react-native-elements';
import * as Location from 'expo-location';
import GetClosestStations from '../components/GetClosestStations';


export default function Home({ navigation }) {

  const [inputText, setInputText] = useState('')
  const [pressed, setPressed] = useState(0);
  const [station, setValue] = useState('');
  const [hautStations, setHautStations] = useState('');
  const [hautTrains, setHautTrains] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [virhe, setVirhe] = useState('');


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
        console.log("Got emulator coords... Changing coordinates to Long: 24.951468537760 lat: 60.180731751")
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
      console.log("Got a " + value2 + " from async");
    } catch (e) {
      console.log(e)
      // error reading value
    }
  }


  const getStations = async () => {
    try {
      console.log("Getting stations...")
      const response = await fetch(
        "http://192.168.1.133:3000/asemat"
      );
      const json = await response.json();
      setHautStations(json);
      setVirhe("");
      console.log("Got stations from backend! :)")
    } catch (error) {
      setVirhe(error);
    }
  }


  useEffect(() => {
    getStations();
  }, [location]);


  useEffect(() => {
    getData();
  }, [station]);


  return (
    <View style={styles.container}>

      <View>
        <GetClosestStations location={location} haut={hautStations} />

        <Button
          title="Use your favourite station"
          onPress={() => {
            setPressed(pressed + 1);
            /* Navigate to the Listing route with param from async storage */
            navigation.navigate('Station', {
              userInput: station,
              pressed: pressed,
              hautStations: hautStations
            });
          }}
        />
      </View>
      <View>
        <TextInput
          textAlign={'center'}
          style={styles.input}
          keyboardType={'default'}
          //This is hacky way to get the text from TextInput :D
          onChangeText={text => setInputText(text)} value={inputText}
          placeholder="Find a train or station"
        />

        <Button
          title="Go to stationlisting"
          onPress={() => {
            setPressed(pressed + 1);
            /* Navigate to the Listing route with param from TextInput */ 
            navigation.navigate('Station', {
              userInput: inputText,
              pressed: pressed,
              hautStations: hautStations
            });
          }}
        />
      </View>


    </View>
  );
}
