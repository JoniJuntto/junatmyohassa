import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import Map from '../components/Map'
import styles from '../styles/Styles';


export default function Home({ navigation }) {

    const [inputText, setInputText] = useState('')

    return (
        <View style={styles.container}>
            <TextInput
                textAlign={'center'}
                style={styles.input} 
                keyboardType={'default'}
                //This is hacky way to get the text from TextInput :D
                onChangeText={text => setInputText(text)} value={inputText}
                placeholder="Find a train or station"
            />
            <Button title="mee sinne listaan" onPress={()=>{navigation.navigate("Listing")}} />
            <Map />
        </View>
    );
}
