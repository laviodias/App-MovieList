import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ImageBackground, Image, Linking } from 'react-native';
import DetailsContext from '../../context/DetailsContext';
import { LinearGradient } from 'expo-linear-gradient';
import playIcon from '../../assets/play.png';

export default function SeriesDetails(props) {
    const {getIdMovie, setIdMovie} = useContext(DetailsContext)
    const [data, setData] = useState(undefined)
    const [similar, setSimilar] = useState(undefined)

    async function getDetails(id){
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=04c35731a5ee918f014970082a0088b1&Season=en-US`)
        const data = await response.json()

        setData(data)
        getSimilar(id)
    }

    async function getSimilar(id){
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1`)
        const data = await response.json()

        setSimilar(data.results.slice(0, 12))
    }

    function formatDuration(duration){
        const hours = Math.floor(duration / 60)
        const minutes = duration % 60
        return `${hours}h ${minutes}m`
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

    function render(){
        return(
            <View style={styles.container}>
               <ImageBackground 
                    style={styles.mainMovie}
                    source={{uri: 'https://image.tmdb.org/t/p/w500' + data.backdrop_path}} 
                >
                    <LinearGradient
                        colors={['transparent' , 'rgba(0,0,0,0.85)']}
                        style={[styles.mainMovie, {display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}
                    >
                    <View style={{borderRadius: 50}} onTouchEnd={() => {data.homepage !== "" ? Linking.openURL(data.homepage).catch(err => console.error('Error', err)): null}}>
                        <Image source={playIcon}/>
                    </View>
                    <View style={styles.movieText}>
                        <Text style={{color: '#fff', fontSize: 24, margin: 8, width: 300}}>{data.title}</Text>
                    </View>
                    </LinearGradient>
                </ImageBackground> 
                <ScrollView>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={[styles.votes, {backgroundColor: data.vote_average > 7.5 ? '#1a9602' : data.vote_average > 5 ? '#aab007' : '#7a0101'}]}>
                            <Text style={{color: '#fff'}}>{data.vote_average.toFixed(1)}</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'column', marginLeft: 8}}>
                            <Text style={{color: '#808080'}}>{data.release_date.slice(0,4)}</Text>
                        </View>
                        <View style={{marginLeft: 8}}>
                            <Text style={{color: '#808080'}}>{formatDuration(data.runtime)}</Text>
                        </View>
                    </View>
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
                    <View>
                        <Text style={{color: '#808080', marginLeft: 8}}>Similar movies: </Text>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'center', flexWrap: 'wrap', marginTop: 12}}>
                            {similar !== undefined ? similar.map(movie =>{
                                return(
                                    <View 
                                        style={{ display: 'flex', flexDirection: 'row', margin: 3}} 
                                        key={movie.id}
                                        onTouchEnd={() => {
                                            setIdMovie(movie.id)
                                            props.navigation.reset({index: 0, routes: [{name: 'MovieList'},{name: 'MovieDetails'}]})
                                        }}
                                    >
                                        <ImageBackground
                                            style={styles.moviePoster}
                                            source={{uri: 'https://image.tmdb.org/t/p/w500' + movie.poster_path}} 
                                        >
                                            
                                        </ImageBackground>
                                    </View>
                                )
                            }): null}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    if(data === undefined)
        getDetails(getIdMovie)

    return (
        <View>
            {data !== undefined ? render(): skeleton()}
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
        width: 110,
        height: 160,
        zIndex: 0, 
    },
    mainMovie: {
        width: '100%',
        height: 210,
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

