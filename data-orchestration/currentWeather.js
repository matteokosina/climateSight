/*  Hier wird eine API Anfrage an open-meteo.com gestellt.
    Die Daten lassen sich nur in JSON-Format konsumieren, daher werden hier zusätzlich die Daten in ein XML Format konveriert.
    Das Datenformat sieht wie folgt aus (es handelt sich dabei nur um einen Ausschnitt und wird in orchestrator.js in eine wohlgeformte XML geparsed):

<current>
    <temperature>12.1</temperature>
    <humidity>76</humidity>
    <condition  value = 'de'>leichte Regenschauer</condition>
</current>
*/

export async function getCurrentWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast`;

    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        hourly: 'temperature_2m,relative_humidity_2m,weather_code', // hier wird die Art der Daten definiert
        forecast_days: "2"
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const weatherData = await response.json();

        return filterUpcoming(weatherData);
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return { error: 'Unable to fetch weather data' };
    }
}

// hier werden die Daten für die kommende Stunde gefilter und in XML konvertiert
function filterUpcoming(data) {

    // Ermittlung der naechsten Stunde
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentDate = now.toISOString().split('T')[0];
    const nextHourIndex = data.hourly.time.findIndex(time => time.startsWith(currentDate) && new Date(time).getUTCHours() === (currentHour + 1) % 24);

    if (nextHourIndex !== -1) {
        // Erzeugung der XML-Struktur fuer das aktuelle Wetter ( Wetterprognose der kommenden Stunde )
        let xmlResult = "<current>";
        xmlResult += "\n<temperature>" + data.hourly.temperature_2m[nextHourIndex] + "</temperature>";
        xmlResult += "\n<humidity>" + data.hourly.relative_humidity_2m[nextHourIndex] + "</humidity>";
        xmlResult += "\n<condition  value = 'de'>" + decodeWeatherCodeDE(data.hourly.weather_code[nextHourIndex]) + "</condition>";
        xmlResult += "\n</current>"

        // Zurueckgeben der erstellten XML-Struktur
        return (xmlResult)
    } else {
        console.log('No data available for the upcoming hour.');
    }

}

// die API liefert Wetter-Codes die hier in sprechenden Text (auf englisch) konvertiert werden
function decodeWeatherCodeEN(code) {
    switch (code) {
        case 0:
            return "Clear sky";
        case 1:
            return "mainly clear";
        case 2:
            return "partly cloudy";
        case 3:
            return "overcast";
        case 45:
            return "fog";
        case 48:
            return "depositing rime fog";
        case 51:
            return "light drizzle";
        case 53:
            return "moderate drizzle";
        case 55:
            return "dense drizzle";
        case 56:
            return "light, freezing drizzle";
        case 57:
            return "dense, freezing drizzle";
        case 61:
            return "slight rain";
        case 63:
            return "moderate rain";
        case 65:
            return "heavy rain";
        case 66:
            return "light, freezing rain";
        case 67:
            return "heavy, freezing rain";
        case 71:
            return "slight snow fall";
        case 73:
            return "moderate snow fall";
        case 75:
            return "heavy snow fall";
        case 77:
            return "Snow grains";
        case 80:
            return "slight rain showers";
        case 81:
            return "moderate rain showers";
        case 82:
            return "violent rain showers";
        case 85:
            return "slight snow showers ";
        case 86:
            return "heavy snow showers ";
        case 95:
            return "slight or moderate thunderstorm";
        case 96:
            return "thunderstorm with slight hail";
        case 99:
            return "thunderstorm with heavy hail";
        default:
            return "Unknown weather code";
    }
}

// die API liefert Wetter-Codes die hier in sprechenden Text (auf deutsch) konvertiert werden
function decodeWeatherCodeDE(code) {
    switch (code) {
        case 0:
            return "klarer Himmel";
        case 1:
            return "überwiegend klar";
        case 2:
            return "teilweise bewölkt";
        case 3:
            return "bedeckt";
        case 45:
            return "Nebel";
        case 48:
            return "Raureif Nebel";
        case 51:
            return "leichter Nieselregen";
        case 53:
            return "mäßiger Nieselregen";
        case 55:
            return "dichter Nieselregen";
        case 56:
            return "leichter gefrierender Nieselregen";
        case 57:
            return "dichter gefrierender Nieselregen";
        case 61:
            return "leichter Regen";
        case 63:
            return "mäßiger Regen";
        case 65:
            return "starker Regen";
        case 66:
            return "leichter gefrierender Regen";
        case 67:
            return "starker gefrierender Regen";
        case 71:
            return "leichter Schneefall";
        case 73:
            return "mäßiger Schneefall";
        case 75:
            return "starker Schneefall";
        case 77:
            return "Schneekörner";
        case 80:
            return "leichte Regenschauer";
        case 81:
            return "mäßige Regenschauer";
        case 82:
            return "heftige Regenschauer";
        case 85:
            return "leichte Schneeschauer";
        case 86:
            return "starke Schneeschauer";
        case 95:
            return "leichtes oder mäßiges Gewitter";
        case 96:
            return "Gewitter mit leichtem Hagel";
        case 99:
            return "Gewitter mit starkem Hagel";
        default:
            return "unbekanntes Wetterereignis";
    }
}




