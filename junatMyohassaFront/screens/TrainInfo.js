import React, { useState, useEffect } from "react";
import { Text, View, FlatList, Button } from "react-native";
import { styles } from "../styles/Styles";
import Map from "../components/Map";

export default function TrainInfo({ navigation, route }) {
  const { ID, trainNr, title } = route.params;

  return (
    <View>
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
