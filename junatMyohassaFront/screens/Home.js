import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import Map from '../components/Map'
import styles from '../styles/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ButtonGroup } from 'react-native-elements';
import NearestStations from '../components/NearestStations';
import * as Location from 'expo-location';




export default function Home({ navigation }) {
    
    const [location, setLocation] = useState(null);
    const [locationCheck, setLocationCheck] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [inputText, setInputText] = useState('')
    const [pressed, setPressed] = useState(0);
    const [station, setValue] = useState('');

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
                // value previously stored
                setValue(value);
            }
        } catch (e) {
            // error reading value
        }
    }

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log("Fetching location")
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          console.log(location);
        })();
      }, []);
    
      let text = 'Waiting..';
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        text = JSON.stringify(location);
      }

    useEffect(() => {
        getData();


    }, [locationCheck]);


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
            <NearestStations location={location}/>
            <Button
                title="Go to stationlisting"
                onPress={() => {
                    setPressed(pressed + 1);
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
                    setPressed(pressed + 1);
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
