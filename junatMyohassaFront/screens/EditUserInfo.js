import React, {useState, useEffect} from "react";
import { View, TextInput, Text } from "react-native";
import { Button } from "react-native-elements";
import styles from "../styles/Styles";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditUserInfo(){
  const [station, onChangeStation] = useState('');
  const [favoriteStation, setFavoriteStation] = useState('');
  const [favoriteTrain, setFavoriteTrain] = useState('');

    const storeData = async () => {
      console.log("Saving asema")
        try {
          await AsyncStorage.setItem('station', station)
          console.log("Asema " + station)
        } catch (e) {
          // saving error
          console.log(e);
        }
      }

      //Getting data from async storage
      const getData = async () =>{
        console.log("Getting data from async storage to user-info page");
        try {
          const resTrain = await AsyncStorage.getItem('train');
          setFavoriteTrain(resTrain);
          console.log("Got fata with value " + resTrain);
          const resStation = await AsyncStorage.getItem('station');
          setFavoriteStation(resStation);
          console.log("Got fata with value " + resStation);
        } catch (error) {
          console.log(error)
        }
      }

      useEffect(() => {
        getData();
      }, []);


    return(
        <View>
          <Text>Your favorite station: {favoriteStation}</Text>
          <Text>Your favorite train: {favoriteTrain}</Text>
        <Text></Text>
        <Text>Change favorite station</Text>
        <TextInput
            style={styles.input}
            onChangeText={onChangeStation}
            value={station}
        />
        <Button onPress={storeData} title='Save'>Save</Button>
        </View>
    );
}