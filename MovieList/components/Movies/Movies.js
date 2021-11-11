import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ImageBackground, Image, NativeEventEmitter } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import searchIcon from '../../assets/search2.png'
import logo from '../../assets/logo.png'
import DetailsContext from '../../context/DetailsContext';

export default function Movies(props) {
  const [adventure, setAdventure] = useState([])
  const [mistery, setMistery] = useState([])
  const [drama, setDrama] = useState([])
  const [action, setAction] = useState([])
  const [comedy, setComedy] = useState([])
  const {setIdMovie} = useContext(DetailsContext)

  async function getNotAdventure(genreCode){
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&with_genres=${genreCode}&without_genres=12&page=1`)
    const list = await response.json()

    switch(genreCode){
      case 28:
        setAction(list.results.slice(0, 10))
        break
      case 35:
        setComedy(list.results.slice(0, 10))
        break
      case 18:
        setDrama(list.results.slice(0, 10))
        break
      case 9648:
        setMistery(list.results.slice(0, 10))
        break
    }
  }

  async function getAdventure(){
    const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&with_genres=12&page=1')
    const adventure = await response.json()

    setAdventure(adventure.results.slice(0, 10))
  }

  if(adventure.length === 0)
    getAdventure()
  if(mistery.length === 0)
    getNotAdventure(9648)
  if(drama.length === 0)
    getNotAdventure(18)
  if(action.length === 0)
    getNotAdventure(28)
  if(comedy.length === 0)
    getNotAdventure(35)    
  
  function render(list){
    return list.map((movie, key)  => 

          <View 
            key={key} 
            style={styles.areaMovies} 
            onTouchEnd={() => {
              setIdMovie(movie.id)
              props.navigation.navigate('MovieDetails')
            }}
          >
          <ImageBackground
            style={styles.moviePoster}
            source={{uri: 'https://image.tmdb.org/t/p/w500' + movie.poster_path}} 
          >
            <LinearGradient
              colors={['transparent' , 'rgba(0,0,0,0.85)']}
              style={styles.moviePoster}
            >
              <View style={styles.movieText}>
                <Text style={{color: '#fff'}}>{movie.title.length < 30 ? movie.title : movie.title.substring(0,30)+'...' }</Text>
                <Text style={{color: '#fff'}}>{movie.release_date.slice(0,4)}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
    )
  }

  function skeleton(){
    const array = [1,2,3,4,5,6,7,8,9,10]
    return array.map((item, key) =>
      <View style={styles.areaMovies}>
        <View style={styles.moviePoster}>
          <LinearGradient
              colors={['#686868' , '#181818']}
              style={styles.moviePoster}
          />
        </View>
      </View>
    )
  }
  
  return(
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
      <Image source={logo}/>
        <View onTouchEnd={() => {props.navigation.navigate('SearchMovies')}}>
          <Image source ={searchIcon}/>
        </View>
      </View>
        
      <ScrollView> 
        
        <View style={{paddingTop: 36}}>
          <Text style={styles.textTitle}>Mistery</Text>
          <ScrollView horizontal style={{width: '100%'}}>
            {mistery.length > 0 ? render(mistery): skeleton()}
          </ScrollView>  
        </View>  

        <Text style={styles.textTitle}>Action</Text>
        <ScrollView horizontal style={{width: '100%'}}>
          {action.length > 0 ? render(action): skeleton()}
        </ScrollView>  

        <Text style={styles.textTitle}>Comedy</Text>
        <ScrollView horizontal style={{width: '100%'}}>
          {comedy.length > 0 ? render(comedy): skeleton()}
        </ScrollView>   

        <Text style={styles.textTitle}>Drama</Text>
        <ScrollView horizontal style={{width: '100%'}}>
          {drama.length > 0 ? render(drama): skeleton()}
        </ScrollView> 

        <Text style={styles.textTitle}>Adventure</Text>
        <ScrollView horizontal style={{width: '100%'}}>
          {adventure.length > 0 ? render(adventure): skeleton()}
        </ScrollView>  

      </ScrollView>

    </SafeAreaView>
  )
}

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'black',
      flex: 1,
    },
    header: {
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: 12, 
      width: '100%', 
      position: 'absolute', 
      zIndex: 100, 
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    areaMovies: {
      marginLeft: 6,
      marginRight: 6,
      marginBottom: 12,
    },
    textTitle:{
      color: '#fff',
      marginBottom: 8,
      marginTop: 12,
      marginLeft: 8,
      fontSize: 18,
    },
    moviePoster: {
      width: 140,
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
