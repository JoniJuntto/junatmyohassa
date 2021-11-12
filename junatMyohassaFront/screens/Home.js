import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import Map from '../components/Map'
import styles from '../styles/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ButtonGroup } from 'react-native-elements';



export default function Home({ navigation }) {

    const [inputText, setInputText] = useState('')
    const [pressed, setPressed] = useState(0);
    const [station, setValue] = useState('');
    const [haut, setHaut] = useState('');

    const getData = async () => {
        console.log("Getting the station from async...")
        try {
          const value = await AsyncStorage.getItem('asema')
          console.log("got a " + value + " from async")
          if(value !== null) {
            // value previously stored
            setValue(value);
          }
        } catch(e) {
            console.log(e)
          // error reading value
        }
      }
      
      useEffect(() => {
        getData();
      }, [station]);
    

    return (
        <View style={styles.container}>
          
            <TextInput
                textAlign={'center'}
                style={styles.input}
                keyboardType={'default'}
                //This is hacky way to get the text from TextInput :D
                onChangeText={text => setInputText(text)} value={inputText}
                placeholder="Find a train or station"
            />

            <Button
                title="Go to stationlisting"
                onPress={() => {
                    setPressed(pressed + 1 );
                    /* Navigate to the Listing route with param from TextInput */
                    console.log(inputText)
                    navigation.navigate('Station', {
                        userInput: inputText,
                        pressed: pressed,
                    });
                }}
            />
            <Button
                title="Use your favourite station"
                onPress={() => {
                    setPressed(pressed + 1 );
                    /* Navigate to the Listing route with param from async storage */
                    navigation.navigate('Station', {
                        userInput: station,
                        pressed: pressed,
                    });
                }}
            />
            
        </View>
    );
}
