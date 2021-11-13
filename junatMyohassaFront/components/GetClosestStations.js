import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from 'react';
import { forEach } from "lodash";
import { IconButton, Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        marginLeft: 30
    },
});

export default function GetClosestStations({ location }) {
    const [hauts, setHaut] = useState('');
    const [virhe, setVirhe] = useState('');
    const [closestStations, setClosestStations] = useState([]);
    const [loading, setLoading] = useState(false);



    const getStations = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://172.20.10.3:3000/asemat/"
            );
            const json = await response.json();
            setHaut(json);
            setVirhe("");
            doIt(json);
        } catch (error) {
            setHaut([]);
            setVirhe(error);
            console.log(error)
        }
        setLoading(false);
    }


    useEffect(() => {
        getStations();
    }, [location]);

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    const storeData = async (item) => {
        const value = item.toString();
        try {
            await AsyncStorage.setItem('station', value)
            const print = await AsyncStorage.getItem('station');
            console.log(print);
        } catch (e) {
            console.log(e);
            // saving error
        }
    }

    const locationCheck = (element) => {
        const elementLong = element.longitude;
        const elementLat = element.latitude;
        const long = location.coords.longitude;
        const lat = location.coords.latitude;
        const distance = getDistanceFromLatLonInKm(lat, long, elementLat, elementLong)
        if (distance < 10) {
            if(closestStations.length < 11){
            closestStations.push(element)
            }else{
                console.log("täynnä")
            }
        }
    }
    const doIt = async (haut) => {
        await haut.forEach(locationCheck);
    }


    return (
        <View style={{ height: 300 }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>10 sinua lähintä asemaa:</Text>
            <ActivityIndicator animating={loading} size="large" color="#00ff00" />
            <FlatList
                data={closestStations}
                renderItem={({ item }) =>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <IconButton
                            style={{position: 'absolute'}}
                            icon="heart"
                            color={Colors.red500}
                            size={24}
                            onPress={() => { storeData(item.stationName) }}
                        />
                        <Text style={styles.item}>{item.stationName}</Text>
                        
                    </View>}
            />
        </View>
    );
}