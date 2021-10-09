import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, TextInput, Button, Text } from 'react-native';
import * as Location from 'expo-location';
import styles from '../styles/Styles';

export default function Map(props) {

    const [locationCheck, setLocationCheck] = useState(0);
    const [regionLat, setRegionLat] = useState(60.201373);
    const [regionLng, setRegionLng] = useState(24.934041);
    const [markerLatitude, setMarkerLatitude] = useState(60.201373);
    const [markerLongitude, setMarkerLongitude] = useState(24.934041);
    //These two get the window size for the map
    const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
    const [windowWidth, setWindonwWidth] = useState(Dimensions.get('window').width);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    //This is called by the useEffect when the screen starts
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setMarkerLatitude(location.coords.latitude);
        setMarkerLongitude(location.coords.longitude);
    }

    useEffect(() => {
        getLocation();
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
        <MapView
            //Makes the map as large as it can be
            width={windowWidth}
            height={windowHeight}
            flex={1}
            borderWidth={1}
            borderColor={'black'}

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
            }} title='Your location' />
        </MapView>

    );
}
