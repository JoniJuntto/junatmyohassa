import React from "react";
import { Text, View, FlatList, Button } from 'react-native';
import { styles } from '../styles/Styles';

export default function TrainInfo({ navigation, route }) {

    const { ID, date, title } = route.params;

return (
    <View >
        <Text>{ID}</Text>
        <Text>{date}</Text>
        <Text>{title.timeTableRows[0].differenceInMinutes}</Text>
        <Text>{title.timeTableRows[0].scheduledTime}</Text>
    </View>
);
}
