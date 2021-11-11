import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ImageBackground, Image, Linking } from 'react-native';
import SeriesContext from '../../context/DetailsContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker'
import playIcon from '../../assets/play.png';

export default function SeriesDetails() {
    const {getIdShow} = useContext(SeriesContext)
    const [data, setData] = useState(undefined)
    const [season, setSeason] = useState(undefined)
    const [selectedSeason, setSelectedSeason] = useState();

    async function getDetails(id){
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=04c35731a5ee918f014970082a0088b1&Season=en-US`)
        const data = await response.json()

        setData(data)
    }

    async function getSeasons(id, season){
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`)
        const data = await response.json()

        setSeason(data)
    }

    function skeleton(){
        return (
            <View style={styles.container}>
                <View style={{display: 'flex', alignItems: 'center'}}>
                    <LinearGradient
                        colors={['#686868' , '#181818']}
                        style={[styles.mainMovie, {margin: 8, width: '96%'}]}
                    />
                </View>
                <View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={[styles.votes, {backgroundColor: '#2f2f2f'}]} />
                            
                       
                         <View style={{display: 'flex', flexDirection: 'column', marginLeft: 8}} >
                            <View style={{ width: 40, height: 10, backgroundColor: '#2f2f2f'}}/>      
                            <View style={{marginLeft: 8, width: 20, height: 10, backgroundColor: '#2f2f2f', marginTop: 4}}/>
                        </View>
                         
                    </View>

                    <View style={{marginLeft: 8, display: 'flex', flexDirection: 'row'}}>
                        <View style={{borderColor: '#2f2f2f', backgroundColor: '#2f2f2f', borderRadius: 10, borderWidth: 1, marginHorizontal: 4, width: 60, height: 10}} />
                        <View style={{borderColor: '#2f2f2f', backgroundColor: '#2f2f2f', borderRadius: 10, borderWidth: 1, marginHorizontal: 4, width: 60, height: 10}} />
                        <View style={{borderColor: '#2f2f2f', backgroundColor: '#2f2f2f', borderRadius: 10, borderWidth: 1, marginHorizontal: 4, width: 60, height: 10}} />
                    </View> 

                    <LinearGradient 
                        style={{ width: '94%', marginTop: 8, height: 60, alignSelf: 'center'}} 
                        colors={['#686868' , '#181818']}
                    />    
                          
                </View>
            </View>
        )
    }

    if(data === undefined)
            getDetails(getIdShow)

    function render(){ 
        return(
            <View style={styles.container}>
                <ImageBackground 
                    style={styles.moviePoster}
                    source={{uri: 'https://image.tmdb.org/t/p/w500' + data.backdrop_path}} 
                >
                    <LinearGradient
                        colors={['transparent' , 'rgba(0,0,0,0.85)']}
                        style={styles.moviePoster}
                    >
                    <View style={styles.movieText}>
                        <Text style={{color: '#fff', fontSize: 24, margin: 8, width: 300}}>{data.name}</Text>
                    </View>
                    </LinearGradient>
                </ImageBackground>
            
                <ScrollView>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={[styles.votes, {backgroundColor: data.vote_average > 7.5 ? '#1a9602' : data.vote_average > 5 ? '#aab007' : '#7a0101'}]}>
                            <Text style={{color: '#fff'}}>{data.vote_average.toFixed(1)}</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'column', marginLeft: 8}}>
                            <Text style={{color: '#808080'}}>{data.number_of_seasons === 1 ? data.number_of_seasons + ' season': data.number_of_seasons + ' seasons'}</Text>
                            <Text style={{color: '#808080'}}>{data.first_air_date.slice(0,4)}</Text>
                        </View>
                    </View>
                    {data.created_by.length === 0 ? null : 
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={{color: '#808080', marginLeft: 8 }}>Created by: </Text>
                        
                        {data.created_by.map((item, index) => {
                            return(
                                <Text key={index} style={{color: '#808080' }}>{index===data.created_by.length-1 ? item.name : item.name + ', '}</Text>
                            )
                        })}
                    </View>}
                    <View style={{display: 'flex', flexDirection: 'row', marginHorizontal: 8, marginTop: 8}}>
                        {data.genres.map(genre =>{
                            return(
                                <View style={{borderColor: '#808080', borderRadius: 10, borderWidth: 1, marginHorizontal: 4}} key={genre.id}>
                                    <Text style={{color: '#808080', marginHorizontal: 8}}>{genre.name}</Text>
                                </View>
                            )
                        })}
                    </View>
        
                    <Text style={{color: '#fff', margin: 8}}>{data.overview.length < 250 ? data.overview : data.overview.substring(0, 250) + '...'}</Text> 

                    <Picker
                        selectedValue={selectedSeason}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedSeason(itemValue)
                            setSeason(undefined)
                            if(itemValue !== "")
                                getSeasons(getIdShow, itemValue)
                        }}
                        style={{backgroundColor: '#808080', width: 200, marginLeft: 8}}
                        
                    >
                        <Picker.Item label="Select a season" value="" enabled={false}/>
                        {data.seasons.map(season => {
                            return(
                                <Picker.Item label={season.name} value={season.season_number} />
                            )
                        })}
                        
                    </Picker>
                    {season == undefined ? null : 
                        <View>
                            {season.episodes.map(episode => {
                                return(
                                <View>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <ImageBackground style={{width: 200, height: 100, margin: 8, marginTop: 12, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} source={{uri: 'https://image.tmdb.org/t/p/w500' + episode.still_path}}>
                                            <View style={{backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 50}} onTouchEnd={() => {Linking.openURL(data.homepage).catch(err => console.error('Error', err));}}>
                                                <Image source={playIcon}/>
                                            </View>
                                        </ImageBackground>
                                        <View>
                                            <Text style={{color: '#fff', width: 150, fontSize: 16}}>{episode.episode_number}. {episode.name}</Text>
                                            <Text style={{color: '#808080'}}>★ {episode.vote_average.toFixed(1)}</Text>
                                        </View>
                                    </View>
                                    <Text style={{color: '#808080', marginVertical: 4, marginHorizontal: 8}}>{episode.overview.length > 160 ? episode.overview.substring(0,160)+'...' : episode.overview}</Text> 
                                </View>
                                )
                            })}
                        </View>
                    }
                </ScrollView>

            </View>
        )
    }

    return (
        <View>
            {data !== undefined ? render() : skeleton()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'black',
      display: 'flex',
      height: '100%',
    },
    areaMovies: {
      marginLeft: 6,
      marginRight: 6,
      marginBottom: 12
    },
    textTitle:{
      color: '#fff',
      marginBottom: 8,
      marginTop: 12,
      marginLeft: 8,
      fontSize: 18,
    },
    votes: {
        width: 30,
        height: 30,
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    moviePoster: {
      width: '100%',
      height: 200,
      zIndex: 0, 
    },
    movieText: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 100,
      width: 140,
      height: 210,
      justifyContent: 'flex-end',
    },
  });

