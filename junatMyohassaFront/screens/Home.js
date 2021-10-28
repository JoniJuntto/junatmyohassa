import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import Map from '../components/Map'
import styles from '../styles/Styles';
import { SearchBar } from 'react-native-elements';



export default function Home({ navigation }) {

    const [inputText, setInputText] = useState('')
    const [pressed, setPressed] = useState(0);

    

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

            <Button
                title="Go to stationlisting"
                onPress={() => {
                    setPressed(pressed + 1 );
                    /* Navigate to the Listing route with param from TextInput */
                    console.log(inputText)
                    navigation.navigate('Station', {
                        userInput: inputText,
                        pressed: pressed,
                    });
                }}
            />
            <Map />
        </View>
    );
}
