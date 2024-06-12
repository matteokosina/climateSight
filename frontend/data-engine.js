const { getHistoricalWeather } = require("./api-calls/open-meteo");
const { getCurrentTemperature } = require("./api-calls/openweathermap");
const { getAirQuality } = require("./api-calls/air-quality");

const latitude = 52.52437;   // Latitude for New York City
const longitude = 13.41053; // Longitude for New York City
const startDate = '2023-01-01'; // Start date in YYYY-MM-DD format
const endDate = '2023-01-07';   // End date in YYYY-MM-DD format

getAirQuality(latitude, longitude)
    .then(airQualityData => console.log(airQualityData))
    .catch(error => console.error(error));

getCurrentTemperature(latitude, longitude)
    .then(temperature => console.log(`Current temperature: ${temperature}°C`))
    .catch(error => console.error(error));
    
getHistoricalWeather(latitude, longitude, startDate, endDate)
    .then(weatherData => console.log(weatherData))
    .catch(error => console.error(error));
    
module.exports = {getHistoricalWeather, getCurrentTemperature, getAirQuality };