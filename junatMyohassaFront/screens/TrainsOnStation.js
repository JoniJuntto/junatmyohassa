import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import List from "../components/List";
import styles from "../styles/Styles";
import Map from "../components/Map";
import { useFocusEffect } from "@react-navigation/native";
import { IconButton, Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TrainListing({ navigation, route }) {
  //MIKSI TÄMÄ EI PÄIVITY!!!!!
  const { userInput, pressed, hautStations } = route.params;

  const [haut, setHaut] = useState([]);
  const [hautAsema, setHautAsema] = useState([]);
  const [virhe, setVirhe] = useState("");
  const [userStationCode, setUserStationCode] = useState('');
  const [loading, setLoading] = useState(false);


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


    try {
      if (!hautStations) {
        setLoading(true);
        return;
      }
      //Get stationShortCode from stationName 
      await hautStations.forEach(formatterFn);

      //Getting the station that user wanted
      console.log("Getting data from stationshortcode " + userStationCode)
      const response = await fetch(
        "http://192.168.1.133:3000/graphfetch/" + userStationCode
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
    } catch (e) {
      console.log(e);
      // saving error
    }
  }

  useEffect(() => {
    haeJunatAsemalle();
  }, [pressed]);

  //If there is a problem with fetch, it will just show error text on screen
  if (virhe) {
    <View>
      <Text>{virhe}</Text>
      <Text>Cannot fetch the trains, check your internet-connection</Text>
    </View>;
  }

  return (
    <View style={styles.container}>
      <Text>Tässä junat jotka menevät asemalta: {userInput}</Text>
      <IconButton
        icon="heart"
        color={Colors.red500}
        size={24}
        onPress={storeData}
      />
      <Text>Lisää asema suosikkeihin</Text>
      <ActivityIndicator animating={loading} size="large" color="#00ff00" />
      <List list={haut} />
    </View>
  );
}
