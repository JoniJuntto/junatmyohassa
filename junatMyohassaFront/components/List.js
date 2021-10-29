import { View, Text, FlatList } from "react-native";
import React from "react";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import styles from "../styles/Styles";
import { useNavigation } from "@react-navigation/native";

export default function List(props) {
  const navigation = useNavigation();

  const Item = ({ title }) => (
    <Card containerStyle={styles.card}>
      <Text>{title.commuterLineid}</Text>
      <Text>{title.timeTableRows[0].scheduledTime.slice(11, 16)}</Text>
      <Icon
        name="info"
        onPress={() => {
          navigation.navigate("TrainInfo", {
            ID: title.commuterLineID,
            date: title.departureDate,
            dif: title.scheduledTime,
            title: title,
          });
        }}
      />
    </Card>
  );
  const renderItem = ({ item }) => <Item title={item} />;
  return (
    <FlatList
      data={props.list}
      renderItem={renderItem}
      keyExtractor={(item) => item.timeTableRows[0].scheduledTime}
    />
  );
}
