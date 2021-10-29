import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, TextInput, Button, Text } from 'react-native';
import * as Location from 'expo-location';
import styles from '../styles/Styles';

export default function Map(props) {

    const [locationCheck, setLocationCheck] = useState(0);
    const [regionLat, setRegionLat] = useState(60.201373);
    const [regionLng, setRegionLng] = useState(24.934041);
    const [markerLatitude, setMarkerLatitude] = useState(60.1719);
    const [markerLongitude, setMarkerLongitude] = useState(24.9414);
    //These two get the window size for the map
    const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
    const [windowWidth, setWindonwWidth] = useState(Dimensions.get('window').width);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [virhe, setVirhe] = useState('');

    //This is called by the useEffect when the screen starts
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }


    const haeJunanSijainti = async () => {
        try {
            console.log(props.data.trainNumber);
            const response = await
              fetch('http://10.0.2.2:3000/sijainti/' + props.data.trainNumber);
            const json = await response.json();
            var haut = json;
            setMarkerLatitude(haut[0].location.coordinates[1]);
            setMarkerLongitude(haut[0].location.coordinates[0]);
            console.log(haut[0].location.coordinates[1]);
            console.log(haut[0].location.coordinates[0]);
            setVirhe('');
        } catch (error) {
            console.log(error)
            console.log(virhe)
            setHaut([]);
            setVirhe('Haku ei onnistunut');
        }
      }

    useEffect(() => {
        getLocation();
        haeJunanSijainti();
    }, [locationCheck]);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    //Sets the failsafe if there is not allowed access to location
    if (errorMsg === text) {
        return (
            <View style={styles.container}>
                <Text style={styles.error_msg}>You shall not pass</Text>
                <Text style={styles.txt}>have you given the rights to your location?</Text>
                <Button title='Check again!' onPress={() => setLocationCheck(locationCheck + 1)} />
            </View>
        );
    }
    
    return (
        <View>
            <MapView
                //Makes the map as large as it can be
                borderWidth={1}
                borderColor={'black'}
                style={styles.map}

                //Sets the lat and long where the map is located and deltas
                region={{
                    latitude: regionLat,
                    longitude: regionLng,
                    latitudeDelta: 3.0,
                    longitudeDelta: 3.0,
                }}
            >
                <Marker coordinate={{
                    latitude: markerLatitude,
                    longitude: markerLongitude
                }} title='Train' />
            </MapView>
        </View>

    );
}
