import React, { useState, useEffect } from 'react';
import MapView, { Marker }  from 'react-native-maps';
import { StyleSheet, View, Dimensions, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';

export default function Map() {

//NÄÄ PITÄIS TUODA PROPSINA
const [regionLat, setRegionLat] = useState(60.201373);
const [regionLng, setRegionLng] = useState(24.934041);
const [markerLatitude, setMarkerLatitude] = useState(60.201373);
const [markerLongitude, setMarkerLongitude] = useState(24.934041);
const [windowHeight, setWindowHeight] = useState(100);
const [windowWidth, setWindonwWidth] = useState(100);
const [location, setLocation] = useState(null);
const [errorMsg, setErrorMsg] = useState(null);


//NÄÄ PITÄIS TUODA PROPSINA
useEffect(() => {
    setWindowHeight(Dimensions.get('window').height * 0, 8);
    setWindonwWidth(Dimensions.get('window').width);
}, []);

useEffect(() => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return 
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
}, []);

//NÄÄ PITÄIS TUODA PROPSINA
let text = 'Waiting..';
if (errorMsg) {
    text = errorMsg;
} else if (location) {
    text = JSON.stringify(location);
    setMarkerLatitude(JSON.latitude[0]);
    setMarkerLongitude(JSON.longitude[0]);
    setRegionLat(JSON.latitude[0]);
    setRegionLng(JSON.longitude[0]);
}

return(

<MapView
                //Makes the map as large as the screen - 20% from height
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