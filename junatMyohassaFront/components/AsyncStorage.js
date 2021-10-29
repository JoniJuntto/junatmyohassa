import React from 'react';
// Import AsyncStorage
import { AsyncStorage } from '@react-native-async-storage/async-storage';


// Saving string value
const storeData = async (value) => {
    try {
        await AsyncStorage.setItem('itemkey', value);
    } catch (err) {
        console.log(err)
    }
}

// Reading string value
const readData = async => {
    try {
        let value = await AsyncStorage.getItem('itemkey');
    } catch (error) {
        console.log(err)
    }
}

// Saving object value
const storeObjectData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('objectkey', jsonValue);
    } catch (err) {
        console.log(err)
    }
}

// Reading object value
const readObjectData = async (value) => {
    try {
    let jsonValue = await AsyncStorage.getItem('objectkey');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
} catch (err) {
    console.log(err)
}
}