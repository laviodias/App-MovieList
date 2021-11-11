import React,  {useContext, useState } from 'react'
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, ImageBackground } from 'react-native'
import imgNotFound from '../../assets/no-image.png'
import DetailsContext from '../../context/DetailsContext'

async function searchTrends(){
    const response = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1')
    const data = await response.json()

    return data
}

async function search(query){
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=${query}`)
    const data = await response.json()

    return data
}

export default function SearchMovies(props) {
    const [trends, setTrends] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [query, setQuery] = useState('')
    const [margin, setMargin] = useState(4)
    const {setIdMovie} = useContext(DetailsContext)

    function render(list){
        if(list && list.length > 0){
            return list.map((item, index) => {
                return (
                    <View 
                        key={index} 
                        style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#242423', marginTop: 4}}
                        onTouchEnd={() => {
                            setIdMovie(item.id)
                            props.navigation.navigate('MovieDetails')
                        }}
                    >
                        <ImageBackground 
                            source={item.backdrop_path === null ? imgNotFound : {uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`}} 
                            style={{width: 160, height: 80}} 
                        />
                        <Text style={{color: '#fff', width: 140, marginLeft: 8}}>{item.title}</Text>
                    </View>
                )
            })
        }else
            return (<Text style={{color: '#fff'}}>Sorry, we could not find that movie.</Text>)
    }

    if(trends.length === 0)
        searchTrends().then(data => setTrends(data.results))

    return (
        <SafeAreaView style={styles.container}>
            <TextInput 
                onFocus={() => margin === 4 ? setMargin(0) : setMargin(4)}
                onEndEditing={() => margin === 4 ? setMargin(0) : setMargin(4)}
                style={[styles.input, {marginHorizontal: margin}]} 
                placeholder="Search for a movie..." 
                selectionColor='#fff' 
                placeholderTextColor='#ababab'
                onChangeText={(query) => {
                    setQuery(query)
                    if(query !== ''){
                        search(query).then(data => setSearchResults(data.results))
                    }
                }}
            />
            <ScrollView>
            <Text style={{color: '#fff', fontSize: 18, marginVertical: 8, marginLeft: 4}}>{query !== '' ? 'Results for ' + `"${query}"` : 'Most searched'}</Text>
            {
                trends.length > 0 ? query === '' ? render(trends) : render(searchResults) : <Text>Loading...</Text>
            }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    input: {
        height: 40,
        backgroundColor: '#242423',
        color: '#fff',
        paddingLeft: 8,
        marginVertical: 8,
    }
})
