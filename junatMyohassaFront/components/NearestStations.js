import React, {useEffect, useState} from "react";
import { View, Button, Text } from "react-native";

export default function NearestStations(props) {

    if(!props.location){
        return(<Text>No access to location</Text>);
    }else{console.log(props.location)}

    const location = props.location;

    const [haut, setHaut] = useState([]);
    const [virhe, setVirhe] = useState("");
  
    const haeAsemat = async () => {
      try {
        const response = await fetch(
          "http://10.0.2.2:3000/kaikkiasemat/"
        );
        const json = await response.json();
        setHaut(json);
        setVirhe("");
      } catch (error) {
        setHaut([]);
        setVirhe("Haku ei onnistunut");
      }
    };



    useEffect(() => {
        haeAsemat();
    }, []);

    const getClosestStations = (arr) =>{
        stationArray.push({
            stationName: haku.stationName,
            longitude: haku.longitude,
            latitude: haku.latitude
         })
    }

    const checkDist = (haku) =>{
        const latitudeU = location.latitude;
        const longitudeU = location.longitude;
        const nearestStations = [];
        const difPlusLat = latitudeU + 0.000010;
        const difMinusLat = latitudeU - 0.000010;
        const difPlusLong = longitudeU + 0.000010;
        const difMinusLong = longitudeU - 0.000010;
        const latitudeS = haku.latitude;
        const longitudeS = haku.longitude;


        if(latitudeS > difMinusLat && latitudeS < difPlusLat && longitudeS >difMinusLong && longitudeS < difPlusLong){
            console.log("oho")
        }
    }

    const stationFormatting = () =>{
        haut.filter(checkDist);
    }

    return (
        <View>
            <Text>Hei</Text>
            <Button title='Hei' onPress={stationFormatting} />
        </View>
    );
}