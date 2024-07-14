/*  Hier wird eine API Anfrage an open-meteo.com gestellt.
    Die Daten lassen sich nur in JSON-Format konsumieren, daher werden hier zusätzlich die Daten in ein XML Format konveriert.
    Das Datenformat sieht wie folgt aus (es handelt sich dabei nur um einen Ausschnitt und wird in orchestrator.js in eine wohlgeformte XML geparsed):

<historical>

    ...

    <year value="2024">
        <average_precipitation_sum>2.4</average_precipitation_sum>
        <average_temperature_2m_max>-22.5</average_temperature_2m_max>
        <snowfall_sum>1.68</snowfall_sum>
    </year>

    ...

</historical>
*/

export async function getHistoricalWeather(latitude, longitude, startDate) {
    const url = `https://archive-api.open-meteo.com/v1/archive`;

    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        start_date: startDate,
        end_date: "20" +getLastDayOfPreviousYear(),
        timezone: 'UTC',
        daily: 'precipitation_sum,temperature_2m_max,snowfall_sum' // hier die Art der Daten definiert
    });
    
    try {
        const response = await fetch(`${url}?${params.toString()}`);
        console.log(`${url}?${params.toString()}`)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const weatherData = await response.json();
        // zurückgeben der Jahresdurchschnittswerte in obig beschriebenem XML Format
        return jsonToXML(calculateYearlyAverages(weatherData));
    } catch (error) {
        console.error('Failed to fetch historical weather data:', error);
        return { error: 'Unable to fetch historical weather data' };
    }
    
}

function getLastDayOfPreviousYear() {
    const today = new Date();
    const previousYear = today.getFullYear() - 1;
    const lastDayOfPreviousYear = new Date(previousYear, 11, 31); // Month is 0-indexed (11 is December)
    
    const year = lastDayOfPreviousYear.getFullYear().toString().slice(-2); // Get last 2 digits of year
    const month = String(lastDayOfPreviousYear.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = String(lastDayOfPreviousYear.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Konvertierung der erhaltenen JSON-Daten in XML
function jsonToXML(data) {
    let year_list = [];
    let precipition_values = [];
    let temperature_values = [];
    let snowfall_values = [];
    let xml = '<historical>\n';

    for (let year in data) {
        xml += `  <year value="${year}">\n`;
        xml += `    <average_precipitation_sum>${data[year].average_precipitation_sum}</average_precipitation_sum>\n`;
        xml += `    <average_temperature_2m_max>${data[year].average_temperature_2m_max}</average_temperature_2m_max>\n`;
        xml += `    <snowfall_sum>${data[year].snowfall_sum}</snowfall_sum>\n`;
        xml += '  </year>\n';
    }
    xml += '</historical>';
   

    for (let year in data) {
        
        snowfall_values.push(data[year].snowfall_sum);
        year_list.push(year);
        precipition_values.push(data[year].average_precipitation_sum);
        temperature_values.push(data[year].average_temperature_2m_max);
    }
   
    //xml += generateChartCoordinates(data);
    const precipition_coords =  scaleArray(precipition_values);
    const temperature_coords = scaleArray(temperature_values);
    const snowfall_coords = scaleArray(snowfall_values);


    //        xmlData += '<chart xvalue="Zeit in Jahren" yvalue="keine in °C" color="blue">\n<title>Sample Line Chart</title>\n <values>\n<point tag="2010" x="0" y="00" />\n<point tag="2011" x="100" y="60" />\n<point tag="2012" x="200" y="122" />\n<point tag="2013" x="300" y="30" />\n<point tag="2014" x="400" y="5" />\n</values>\n</chart>';

    xml += '<chart xvalue="Zeit in Jahren" yvalue="Niederschlag in mm/m2" color="blue">\n<title>Sample Line Chart</title>';
    xml += '\n<values>\n';
    for (let i = 0; i < precipition_values.length; i++) {
       
        xml += '<point tag="' + year_list[i] + '" x="' + (i*35) + '" y="' + precipition_coords[i] + '" value="' + Math.round(precipition_values[i]*100)/100.0 + '" />\n';
        
    }
    xml += '</values>\n';
    xml += '</chart>\n';

    xml += '<chart xvalue="Zeit in Jahren" yvalue="Temperatur in °C" color="blue">\n<title>Sample Line Chart</title>';
    xml += '\n<values>\n';
    for (let i = 0; i < temperature_values.length; i++) {
       
        xml += '<point tag="' + year_list[i] + '" x="' + (i*35) + '" y="' + temperature_coords[i] + '" value="' + Math.round(temperature_values[i]*100)/100.0 + '" />\n';
        
    }
    xml += '</values>\n';
    xml += '</chart>\n';

    xml += '<chart xvalue="Zeit in Jahren" yvalue="Schnefall in mm/m2" color="blue">\n<title>Sample Line Chart</title>';
    xml += '\n<values>\n';
    for (let i = 0; i < snowfall_values.length; i++) {
       
        xml += '<point tag="' + year_list[i] + '" x="' + (i*35) + '" y="' + snowfall_coords[i] + '" value="' + Math.round(snowfall_values[i]*100)/100.0 + '" />\n';
        
    }
    xml += '</values>\n';
    xml += '</chart>\n';
    return xml;
}

// da die API nur taegliche Messwerte bereithaelt, muss der Jahresdurchschnitt hier noch berechnet werden
function calculateYearlyAverages(data) {

    function getYear(dateString) {
        return new Date(dateString).getFullYear();
    }

    let yearlyData = {};

    // Iteration durch die täglichen Daten und Akkumulation der Werte pro Jahr
    for (let i = 0; i < data.daily.time.length; i++) {
        let year = getYear(data.daily.time[i]);
        if (!yearlyData[year]) {
            yearlyData[year] = {
                precipitation_sum: 0,
                temperature_2m_max: 0,
                snowfall_sum: 0,
                count: 0
            };
        }
        yearlyData[year].precipitation_sum += data.daily.precipitation_sum[i];
        yearlyData[year].temperature_2m_max += data.daily.temperature_2m_max[i];
        yearlyData[year].snowfall_sum += data.daily.snowfall_sum[i];
        yearlyData[year].count += 1;
    }

    // Berchnung des Jahresdurchschnitts
    let yearlyAverages = {};
    for (let year in yearlyData) {
        yearlyAverages[year] = {
            average_precipitation_sum: yearlyData[year].precipitation_sum,
            average_temperature_2m_max: yearlyData[year].temperature_2m_max / yearlyData[year].count,
            snowfall_sum: yearlyData[year].snowfall_sum
        };
    }

    return yearlyAverages;
}

function scaleArray(data) {
    if (data.length == 0) {
      return [];
    }
    // Finde den kleinsten Wert im Array
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    let scaleFactor;
    if (maxValue > 0) {
        // Berechne den Skalierungsfaktor
        scaleFactor = 300 / maxValue;
    } else if (maxValue < 0) {
        scaleFactor = 100/ -minValue;
    } else {
        return data;
    }

    
    
    // Skaliere die Werte
    data = data.map(value => {
        return Math.floor(value * scaleFactor);});
    return data;
  }
  

