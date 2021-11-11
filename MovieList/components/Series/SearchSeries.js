import React,  {useContext, useState } from 'react'
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, ImageBackground } from 'react-native'
import imgNotFound from '../../assets/no-image.png'
import DetailsContext from '../../context/DetailsContext'

async function searchTrends(){
    const response = await fetch('https://api.themoviedb.org/3/trending/tv/week?api_key=04c35731a5ee918f014970082a0088b1')
    const data = await response.json()

    return data
}

async function search(query){
    const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1&include_adult=false&query=${query}`)
    const data = await response.json()

    return data
}

export default function SearchMovies(props) {
    const [trends, setTrends] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [query, setQuery] = useState('')
    const [margin, setMargin] = useState(4)
    const {setIdShow} = useContext(DetailsContext)

    function render(list){
        if(list && list.length > 0){
            return list.map((item, index) => {
                return (
                    <View 
                        key={index} 
                        style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#242423', marginTop: 4}}
                        onTouchEnd={() => {
                            setIdShow(item.id)
                            props.navigation.navigate('Details')
                        }}
                    >
                        <ImageBackground 
                            source={item.backdrop_path === null ? imgNotFound : {uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`}} 
                            style={{width: 160, height: 80}} 
                        />
                        <Text style={{color: '#fff', width: 140, marginLeft: 8}}>{item.name}</Text>
                    </View>
                )
            })
        }else
            return (<Text style={{color: '#fff'}}>Sorry, we could not find that show.</Text>)
    }

    if(trends.length === 0)
        searchTrends().then(data => setTrends(data.results))

    function skeleton(){
        const array = [1,2,3,4,5,6,7,8,9,10]
        return array.map((item, key) =>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#242423', marginTop: 4}}>
                <View style={{width: 160, height: 80}} >
                    <LinearGradient
                        colors={['#686868' , '#181818']}
                        style={{width: 160, height: 80}} 
                    />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInput 
                onFocus={() => margin === 4 ? setMargin(0) : setMargin(4)}
                onEndEditing={() => margin === 4 ? setMargin(0) : setMargin(4)}
                style={[styles.input, {marginHorizontal: margin}]} 
                placeholder="Search for a tv show..." 
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
