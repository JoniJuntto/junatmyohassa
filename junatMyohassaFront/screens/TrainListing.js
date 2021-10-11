import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import List from '../components/List';
import styles from '../styles/Styles';
import Map from '../components/Map';

export default function TrainListing({ navigation, route }) {

  const { itemId, otherParam } = route.params;

  const [haut, setHaut] = useState([]);
  const [virhe, setVirhe] = useState('');

  const haeKaikkiJunat = async () => {
    try {
      const response = await
        fetch('http://10.0.2.2:3000/kaikki');
      const json = await response.json();
      setHaut(json);
      console.log(json);
      setVirhe('');
    } catch (error) {
      setHaut([]);
      setVirhe('Haku ei onnistunut');
    }
  }

  useEffect(() => {
    haeKaikkiJunat();
  }, []);

  //If there is a problem with fetch, it will just show error text on screen
  if (virhe) {
    <Text>{virhe}</Text>
  }

  return (
    <View style={styles.container}>
      <Text>Tässä junalistausta</Text>
      {/*This is the the data that came from Home.js :) */}
      <Text>{JSON.stringify(otherParam)}</Text>
      <List list={haut} />
      <Map />
    </View>
  );
}
