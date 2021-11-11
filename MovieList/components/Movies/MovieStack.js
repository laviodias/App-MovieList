import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Movies from './Movies';
import SearchMovies from './SearchMovies';
import MovieDetails from './MovieDetails';

const StackNav = createStackNavigator();

export default function MovieStack() {
    return (
        <StackNav.Navigator screenOptions={{headerShown: false}}>
            <StackNav.Screen name="MovieList" component={Movies} />
            <StackNav.Screen name="MovieDetails" component={MovieDetails} />
            <StackNav.Screen name="SearchMovies" component={SearchMovies} />
        </StackNav.Navigator>
    )
}
