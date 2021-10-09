import { View, Text } from "react-native";
import React from 'react';

export default function List(props){
    return (
        <View>
            {
                props.list.map(train => {
                    return (
                        <View>
                            <Text>{train.trainNumber}</Text>
                        </View>
                    );
                })
            }
        </View>
    );
}