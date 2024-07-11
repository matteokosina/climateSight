// import data service
const {getHistoricalWeather } = require("./services/openmeteo");

async function orchestrator(latitude, longitude) {
    let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlData += '<!DOCTYPE weather SYSTEM "climatesight.dtd">\n';

    xmlData += await getHistoricalWeather(latitude, longitude, '2000-01-01', '2024-01-01');
        
    console.log(xmlData)
    }

module.exports = {orchestrator};