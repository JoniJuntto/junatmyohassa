import React, {useState, useEffect} from "react";
import { View, TextInput, Text } from "react-native";
import { Button } from "react-native-elements";
import styles from "../styles/Styles";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditUserInfo(){
  const [station, onChangeStation] = useState('');

    const storeData = async () => {
      console.log("Saving asema")
        try {
          await AsyncStorage.setItem('asema', station)
          console.log("Asema " + station)
        } catch (e) {
          // saving error
          console.log(e);
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