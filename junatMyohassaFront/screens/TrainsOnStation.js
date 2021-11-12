import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import List from "../components/List";
import styles from "../styles/Styles";
import Map from "../components/Map";
import { useFocusEffect } from "@react-navigation/native";
import { IconButton, Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TrainListing({ navigation, route }) {
  //MIKSI TÄMÄ EI PÄIVITY!!!!!
  const { userInput, pressed } = route.params;

  const [haut, setHaut] = useState([]);
  const [virhe, setVirhe] = useState("");

  const haeJunatAsemalle = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.102:3000/graphfetch/" + userInput
      );
      const json = await response.json();
      setHaut(json);
      console.log(json)
      setVirhe("");
    } catch (error) {
      setHaut([]);
      setVirhe(error);
    }
  };

  const storeData = async () => {
    let value = userInput.toString();
 
   try {
     await AsyncStorage.setItem('station', value)
     const kikkeli = await AsyncStorage.getItem('station');
     console.log(kikkeli);
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
      <List list={haut} />
    </View>
  );
}
