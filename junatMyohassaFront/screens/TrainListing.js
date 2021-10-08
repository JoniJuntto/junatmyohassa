import React from 'react';
import { StyleSheet, View, Dimensions, FlatList } from 'react-native';

export default function TrainListing() {

  const [haut, setHaut] = useState([]);
  const [virhe, setVirhe] = useState('');
  var value = '';

  const renderItem = ({ item }) => (
    <Item title={item} />
  );

  const haeKaikkiJunat = async () => {
    try {
        const response = await
            fetch('localhost:3000/kaikki');
        const json = await response.json();
        console.log(json)
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

  return (
    <View style={styles.container}>
        <Text>Tässä junalistaus</Text>
        <FlatList
        data={haut}
        renderItem={renderItem}
        keyExtractor={item => item.trainNumber}
      />
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