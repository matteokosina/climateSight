

async function getAirQuality(latitude, longitude) {
    const apiKey = ""; // Replace with your IQAir API key
    const url = `https://api.airvisual.com/v2/nearest_city`;
    const params = new URLSearchParams({
        lat: latitude,
        lon: longitude,
        key: apiKey
    });

    try {
        const response = await fetch(`${url}?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const airQualityData = await response.json();
        return airQualityData;
    } catch (error) {
        console.error('Failed to fetch air quality data:', error);
        return { error: 'Unable to fetch air quality data' };
    }
}

module.exports = {
    getAirQuality
};
