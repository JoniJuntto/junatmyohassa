import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import React, { useState, useEffect } from 'react';
import { forEach } from "lodash";
import { IconButton, Colors } from 'react-native-paper';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

export default function GetClosestStations({ location }) {
    const [hauts, setHaut] = useState('');
    const [virhe, setVirhe] = useState('');
    const [closestStations, setClosestStations] = useState([]);
    const [loading, setLoading] = useState(false);



    const getStations = async () => {
        try {
            const response = await fetch(
                "http://192.168.1.102:3000/asemat/"
            );
            const json = await response.json();
            setHaut(json);
            setVirhe("");
            doIt(json);
        } catch (error) {
            setHaut([]);
            setVirhe(error);
        }
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
        console.log(lat)
        const distance = getDistanceFromLatLonInKm(lat, long, elementLat, elementLong)
        if (distance < 10) {
            closestStations.push(element)
        }
        //37.4220083 latdeltaplus
    }
    const doIt = async (haut) => {
        setLoading(true)
        await haut.forEach(locationCheck);
        setLoading(false)
    }

    console.log(closestStations);

    return (
        <View style={{ height: 300 }}>
            <Text>Asemat 10 kilometrin sisällä sinusta</Text>
            <FlatList
                data={closestStations}
                renderItem={({ item }) =>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={styles.item}>{item.stationName}</Text>
                        <IconButton
                            icon="heart"
                            color={Colors.red500}
                            size={24}
                            onPress={() => { storeData(item) }}
                        />
                    </View>}
            />
        </View>
    );
}