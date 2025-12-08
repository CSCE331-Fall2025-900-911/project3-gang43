import { useState, useEffect } from 'react';
import { getWeatherDiscount, getDiscountMessage } from '../utils/weatherDiscounts';

/**
 * Custom hook for weather-based discounts
 * @param {string} city - Default city for weather lookup
 * @returns {Object} Weather discount data and functions
 */
export const useWeatherDiscount = (city = 'College Station') => {
  const [weather, setWeather] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountMessage, setDiscountMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherDiscount = async (cityName = city) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
      const response = await fetch(`${apiUrl}/api/weather?city=${encodeURIComponent(cityName)}`);
      const data = await response.json();

      if (data.success) {
        const weatherData = data.data;
        setWeather(weatherData);

        const discount = getWeatherDiscount(weatherData.description);
        setDiscountPercent(discount);

        const message = getDiscountMessage(discount, weatherData.description);
        setDiscountMessage(message);
      } else {
        setError(data.message || 'Failed to fetch weather data');
        setDiscountPercent(0);
        setDiscountMessage(null);
      }
    } catch (err) {
      setError('Unable to fetch weather data');
      console.error('Weather discount fetch error:', err);
      setDiscountPercent(0);
      setDiscountMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
            const response = await fetch(
              `${apiUrl}/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();

            if (data.success) {
              const weatherData = data.data;
              setWeather(weatherData);

              const discount = getWeatherDiscount(weatherData.description);
              setDiscountPercent(discount);

              const message = getDiscountMessage(discount, weatherData.description);
              setDiscountMessage(message);
            } else {
              setError(data.message || 'Failed to fetch weather data');
              setDiscountPercent(0);
              setDiscountMessage(null);
            }
          } catch (err) {
            setError('Unable to fetch weather data');
            console.error('Weather fetch error:', err);
            setDiscountPercent(0);
            setDiscountMessage(null);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to access your location. Using default city.');
          fetchWeatherDiscount(city);
        }
      );
    } else {
      fetchWeatherDiscount(city);
    }
  };

  useEffect(() => {
    fetchWeatherDiscount(city);
  }, [city]);

  return {
    weather,
    discountPercent,
    discountMessage,
    loading,
    error,
    refetchWeather: fetchWeatherDiscount,
    fetchWeatherByLocation,
  };
};