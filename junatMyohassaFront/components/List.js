import { View, Text, FlatList } from "react-native";
import React from 'react';

export default function List(props) {


    const Item = ({ title }) => (
        <View>
          <Text>{title.commuterLineID}</Text>
        </View>
      );
      const renderItem = ({ item }) => (
        <Item title={item} />
      );
    return (
        <FlatList
        data={props.list}
        renderItem={renderItem}
        keyExtractor={item => item.scheduledTime}
      />
    );
}

//Ensin lista josta timetavblerows josta 
//haetaan kaikki junan pysäkit josta katsotaan missä station shortcode on annetttu parametri