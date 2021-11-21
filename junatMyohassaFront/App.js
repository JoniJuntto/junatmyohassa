import Home from './screens/Home';
import TrainsOnStation from './screens/TrainsOnStation';
import TrainInfo from './screens/TrainInfo';
import EditUserInfo from './screens/EditUserInfo';
import React, {useEffect} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Profile from './screens/Profile';
import DropDown from './components/DropDown';
import {  AntDesign } from '@expo/vector-icons';




const Drawer = createDrawerNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={Home}
          options={
            {
              drawerLabel: "Home",
              drawerIcon: ({ tintColor }) => <AntDesign name="home" size={30} color={tintColor} />
            }}
        />

        <Drawer.Screen
          name="Profile"
          component={EditUserInfo}
          options={
            {
              drawerLabel: "Profile",
              drawerIcon: ({ tintColor }) => <AntDesign name="profile" size={30} color={tintColor} />
            }}
        />
       



        <Drawer.Screen
          name="Station"
          component={TrainsOnStation}
          options={{
            drawerLabel: () => null,
            title: null,
            drawerIcon: () => null
          }}
        />

        <Drawer.Screen
          name="TrainInfo"
          component={TrainInfo}
          options={{
            drawerLabel: () => null,
            title: null,
            drawerIcon: () => null
          }}
        />

      </Drawer.Navigator>
    </NavigationContainer>
  );
}