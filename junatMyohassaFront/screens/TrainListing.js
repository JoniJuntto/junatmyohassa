import React, {useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import List from '../components/List';
import styles from '../styles/Styles';
import Map from '../components/Map';

export default function TrainListing({ navigation }) {

  const [haut, setHaut] = useState([]);
  const [virhe, setVirhe] = useState('');

  const haeKaikkiJunat = async () => {
    try {
        const response = await
            fetch('http://10.0.2.2:3000/ROI/OL');
        const json = await response.json();
        setHaut(json);
        setVirhe('');
    } catch (error) {
        setHaut([]);
        setVirhe('Haku ei onnistunut');
    }
}

useEffect(() => {
  haeKaikkiJunat();
}, []);

if(virhe){
  <Text>{virhe}</Text>
}

  return (
    <View style={styles.container}>
        <Text>Tässä junalistausta</Text>
        <List list={haut}/>
        <Map />
    </View>
  );
}
