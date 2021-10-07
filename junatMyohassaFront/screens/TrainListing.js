import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

export default function TrainListing() {

  return (
    <View style={styles.container}>
        <Text>Tässä junalistaus</Text>
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