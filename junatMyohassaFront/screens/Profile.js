import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import styles from '../styles/Styles';

export default function Profile(){

    const [omaAsema, setOmaAsema] = useState("");

    //Hakee async storagesta oman aseman

    if (omaAsema != true){
        return(
            <View>
                <Text>Omaa asemaa ei ole valittu</Text>
                <Text>Anna oma asema</Text>
                <TextInput
                    textAlign={'center'}
                    style={styles.input}
                    keyboardType={'default'} 
                    onChangeText={text => setOmaAsema(text)} value={omaAsema}
                    placeholder="Anna haluamasi asema"
                />
                
            </View>
        );
    }

    return(
        <View>
            <Text>Your profile</Text>
            <TextInput
                textAlign={'center'}
                style={styles.input}
                keyboardType={'default'} 
                onChangeText={text => setOmaAsema(text)} value={omaAsema}
                placeholder="Anna haluamasi asema"
            />
        </View>
    );
}