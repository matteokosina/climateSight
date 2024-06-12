

async function getCurrentTemperature(latitude, longitude) {
    const apiKey = ""; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const params = new URLSearchParams({
        lat: latitude,
        lon: longitude,
        appid: apiKey,
        units: 'metric' // Metric units to get temperature in Celsius
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
        }
        const weatherData = await response.json();
        const temperature = weatherData.main.temp; // Get the current temperature
        return temperature;
    } catch (error) {
        console.error('Failed to fetch current temperature:', error);
        throw error; // Rethrow the error for handling in the caller function
    }
}

module.exports = {
    getCurrentTemperature
};
