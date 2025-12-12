import React, { useState, useEffect } from 'react';

const WeatherWidget = ({ city = 'College Station', showCitySearch = true }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customCity, setCustomCity] = useState('');
  const [currentCity, setCurrentCity] = useState(city);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
      const response = await fetch(`${apiUrl}/api/weather?city=${encodeURIComponent(cityName)}`);
      const data = await response.json();

      if (data.success) {
        setWeather(data.data);
        setCurrentCity(cityName);
      } else {
        setError(data.message || 'Failed to fetch weather data');
      }
    } catch (err) {
      setError('Unable to fetch weather data. Please check your connection.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLoading(true);
          setError(null);

          try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
            const response = await fetch(
              `${apiUrl}/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();

            if (data.success) {
              setWeather(data.data);
              setCurrentCity(data.data.city);
            } else {
              setError(data.message || 'Failed to fetch weather data');
            }
          } catch (err) {
            setError('Unable to fetch weather data. Please check your connection.');
            console.error('Weather fetch error:', err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to access your location. Using default city.');
          fetchWeather(city);
        }
      );
    } else {
      fetchWeather(city);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (customCity.trim()) {
      fetchWeather(customCity.trim());
      setCustomCity('');
    }
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="spinner"></div>
        <p>Loading weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <p className="error-message">{error}</p>
        <button onClick={() => fetchWeather(city)} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3>Weather</h3>
        <button
          onClick={fetchWeatherByLocation}
          className="location-btn"
          title="Use my location"
        >
          📍
        </button>
      </div>

      {weather && (
        <div className="weather-content">
          <div className="weather-main">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="weather-icon"
            />
            <div className="temperature">
              <span className="temp-value">{weather.temperature}°F</span>
              <span className="feels-like">Feels like {weather.feelsLike}°F</span>
            </div>
          </div>

          <div className="weather-details">
            <p className="location">{weather.city}, {weather.country}</p>
            <p className="description">{weather.description}</p>
            <div className="weather-stats">
              <span>💧 {weather.humidity}%</span>
              <span>💨 {weather.windSpeed} mph</span>
            </div>
          </div>
        </div>
      )}

      {showCitySearch && (
        <form onSubmit={handleCitySubmit} className="city-search">
          <input
            type="text"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            placeholder="Enter city name"
            className="city-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      )}

      <style>{`
        .weather-widget {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 20px;
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 350px;
          margin: 20px auto;
        }

        .weather-widget.loading,
        .weather-widget.error {
          text-align: center;
          padding: 40px 20px;
        }

        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .weather-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .weather-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .location-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.3s;
        }

        .location-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .weather-main {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .weather-icon {
          width: 100px;
          height: 100px;
          margin-right: 10px;
        }

        .temperature {
          display: flex;
          flex-direction: column;
        }

        .temp-value {
          font-size: 48px;
          font-weight: bold;
          line-height: 1;
        }

        .feels-like {
          font-size: 14px;
          opacity: 0.8;
          margin-top: 5px;
        }

        .weather-details {
          text-align: center;
          margin-bottom: 15px;
        }

        .location {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 5px;
        }

        .description {
          font-size: 16px;
          text-transform: capitalize;
          margin: 0 0 10px;
          opacity: 0.9;
        }

        .weather-stats {
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 14px;
        }

        .city-search {
          display: flex;
          gap: 8px;
          margin-top: 15px;
        }

        .city-input {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
        }

        .city-input::placeholder {
          color: #999;
        }

        .city-input:focus {
          outline: none;
          background: white;
        }

        .search-btn,
        .retry-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .search-btn:hover,
        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .error-message {
          color: #ffe0e0;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
