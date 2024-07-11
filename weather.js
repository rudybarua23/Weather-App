document.addEventListener("DOMContentLoaded", () => {
    const weatherDiv = document.getElementById('weather');
    const forecastDiv = document.getElementById('forecast');
    // Apply the hidden class initially
    weatherDiv.classList.add('hidden');
    forecastDiv.classList.add('hidden');
});

function getWeather() {
    const city = document.getElementById('city').value;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=e8956a77ecc042489da200030242405 &q=${encodeURIComponent(city)}&days=7&aqi=no&alerts=no`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); 
            displayWeather(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function ensureAbsoluteUrl(url) {
    if (!url.startsWith('http')) {
        return `https:${url}`;
    }
    return url;
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const forecastDiv = document.getElementById('forecast');
    weatherDiv.classList.add('hidden');
    forecastDiv.classList.add('hidden');
    console.log("Weather data:", data);

    // Clear previous weather data
    weatherDiv.innerHTML = '';
    forecastDiv.innerHTML = '';

    weatherDiv.classList.add('hidden');
    forecastDiv.classList.add('hidden');

    function toFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    if (data && data.location && data.current) {
        const tempC = data.current.temp_c;
        const tempF = toFahrenheit(tempC).toFixed(1);
        const condition = data.current.condition.text;
        const iconUrl = ensureAbsoluteUrl(data.current.condition.icon);

        weatherDiv.innerHTML = `
            <p><img src="${iconUrl}" alt="${condition} icon"> ${condition}</p>
            <br><br>
            <h2>${data.location.name}</h2>
            <p>Temperature: ${tempC} °C / ${tempF} °F</p>
            <p>Humidity: ${data.current.humidity} %</p>
        `;

        weatherDiv.classList.remove('hidden');
        console.log("Weather div shown");
    } else {
        weatherDiv.innerHTML = `
            <p style="color: red;">Weather information is incomplete or unavailable.</p>
        `;
        weatherDiv.classList.remove('hidden');
        console.log("Weather div shown with error");
    }

    if (data && data.forecast && data.forecast.forecastday) {
        const forecastDays = data.forecast.forecastday;

        // Log the number of days in the forecast
        console.log("Total forecast days:", forecastDays.length);
        forecastDays.forEach(day => console.log("Forecast day:", day.date));

        // Remove the first element to avoid duplicating today's weather
        const remainingForecastDays = forecastDays.slice(1);

        // Log the remaining forecast days after removing the first day
        console.log("Remaining forecast days:", remainingForecastDays.length);
        remainingForecastDays.forEach(day => console.log("Remaining forecast day:", day.date));

        remainingForecastDays.forEach(day => {
            // Convert date to day name
            const date = new Date(day.date + 'T00:00:00');
            const options = { weekday: 'long' };
            const dayName = new Intl.DateTimeFormat('en-US', options).format(date);

            const maxTempC = day.day.maxtemp_c;
            const minTempC = day.day.mintemp_c;
            const maxTempF = toFahrenheit(maxTempC).toFixed(1);
            const minTempF = toFahrenheit(minTempC).toFixed(1);
            const condition = day.day.condition.text;
            const iconUrl = ensureAbsoluteUrl(day.day.condition.icon);

            // Display forecast for the day
            forecastDiv.innerHTML += `
                <div>
                    <p><img src="${iconUrl}" alt="${condition} icon"> ${condition}</p>
                    <br><br>
                    <h3>${dayName}</h3>
                    <p>Date: ${day.date}</p>
                    <p>Max Temp: ${maxTempC} °C / ${maxTempF} °F</p>
                    <p>Min Temp: ${minTempC} °C / ${minTempF} °F</p>
                </div>
                <hr>
            `;
        });
        forecastDiv.classList.remove('hidden');
        console.log("Forecast div shown");
    } else {
        forecastDiv.innerHTML = `
            <p style="color: red;">Forecast information is incomplete or unavailable.</p>
        `;
        forecastDiv.classList.remove('hidden');
        console.log("Forecast div shown with error");
    }
}