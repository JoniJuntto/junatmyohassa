import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Button } from "react-native";
import { styles } from "../styles/Styles";
import Map from "../components/Map";

export default function TrainInfo({ navigation, route }) {
  const { ID, trainNr, title } = route.params;

  //Funktio, jonka kutsuu nappula, joka lisää train numberin async storageen
 // Tämän voi toteuttaa samanlailla kuin EditUserInfo.js tehdään aseman kohdalla
  return (
    <View>
      {/* Tähän nappula josta painamalla käyttäjä valitsee junan suosikkeihin */}
      <View>
        <Text>{ID}</Text>
        <Text>{trainNr}</Text>
        <Text>{title.timeTableRows[0].differenceInMinutes}</Text>
        <Text>{title.timeTableRows[0].scheduledTime.slice(11, 16)}</Text>
      </View>
      <Map data={title} />
    </View>
  );
}
