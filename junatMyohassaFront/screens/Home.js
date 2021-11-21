import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import styles from '../styles/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import GetClosestStations from '../components/GetClosestStations';


export default function Home({ navigation }) {

    const [inputText, setInputText] = useState('')
    const [pressed, setPressed] = useState(0);
    const [station, setValue] = useState('');
    const [haut, setHaut] = useState('');
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        //TÄMÄ ON KORJAUS KUN EMULAATTORI VIE KOORDINAATIT CALIFORNIAAN
        if(location.coords.longitude < -120.084){
            console.log("Emulator coords")
            location.coords.longitude = 24.951468537760
            location.coords.latitude = 60.1807317519
        }
      })();
    }, []);

    const getData = async () => {
        console.log("Getting the station from async...")
        try {
          const value = await AsyncStorage.getItem('station')
          console.log("got a " + value + " from async")
          setValue(value)
          if(value !== null) {
            // value previously stored
            setValue(value);
          }
          const value2 = await AsyncStorage.getItem('train')
          console.log(value2)
        } catch(e) {
            console.log(e)
          // error reading value
        }
      }

      const navigateToStationListing = () =>{
          setPressed(pressed + 1 );
          /* Navigate to the Listing route with param from async storage */
          navigation.navigate('Station', {
              userInput: inputText,
              pressed: pressed,
          });
      }
    
      
      
      useEffect(() => {
        getData();
      }, [station]);
    

    return (
        <View style={styles.container}>
            
          <View>
          <GetClosestStations 
            navigateToStationListing={navigateToStationListing} 
            location={location}  
            pressed={pressed} 
            setPressed={setPressed} 
            setInputText={setInputText}
          /> 
          
            <Button
                title="Use your favourite station"
                onPress={navigateToStationListing}
            />
            </View>
            <View>
            <TextInput
                textAlign={'center'}
                style={styles.input}
                keyboardType={'default'}
                //This is hacky way to get the text from TextInput :D
                onChangeText={text => setInputText(text)} value={inputText}
                placeholder="Syötä asema"
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
            </View>

            
        </View>
    );
}
