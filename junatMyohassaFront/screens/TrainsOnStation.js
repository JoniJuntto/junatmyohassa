import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import List from "../components/List";
import styles from "../styles/Styles";
import Map from "../components/Map";
import { useFocusEffect } from "@react-navigation/native";

export default function TrainListing({ navigation, route }) {
  //MIKSI TÄMÄ EI PÄIVITY!!!!!
  const { userInput, pressed } = route.params;

  const [haut, setHaut] = useState([]);
  const [virhe, setVirhe] = useState("");

  const haeJunatAsemalle = async () => {
    try {
      console.log(userInput + "async");
      const response = await fetch(
        "http://10.0.2.2:3000/graphfetch/" + userInput
      );
      const json = await response.json();
      console.log(json);
      setHaut(json);
      setVirhe("");
    } catch (error) {
      setHaut([]);
      setVirhe("Haku ei onnistunut");
    }
  };

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
      <List list={haut} />
    </View>
  );
}
