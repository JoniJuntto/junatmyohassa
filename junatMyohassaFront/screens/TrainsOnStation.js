import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import List from '../components/List';
import styles from '../styles/Styles';
import Map from '../components/Map';
import { useFocusEffect } from '@react-navigation/native';


export default function TrainListing({ navigation, route }) {

  const { userInput } = route.params;

  const [haut, setHaut] = useState([]);
  const [virhe, setVirhe] = useState('');


  const haeJunatAsemalle = async (userInput1) => {
    try {
        console.log(userInput + "async");
        const response = await
          fetch('http://10.0.2.2:3000/asema/' + userInput1);
        const json = await response.json();
        setHaut(json);
        setVirhe('');
    } catch (error) {
        setHaut([]);
        setVirhe('Haku ei onnistunut');
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      haeJunatAsemalle(userInput);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    haeJunatAsemalle();
  }, []);

  //If there is a problem with fetch, it will just show error text on screen
  if (virhe) {
    <View>
      <Text>{virhe}</Text>
      <Text>Cannot fetch the trains, check your internet-connection</Text>
    </View>
  }

  return (
    <View style={styles.container}>
      <Text>Tässä junat jotka menevät asemalta: {userInput}</Text>
      <List list={haut} />
    </View>
  );
}
