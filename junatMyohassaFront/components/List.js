import { View, Text, FlatList } from "react-native";
import React from "react";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import styles from "../styles/Styles";
import { useNavigation } from "@react-navigation/native";

export default function List(props) {
  const navigation = useNavigation();

  const Item = ({ title }) => {
    // Tsiigataan kummitusjunien varalta, eli jos timetablerow on false sitä ei oteta mukaan kaatamaan sovellusta
    if (Array.isArray(title.timeTableRows) === true) {
      return (
        <Card containerStyle={styles.card}>
          <Text>{title.commuterLineID}</Text>
          <Text>{title.timeTableRows[0].scheduledTime.slice(11, 16)}</Text>
          <Icon
            name="info"
            onPress={() => {
              navigation.navigate("TrainInfo", {
                ID: title.commuterLineid,
                trainNr: title.trainNumber,
                dif: title.scheduledTime,
                title: title,
              });
            }}
          />
        </Card>
      );
    }else{
      return(
        <Text></Text>
      );
    }
  };
  const renderItem = ({ item }) => <Item title={item} />;
  return (
    <FlatList
      data={props.list}
      renderItem={renderItem}
      keyExtractor={(item) => item.trainNumber.toString()}
    />
  );
}
