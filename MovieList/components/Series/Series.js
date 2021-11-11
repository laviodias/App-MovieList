import React, { useState, useContext } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DetailsContext from '../../context/DetailsContext';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/search2.png';

export default function Series(props) {
    const [trendings, setTrendings] = useState([])
    const [netflix, setNetflix] = useState([])
    const [amazon, setAmazon] = useState([])
    const {setIdShow} = useContext(DetailsContext)

    async function getTrendings(){
        const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=04c35731a5ee918f014970082a0088b1`)
        const trendings = await response.json()
    
        setTrendings(trendings.results)
    }

    async function getNetflix(){
      const response = await fetch('https://api.themoviedb.org/3/discover/tv?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&region=US&with_networks=213')
      const netflix = await response.json()

      setNetflix(netflix.results)
    }

    async function getAmazon(){
      const response = await fetch('https://api.themoviedb.org/3/discover/tv?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&region=US&with_networks=1024')
      const amazon = await response.json()

      setAmazon(amazon.results)
    }

    if(trendings.length === 0)
      getTrendings()
    if(netflix.length === 0)
      getNetflix()
    if(amazon.length === 0)
      getAmazon()

    function render(list){
      return list.map((show, key)  => 
          <View 
            key={key} 
            style={styles.areaMovies} 
            onTouchEnd={() => {
              setIdShow(show.id)
              props.navigation.navigate('Details')
            }}
          >
            <ImageBackground 
              style={styles.moviePoster}
              source={{uri: 'https://image.tmdb.org/t/p/w500' + show.poster_path}} 
            >
              <LinearGradient
                colors={['transparent' , 'rgba(0,0,0,0.85)']}
                style={styles.moviePoster}
              >
                <View style={styles.movieText}>
                  <Text style={{color: '#fff'}}>{show.name}</Text>
                  <Text style={{color: '#fff'}}>{show.first_air_date.slice(0,4)}</Text>
                  
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
          <View onTouchEnd={() => {props.navigation.navigate('SearchSeries')}}>
            <Image source ={searchIcon}/>
          </View>
        </View>
          
        <ScrollView>
          <View style={{paddingTop: 36}}>
            <Text style={styles.textTitle}>Trendings</Text>
            <ScrollView horizontal style={{width: '100%'}}>
              {trendings.length > 0 ? render(trendings): skeleton()}
            </ScrollView>
          </View>

          <Text style={styles.textTitle}>Netflix</Text>
          <ScrollView horizontal style={{width: '100%'}}>
            {netflix.length > 0 ? render(netflix): skeleton()}
          </ScrollView>

          <Text style={styles.textTitle}>Prime Video</Text>
          <ScrollView horizontal style={{width: '100%'}}>
            {amazon.length > 0 ? render(amazon): skeleton()}
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
  });
