import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import { useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const W_Options = {
  method: 'GET',
  url: 'https://world-population.p.rapidapi.com/worldpopulation',
  headers: {
    'x-rapidapi-key': 'b966429c14mshca379c6698f57fap11a7cbjsna015e24dfd95',
    'x-rapidapi-host': 'world-population.p.rapidapi.com'
  }
};

const C_Options = {
  method: 'GET',
  url: 'https://covid-19-data.p.rapidapi.com/totals',
  headers: {
    'x-rapidapi-key': 'b966429c14mshca379c6698f57fap11a7cbjsna015e24dfd95',
    'x-rapidapi-host': 'covid-19-data.p.rapidapi.com'
  }
};

const Drawer = createDrawerNavigator();

const World = ({navigation}) => {
  const [W_Population, setW_Population] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [covid_Data, setcovid_Data] = useState([]);

  useEffect(() => {
    axios.request(W_Options).then(function (response) {
      setW_Population(response.data.body.world_population);
    }).then(() => {
      axios.request(C_Options).then(function (response) {
        setcovid_Data(...response.data)
      }).catch(function (error) {
        console.error(error);
      });
    }).catch(function (error) {
      console.error(error);
    }).finally(() => setIsLoading(false));

  }, [])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
          <MaterialIcons name="api"size={35} color="red" style={{marginLeft: 10}}
            onPress={() => navigation.openDrawer()} />
      ),
    });
  });

  return(
    <View>
      {isLoading?<ActivityIndicator color="red" size="large" marginVertical = {350}/>:
      <View style = {{marginTop: 200}}>
        <View style = {{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', textAlign: 'center', }}>World population:</Text>
        <Text style={{fontSize: 25, textAlign: 'center', borderBottomWidth: 2}}>{W_Population}</Text>
        </View>
        <View style = {{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', textAlign: 'center'}}>Percentage:</Text>
      <Text style={{fontSize: 25, textAlign: 'center', borderBottomWidth: 2}}>{((covid_Data.confirmed / W_Population)*100).toFixed(2)} %</Text>
        </View>
        <View style = {{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', textAlign: 'center'}}>Confirmed: </Text>
      <Text style={{fontSize: 25, textAlign: 'center', borderBottomWidth: 2}}>{covid_Data.confirmed}</Text>
        </View>
        <View style = {{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', textAlign: 'center'}}>Critical: </Text>
      <Text style={{fontSize: 25, textAlign: 'center', borderBottomWidth: 2}}>{covid_Data.critical}</Text>
        </View>
        <View style = {{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', textAlign: 'center'}}>Deaths: </Text>
      <Text style={{fontSize: 25, textAlign: 'center', borderBottomWidth: 2}}>{covid_Data.deaths}</Text>
        </View>
        <View style = {{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', textAlign: 'center'}}>Recovered: </Text>
      <Text style={{fontSize: 25, textAlign: 'center', borderBottomWidth: 2}}>{covid_Data.recovered}</Text>
        </View>
        <View style = {{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 25, fontWeight: 'bold', textAlign: 'center'}}>LastUpdated: </Text>
      <Text style={{fontSize: 25, textAlign: 'center', borderBottomWidth: 2}}>{covid_Data.lastUpdate}</Text>
        </View>
        <Button title =  "Go to Countries" onPress = {() => navigation.navigate('Country List')}/>
      </View>
      }
      
    </View>
  )
}

const CountriesOptions = {
  method: 'GET',
  url: 'https://world-population.p.rapidapi.com/allcountriesname',
  headers: {
    'x-rapidapi-key': 'b966429c14mshca379c6698f57fap11a7cbjsna015e24dfd95',
    'x-rapidapi-host': 'world-population.p.rapidapi.com',
  },
};

const Countries = ({navigation , route}) => {

  const[list, setlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fav, setFav] = useState([]);

  useEffect(() => {
    axios
      .request(CountriesOptions)
      .then((response) => {
        setlist(response.data.body.countries);
      })
      .catch(function (error) {
        console.error(error);
      }).finally(() => setIsLoading(false));
  }, []);

  const favHandler = (name) => {
    if(!fav.includes(name)){
      setFav([...fav, name]);
    }
    console.log(fav)
  }

  return(
    <View>
      <SafeAreaView>
        <TouchableOpacity style={{marginTop: 20}} onPress={() => navigation.navigate('Favorite Country', {fav: fav})}>
          <Text style={{textAlign: 'center', color: 'orange', fontWeight: 'bold', fontSize: 20}}>Favourites</Text>
        </TouchableOpacity>
      <ScrollView>
      {isLoading?<ActivityIndicator color="red" size="large" marginVertical = {350}/>:
      <View>
        {list.map((item) => {
          return(
            <View key = {item}>
              <View style={{alignItems: 'center', marginTop: 10, display: 'flex', flexDirection: 'row', marginLeft: 70}}>
                <Text style={{color: 'orange', marginRight: 10, padding: 10}} onPress={() => favHandler(item)}>Fav*</Text>
                <TouchableOpacity style={{marginTop: 10}}
                onPress = {() => navigation.navigate('Country Data', {name: item})}
                >
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item}</Text>
                </TouchableOpacity>
              
              </View>
            </View>
          )
        })}
      </View>

      }
      </ScrollView>
      </SafeAreaView>


    </View>
  )
}




const CountryData = ({navigation , route}) => {

  const Country_Population_Options = {
    method: 'GET',
    url: 'https://world-population.p.rapidapi.com/population',
    params: {country_name: route.params.name},
    headers: {
      'x-rapidapi-key': 'b966429c14mshca379c6698f57fap11a7cbjsna015e24dfd95',
      'x-rapidapi-host': 'world-population.p.rapidapi.com',
    },
  };
  
  const Country_covid_Options = {
    method: 'GET',
    url: 'https://covid-19-data.p.rapidapi.com/country',
    params: {name: route.params.name},
    headers: {
      'x-rapidapi-key': 'b966429c14mshca379c6698f57fap11a7cbjsna015e24dfd95',
      'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
    },
  };

  const [CountryData, setCountryData] = useState([0]);
  const [Countrypopulation, setCountrypopulation] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(route.params.name)
    axios
      .request(Country_Population_Options)
      .then(function (response) {
        console.log(response.data);
        setCountrypopulation(response.data.body.population);
        
      })
      .then(() => {
        axios
          .request(Country_covid_Options)
          .then(function (response) {
            console.log(response.data);
            setCountryData(...response.data);
            
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }, []);
  return(
    <View>
      {IsLoading?<ActivityIndicator color="red" size="large" marginVertical = {350}/>:
      <View style={{display: 'flex', alignItems: 'center', marginVertical: 50}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{route.params.name} Statistics</Text>
        <Text>Country population: {Countrypopulation}</Text>
        <Text>Confirmed Cases: {CountryData.confirmed}</Text>
        <Text>Total {((CountryData.confirmed / Countrypopulation)*100).toFixed(1)} % is infected</Text>
        <Text>Critical Case: {CountryData.critical}</Text>
        <Text>Deaths: {CountryData.deaths}</Text>
        <Text>Recovered: {CountryData.recovered}</Text>
        <Text>Last Updated: {CountryData.lastUpdate}</Text>
      </View>
      }
      
    </View>
  )
}

const Fav_Country = ({navigation, route}) => {
  const [fav, setFav] = useState([]);
  useEffect(() => {
    setFav(route.params.fav);
    console.log(fav)
  }, [])

  return(
    <View>
      <Text style={{marginLeft: 40, fontSize: 20, fontWeight: 'bold', color: 'orange'}}>Favourites List</Text>
      {fav.map((item) => {
          return(
            <View key = {item}>
              <View style={{alignItems: 'center', marginTop: 10, display: 'flex', flexDirection: 'row', marginLeft: 70}}>
                <TouchableOpacity style={{marginTop: 10}}
                onPress = {() => navigation.navigate('Country Data', {name: item})} >
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item}</Text>
                </TouchableOpacity>
              
              </View>
            </View>
          )
        })}
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="World">
        <Drawer.Screen name="World" component={World} />
        <Drawer.Screen name="Country List" component={Countries}/>
        <Drawer.Screen name="Country Data" component={CountryData}/>
        <Drawer.Screen name="Favorite Country" component={Fav_Country}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});