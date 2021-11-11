import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MovieStack from './components/Movies/MovieStack';
import SeriesStack from './components/Series/SeriesStack';
import { DetailsProvider } from './context/DetailsContext';

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <DetailsProvider>
      <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          headerShown: false, 
          lazy: true, 
          tabBarStyle:{backgroundColor: '#1b1b1b'}
        }}
      >
        <Tab.Screen 
          name="Movies" 
          component={MovieStack} 
          options={{
              tabBarIcon:({ color, size }) => (<MaterialCommunityIcons name="video-vintage" color={color} size={size}/>)
          }}
        />
        <Tab.Screen 
          name="Series" 
          component={SeriesStack}
          options={{
            tabBarIcon:({ color, size }) => (<MaterialCommunityIcons name="youtube-tv" color={color} size={size}/>)
          }}
        />
      </Tab.Navigator>
    <StatusBar hidden/>
    </NavigationContainer>
    </DetailsProvider>
  );
}

const styles = StyleSheet.create({
    
});
