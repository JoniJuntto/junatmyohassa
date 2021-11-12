import { View, Text, Button, FlatList } from "react-native";
import React, { useState, useEffect } from 'react';
import { forEach } from "lodash";

export default function GetClosestStations({ location }) {
    const [hauts, setHaut] = useState('');
    const [virhe, setVirhe] = useState('');
    const closestStations = [];

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
    }, []);

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

    const locationCheck = (element) => {
        const elementLong = element.longitude;
        const elementLat = element.latitude;
        const long = location.coords.longitude;
        const lat = location.coords.latitude;
        const distance = getDistanceFromLatLonInKm(lat, long, elementLat, elementLong)
        if (distance < 5) {
            closestStations.push(element)
        }
        //37.4220083 latdeltaplus
    }
    const doIt = (haut) => {
        haut.forEach(locationCheck);
        console.log(closestStations[0].stationName);
    }
    const Item = ({ title }) => {
          return (
            <Card>
              <Text>{title.stationName}</Text>
            </Card>
          );
        
      };

    const renderItem = ({ item }) => <Item title={item} />;

    return (
        <View style={{height: 200}}>
            <Text>Heh</Text>
            {closestStations.map((station, index) => (
            <Text>{station.stationName}</Text>
    ))}
        </View>
    );
}