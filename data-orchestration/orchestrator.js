// import data service
const {getHistoricalWeather } = require("./services/historicalWeather");
const {getCurrentWeather} = require("./services/currentWeather");

async function orchestrator(latitude, longitude) {
    let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlData += '<!DOCTYPE weather SYSTEM "climatesight.dtd">\n';
    xmlData += '<data>">\n';

    //xmlData += await getHistoricalWeather(latitude, longitude, '2000-01-01', '2024-01-01');
    xmlData += await getCurrentWeather(latitude, longitude);
    xmlData += '\n</data>">';
        
    console.log(xmlData)
    }

module.exports = {orchestrator};