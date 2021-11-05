import React, {useState} from "react";
import { View, TextInput, Text } from "react-native";
import { Button } from "react-native-elements";
import styles from "../styles/Styles";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditUserInfo(){

        
const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        // value previously stored
        console.log(value);
        return value;
      }
    } catch(e) {
      // error reading value
      return ""
    }
  }
    const [station, onChangeStation] = useState(getData());

    const storeData = async () => {
        try {
          await AsyncStorage.setItem('@storage_Key', station)
        } catch (e) {
          // saving error
        }
      }




    return(
        <View>
        <Text>your station</Text>
        <TextInput
            style={styles.input}
            onChangeText={onChangeStation}
            value={station}
        />
        <Button onPress={storeData} title='Save'>Save</Button>
        </View>
    );
}