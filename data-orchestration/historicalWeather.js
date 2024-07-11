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

export async function getHistoricalWeather(latitude, longitude, startDate, endDate) {
    const url = `https://archive-api.open-meteo.com/v1/archive`;

    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        start_date: startDate,
        end_date: getLastDayOfPreviousYear(),
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
    
    let xml = '<historical>\n';

    for (let year in data) {
        xml += `  <year value="${year}">\n`;
        xml += `    <average_precipitation_sum>${data[year].average_precipitation_sum}</average_precipitation_sum>\n`;
        xml += `    <average_temperature_2m_max>${data[year].average_temperature_2m_max}</average_temperature_2m_max>\n`;
        xml += `    <snowfall_sum>${data[year].snowfall_sum}</snowfall_sum>\n`;
        xml += '  </year>\n';
    }

    xml += '</historical>';
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
            average_precipitation_sum: yearlyData[year].precipitation_sum / yearlyData[year].count,
            average_temperature_2m_max: yearlyData[year].temperature_2m_max / yearlyData[year].count,
            snowfall_sum: yearlyData[year].snowfall_sum / yearlyData[year].count
        };
    }

    return yearlyAverages;
}


