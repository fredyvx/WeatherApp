import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("London");
  const [coordinates, setCoordinates] = useState(null);
  const [weather, setWeather] = useState(null)

  const fetchCoordinates = async () => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { latitude, longitude } = data.results[0];
        setCoordinates({ latitude, longitude });
      }
    } catch (error) {
      console.error("Fehler aufgetreten", error);
      return null;
    }
  };

  const fetchWeather = async () => {
    if (!coordinates) return;

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
      );
      const data = await response.json();
      console.log(data)

       const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      }

      const weatherData = {
        name: city,
        main: {
          temp: data.current.temperature_2m,
          feels_like: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m
        },
        wind: {
          speed: data.current.wind_speed_10m
        },
        weather: [{
          description: weatherCodes[data.current.weather_code] || 'Unknown',
          icon: data.current.weather_code.toString()
        }]
      }
      
      setWeather(weatherData)

    } catch (error) {
      console.error("Fehler", error);
    }
  };

  useEffect(() => {
    if (city) {
      fetchCoordinates(city);
    }
  }, [city]);

  useEffect(() => {
    if (coordinates) {
      fetchWeather();
    }
  }, [coordinates]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCity = formData.get("city");
    if (newCity.trim()) {
      setCity(newCity);
    }
  };
  return (
    <div className="app">
      <div className="container">
        <h1>Weather App</h1>
        <form onSubmit={handleSubmit}>
          <input placeholder="Enter city" name="city"/>
          <button>Search</button>
        </form>
        <div className="weather-card">
          {weather ? (
            <> <h2>{weather.name}</h2>
          <h1>{weather.main.temp}°C</h1>
          <p>{weather.weather[0].description}</p>
          <div>
            <span>Feels like {weather.main.feels_like}°C </span>
            <span>Humidity {weather.main.humidity}% </span>
            <span>Wind {weather.wind.speed} km/h</span>
          </div></>
          ) : <p>Loading weather...</p>
        }
         
        </div>
      </div>
    </div>
  );
}

export default App;
