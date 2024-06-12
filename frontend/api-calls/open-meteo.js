async function getHistoricalWeather(latitude, longitude, startDate, endDate) {
    const url = `https://archive-api.open-meteo.com/v1/archive`;
    const params = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        start_date: startDate,
        end_date: endDate,
        timezone: 'UTC',
        hourly: 'temperature_2m,precipitation' // Customize this based on the data you need
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error('Failed to fetch historical weather data:', error);
        return { error: 'Unable to fetch historical weather data' };
    }
}

module.exports = {
    getHistoricalWeather
};
