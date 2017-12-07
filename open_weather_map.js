const WEATHER_API_KEY = "7a1cc4ad8e3c4e2847bcfd2731cbea13";
const API_STEM = "https://api.openweathermap.org/data/2.5/weather?";

function zipUrl(zip) {
  return `${API_STEM}zip=${zip}&units=imperial&APPID=${WEATHER_API_KEY}`;
}

function latLonUrl(lat, lon) {
  return `${API_STEM}lat=${lat}&lon=${lon}&units=imperial&APPID=${WEATHER_API_KEY}`;
}

function fetchForecast(url) {
  console.log("going to fetch forecast " + url);
  return fetch(url)
    .then((response) => response.json())
    .then((responseJSON) => {
      return {
        main: responseJSON.weather[0].main,
        description: responseJSON.weather[0].description,
        temp: responseJSON.main.temp
      };
    })
    .catch(error => {
      console.error(error);
    });
}

function fetchZipForecast(zip) {
  return fetchForecast(zipUrl(zip));
}

function fetchLatLonForecast(lat, lon) {
  return fetchForecast(latLonUrl(lat, lon));
}

export default {
  fetchZipForecast: fetchZipForecast,
  fetchLatLonForecast: fetchLatLonForecast
};
