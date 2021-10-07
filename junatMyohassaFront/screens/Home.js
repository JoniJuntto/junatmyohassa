import React, { useState, useEffect } from 'react';
import MapView, { Marker }  from 'react-native-maps';
import { StyleSheet, View, Dimensions, TextInput, Button, Text } from 'react-native';
import * as Location from 'expo-location';



export default function Home() {

    const [locationCheck, setLocationCheck] = useState(0);
    const [regionLat, setRegionLat] = useState(60.201373);
    const [regionLng, setRegionLng] = useState(24.934041);
    const [markerLatitude, setMarkerLatitude] = useState(60.201373);
    const [markerLongitude, setMarkerLongitude] = useState(24.934041);
    const [inputText, setInputText] = useState('')
    //These two get the window size for the map
    const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
    const [windowWidth, setWindonwWidth] = useState(Dimensions.get('window').width);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    //This is called by the useEffect when the screen starts
    const getLocation = async () =>{
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
    if (errorMsg === text){
        return(
            <View style={styles.container}>
                <Text style={styles.error_msg}>You shall not pass</Text> 
                <Text style={styles.txt}>have you given the rights to your location?</Text>
                <Button title='Check again!' onPress={() => setLocationCheck(locationCheck + 1)} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                //Styles will be handled in css file 
                //this is just for testing purpose
                textAlign={'center'} style={styles.input} keyboardType={'default'}

                //This is hacky way to get the text from TextInput :D
                onChangeText={text => setInputText(text)} value={inputText}

                placeholder="Find a train or station"
            />
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
        </View>
    );
}

//These will be transferd to the css file
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        width: 300,
        height: 40,
        marginBottom: 1,
    },
    error_msg: {
        fontSize: '40%',
        color: 'red'
    },
    txt:{
        color: 'red'
    },
});