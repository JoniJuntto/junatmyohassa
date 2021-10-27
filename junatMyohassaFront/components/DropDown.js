import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../styles/Styles';
import SelectDropdown from 'react-native-select-dropdown'



export default function DropDown({ route }) {

    const countries = ["Egypt", "Canada", "Australia", "Ireland"]
    const [virhe, setVirhe] = useState('');
    const [haut, setHaut] = useState([]);


    const haeKaikkiJunat = async () => {
        try {
            const response = await
                fetch('http://10.0.2.2:3000/graphfetch/HKI');
            const json = await response.json();
            setHaut(json);
            setVirhe('');
            console.log(json)
        } catch (error) {
            setHaut([]);
            setVirhe('Haku ei onnistunut');
        }
    }

    useEffect(() => {
        haeKaikkiJunat();
    }, []);

    const log = () =>{
        console.log(haut);
    }

    //If there is a problem with fetch, it will just show error text on screen
    if (virhe) {
        <View>
            <Text>{virhe}</Text>
            <Text>Cannot fetch the trains, check your internet-connection</Text>
        </View>
    }

    return (
        <View style={styles.container}>
            <Button title='Buttton' onPress={log} /> 
            <SelectDropdown
                data={haut}
                onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                }}
            />
        </View>
    );
}
