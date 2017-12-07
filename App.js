import React, { Component } from "react";

import { StyleSheet, Text, View, TextInput, AsyncStorage, Image } from "react-native";
import { WebBrowser, Constants, Location, Permissions } from 'expo';
import Forecast from "./Forecast/index";
import LocationButton from "./LocationButton";
import textStyles from "./styles/typography.js";

const STORAGE_KEY = "@SmarterWeather:zip";

import OpenWeatherMap from "./open_weather_map";

// import PhotoBackdrop from "./PhotoBackdrop/local_image";
import PhotoBackdrop from './PhotoBackdrop/index';
class WeatherProject extends Component {
  constructor(props) {
    super(props);
    this.state = { forecast: null };
  }

  componentDidMount() {
    AsyncStorage
      .getItem(STORAGE_KEY)
      .then(value => {
        if (value !== null) {
          this._getForecastForZip(value);
        }
      })
      .catch(error =>
        console.error("AsyncStorage error: " + error.message))
      .done();
    // }

    _getForecastForZip = zip => {
      AsyncStorage
        .setItem( STORAGE_KEY, zip )
        .then(() => console.log("Saved selection to disk: " + zip))
        .catch(error => 
          console.error("AsyncStorage error: " + error.message))
        .done();

      OpenWeatherMap.fetchZipForecast(zip).then(forecast => {
        this.setState({ forecast: forecast });
      });
    };

    _getForecastForCoords = (lat, lon ) => {
      OpenWeatherMap.fetchLatLonForecast(lat, lon).then(forecast => {
        this.setState({ forecast: forecast });
      });
    };

    _handleTextChange = event => {
      let zip = event.nativeEvent.text;
      this._getForecastForZip(zip);
    };
    

    render() {
      let content = null;
      if (this.state.forecast !== null) {
        content = (
          <View style = { styles.row }>
            <Forecast
              main={this.state.forecast.main}
              temp={this.state.forecast.temp}
            />
          </View>
        );    
      }
      return (
        <PhotoBackdrop>
          <View style={ styles.overlay }>
            <View style={ styles.row }>
              <Text style={ textStyles.mainText }>
                Forecast for
              </Text>
              
              <View style={styles.zipContainer}>
                <TextInput
                  style={[textStyles.mainText, styles.zipCode]}
                  onSubmitEditing={this._handleTextChange}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
            <View style = { styles.row }>
              <LocationButton
                onGetCoords= { this._getForecastForCoords } 
              />
            </View>    
            {content}
          </View>
        </PhotoBackdrop>     
      );
    }
  }


const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.1)"
  },
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  zipContainer: {
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
    marginLeft: 5,
    marginTop: 3,
    width: 80,
    height: textStyles.baseFontSize * 2,
    justifyContent: "flex-end"
  },
  zipCode: { flex: 1 }
});

export default WeatherProject;
