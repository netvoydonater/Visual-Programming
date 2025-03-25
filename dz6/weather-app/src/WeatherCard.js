import React from "react";
import "./WeatherCard.css";

const WeatherCard = ({ date, data }) => {
  const dayData = data[0]; // Берем данные на середину дня (можно усреднить)
  const nightData = data[data.length - 1]; // Берем данные на ночь

  return (
    <div className="weather-card">
      <h3>{date}</h3>
      <div className="weather-info">
        <div className="day">
          <img
            src={`http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`}
            alt="day weather"
          />
          <p>{Math.round(dayData.main.temp)}°</p>
        </div>
        <div className="night">
          <img
            src={`http://openweathermap.org/img/wn/${nightData.weather[0].icon}.png`}
            alt="night weather"
          />
          <p>{Math.round(nightData.main.temp)}°</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;