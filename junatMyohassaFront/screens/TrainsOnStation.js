import React, { useState, useLayoutEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import List from "../components/List";
import styles from "../styles/Styles";
import { IconButton, Colors, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TrainListing({ route }) {

  const { userInput, pressed } = route.params;
  const [haut, setHaut] = useState([]);
  const [hautAsema, setHautAsema] = useState([]);
  const [virhe, setVirhe] = useState("");
  const [userStationCode, setUserStationCode] = useState('');
  const [loading, setLoading] = useState(false);
  


  const getStations = async () => {
    try {
      const response = await fetch(
        "http://junatback.herokuapp.com/asemat/"
      );
      const json = await response.json();
      setHautAsema(json);
      setVirhe("");
      return json;
    } catch (error) {
      setHautAsema([]);
      setVirhe(error);
    }
  }

  const formatterFn = (element) => {

    if (element.stationName.toLowerCase() === userInput.toLowerCase()) {
      setUserStationCode(element.stationShortCode);
      console.log(element.stationShortCode);
    } else if (element.stationShortCode.toLowerCase() === userInput.toLowerCase()) {
      setUserStationCode(element.stationShortCode)
    }

  }

  const haeJunatAsemalle = async () => {
    setLoading(true);
    console.log(userStationCode)

    try {
      //Get all the stations in Finland
      const stations = await getStations();
      //Get stationShortCode from stationName 
      await stations.forEach(formatterFn);

      //Getting the station that user wanted
      console.log(userStationCode)
      const response = await fetch(
        "http://junatback.herokuapp.com/graphfetch/" + userStationCode
      );
      const json = await response.json();
      setHaut(json);
      setVirhe("");
    } catch (error) {
      setHaut([]);
      setVirhe(error);
      console.log(error)
    }
    setLoading(false);
  };

  const storeData = async () => {
    let value = userInput.toString();

    try {
      await AsyncStorage.setItem('station', value)
      createAlertWhenFavorited(value);
    } catch (e) {
      console.log(e);
      // saving error
    }
  }

  const createAlertWhenFavorited = (station) =>
  Alert.alert('Lisätty asema suosikkeihin!', `Asema ${station} lisätty suosikkeihisi!`, [
    { text: 'OK', onPress: () => console.log('OK Pressed') },
  ]);


  useLayoutEffect(() => {
    haeJunatAsemalle();
  }, [pressed]);

  //If there is a problem with fetch, it will just show error text on screen
  if (virhe) {
    <View>
      <Text>{virhe}</Text>
      <Text>Cannot fetch the trains, check your internet-connection</Text>
    </View>
  }

  return (
    <View style={styles.container}>
      <Button onPress={getStations}>Refresh</Button>
        <Text>Tässä junat jotka menevät asemalta: {userInput}</Text>
        <IconButton
          icon="heart"
          color={Colors.red500}
          size={24}
          onPress={storeData}
        />
        <Text>Lisää asema suosikkeihin</Text>
        <ActivityIndicator animating={loading} size="large" color="#00ff00" />
      {!loading
        ? <List list={haut} />
        : <Text></Text>
      }
    </View>
  );
}
