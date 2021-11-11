import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Series from './Series';
import SeriesDetails from './SeriesDetails';
import SearchSeries from './SearchSeries';

const StackNav = createStackNavigator();

export default function SeriesStack() {
    return (
        <StackNav.Navigator screenOptions={{headerShown: false}}>
            <StackNav.Screen name="SeriesList" component={Series} />
            <StackNav.Screen name="Details" component={SeriesDetails}/>
            <StackNav.Screen name="SearchSeries" component={SearchSeries}/>
        </StackNav.Navigator>
    )
}
