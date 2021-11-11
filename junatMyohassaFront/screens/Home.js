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

    //This is called by the useEffect when the screen starts
    const getLocation = async () => {
        console.log("jej")
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("not granted");
            setErrorMsg('Permission to access location was denied');
            return;
        }

        try {
            console.log("Trying")
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            console.log("Tried");
            console.log(location);
        } catch (error) {
            console.log("error")
        }

    }

    useEffect(() => {
        getData();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }


    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.paragraph}>{text}</Text>
            </View>
            <TextInput
                textAlign={'center'}
                style={styles.input}
                keyboardType={'default'}
                //This is hacky way to get the text from TextInput :D
                onChangeText={text => setInputText(text)} value={inputText}
                placeholder="Find a train or station"
            />
            <NearestStations location={location} />
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
            <Button onPress={getLocation} title='heh' />
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
