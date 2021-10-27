import React from "react";
import {Text, View, FlatList, Button} from 'react-native';
import { styles } from '../styles/Styles';

export default function TrainInfo({navigation, route}){

    const { ID, date,title  } = route.params;

    const onpressed = () =>{
      console.log(title)
    }
    return(
        <View >
            <Button title='name' onPress={onpressed}/>
            <Text>{ID}</Text>
            <Text>{date}</Text>
        </View>
    );
}