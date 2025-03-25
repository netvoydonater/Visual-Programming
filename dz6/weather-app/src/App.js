import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherCard from "./WeatherCard";
import CitySelector from "./CitySelector";
import "./App.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Novosibirsk"); 
  const [coords, setCoords] = useState({ lat: 55.0415, lon: 82.9346 }); 
  const [error, setError] = useState(null);
  const API_KEY = "7960fb1ffc8c38bcb43d6995dddff223"; 

  // Функция для получения координат города
  const fetchCoordinates = async (cityName) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoords({ lat, lon });
        setCity(cityName);
      } else {
        setError("Город не найден");
      }
    } catch (err) {
      setError("Ошибка при получении координат: " + err.message);
    }
  };

  // Функция для получения прогноза погоды
  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      setError("Ошибка при получении погоды: " + err.message);
    }
  };

  // Загрузка погоды при изменении координат
  useEffect(() => {
    fetchWeather();
  }, [coords]);

  // Обновление погоды каждые 3 часа
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeather();
    }, 3 * 60 * 60 * 1000); // 3 часа в миллисекундах
    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, [coords]);

  // Обработка выбора города
  const handleCityChange = (newCity) => {
    fetchCoordinates(newCity);
  };

  if (error) return <div>{error}</div>;
  if (!weatherData) return <div>Загрузка...</div>;

  // Группировка данных по дням
  const dailyData = {};
  weatherData.list.forEach((entry) => {
    const date = new Date(entry.dt * 1000).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
    });
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(entry);
  });

  // Получение текущей погоды (первый элемент)
  const currentWeather = weatherData.list[0];
  const isDay = new Date().getHours() >= 6 && new Date().getHours() < 18;

  return (
    <div className={`app ${isDay ? "day" : "night"}`}>
      <CitySelector onCityChange={handleCityChange} currentCity={city} />
      <div className="current-weather">
        <h1>
          {city}, {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric" })}
        </h1>
        <div className="weather-icon">
          <img
            src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
        <h2>{Math.round(currentWeather.main.temp)}°</h2>
        <div className="hourly-forecast">
          {weatherData.list.slice(0, 5).map((hour, index) => (
            <div key={index} className="hourly-item">
              <p>{new Date(hour.dt * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
              <p>{Math.round(hour.main.temp)}°</p>
              <img
                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt="hourly weather"
              />
            </div>
          ))}
        </div>
        <div className="weather-details">
          <p>Humidity: {currentWeather.main.humidity}%</p>
          <p>Wind: {currentWeather.wind.speed} m/s</p>
          <p>Air Pressure: {currentWeather.main.pressure} mm</p>
          <p>UV: {currentWeather.main.uv || 0}</p>
        </div>
      </div>
      <div className="daily-forecast">
        {Object.keys(dailyData).slice(1, 6).map((date, index) => (
          <WeatherCard key={index} date={date} data={dailyData[date]} />
        ))}
      </div>
    </div>
  );
};

export default App;