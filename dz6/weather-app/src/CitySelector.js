import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CitySelector.css";

const CitySelector = ({ onCityChange, currentCity }) => {
  const [cityInput, setCityInput] = useState(currentCity);
  const [suggestions, setSuggestions] = useState([]); // Список предложенных городов
  const [showSuggestions, setShowSuggestions] = useState(false); // Показывать/скрывать список
  const API_KEY = "your_api_key_here"; // Замените на ваш API-ключ

  // Функция для получения предложений городов
  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Ошибка при получении предложений городов:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Обработка ввода текста
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    fetchCitySuggestions(value); // Запрашиваем предложения при каждом изменении
  };

  // Обработка выбора города из списка
  const handleSuggestionClick = (city) => {
    const cityName = `${city.name}, ${city.country}`; // Формируем название города с указанием страны
    setCityInput(cityName);
    setShowSuggestions(false);
    onCityChange(cityName); // Передаём выбранный город в App
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onCityChange(cityInput.trim());
      setShowSuggestions(false);
    }
  };

  // Скрытие списка при клике вне компонента
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200); // Задержка, чтобы успеть обработать клик по предложению
  };

  return (
    <form onSubmit={handleSubmit} className="city-selector" onBlur={handleBlur}>
      <div className="city-input-container">
        <input
          type="text"
          value={cityInput}
          onChange={handleInputChange}
          onFocus={() => fetchCitySuggestions(cityInput)} // Показываем предложения при фокусе
          placeholder="Введите город..."
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((city, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(city)}
                className="suggestion-item"
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit">Поиск</button>
    </form>
  );
};

export default CitySelector;