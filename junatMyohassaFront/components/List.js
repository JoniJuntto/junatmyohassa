import { View, Text, FlatList } from "react-native";
import React from 'react';
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import styles from '../styles/Styles'
import { useNavigation } from '@react-navigation/native';

export default function List(props) {
    const navigation = useNavigation();

    const onInfoPress = () =>{
        navigation.navigate('TrainInfo');
    }

    console.log(props.list);
    const Item = ({ title }) => (
        <Card containerStyle={styles.card}>
          <Text>{title.commuterLineID}</Text>
          <Icon name='info' onPress={onInfoPress}/>
        </Card>
         
      );
      const renderItem = ({ item }) => (
        <Item title={item} />
      );
    return (
        <FlatList
        data={props.list}
        renderItem={renderItem}
        keyExtractor={item => item.trainNumber}
      />
    );
}

//Ensin lista josta timetavblerows josta 
//haetaan kaikki junan pysäkit josta katsotaan missä station shortcode on annetttu parametri