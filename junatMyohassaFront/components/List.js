import { View, Text, FlatList } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { Card, Icon } from "react-native-elements";
import styles from "../styles/Styles";
import { useNavigation } from "@react-navigation/native";

export default function List(props) {
  const navigation = useNavigation();
  const [sortedList, setSortedList] = useState([]);

  const sortData = () =>{
    setSortedList( props.list.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.timeTableRows[0].scheduledTime) - new Date(a.timeTableRows[0].scheduledTime);
    }));
  }

  useLayoutEffect(() => {
    sortData();
    console.log(sortedList)
  }, [props.list]);

  const Item = ({ title }) => {
    // Tsiigataan kummitusjunien varalta, eli jos timetablerow on false sitä ei oteta mukaan kaatamaan sovellusta
    if (Array.isArray(title.timeTableRows)) {
      return (
        <Card containerStyle={styles.card}>
          <Text>{title.commuterLineid}</Text>
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
      data={sortedList}
      renderItem={renderItem}
      keyExtractor={(item) => item.trainNumber.toString()}
    />
  );
}
