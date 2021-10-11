import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import TrainListing from './screens/TrainListing';
import TrainsOnStation from './screens/TrainsOnStation';


const MyTheme = {
  dark: true,
  colors: {
    primary: '#bd06d1',
    background: 'black',
    card: '#8a0099',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};






const Stack = createStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name="Listing" component={TrainListing} />
        <Stack.Screen name="Station" component={TrainsOnStation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};