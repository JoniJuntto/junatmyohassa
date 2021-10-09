import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Dimensions, FlatList, Text } from 'react-native';
import List from './List';

export default function TrainListing({ navigation }) {

  const [haut, setHaut] = useState([]);
  const [virhe, setVirhe] = useState('');
  var value = '';

  const haeKaikkiJunat = async () => {
    try {
        const response = await
            fetch('http://10.0.2.2:3000/ROI/OL');
        const json = await response.json();
        setHaut(json);
        setVirhe('');
    } catch (error) {
      console.log(error)
        setHaut([]);
        setVirhe('Haku ei onnistunut');
    }
}

useEffect(() => {
  haeKaikkiJunat();
}, []);

  return (
    <View style={styles.container}>
        <Text>Tässä junalistaus</Text>
        <List list={haut}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    width: 300,
    height: 40,
    marginBottom: 1,
  },
});