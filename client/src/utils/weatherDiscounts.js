/**
 * Weather-based discount utilities
 */

// Weather condition mappings to discount percentages
const WEATHER_DISCOUNTS = {
  // Sunny conditions
  'clear sky': 10,
  'few clouds': 10,
  'scattered clouds': 5,

  // Rainy conditions
  'shower rain': 15,
  'rain': 15,
  'thunderstorm': 15,
  'light rain': 15,
  'moderate rain': 15,
  'heavy intensity rain': 15,
  'very heavy rain': 15,
  'extreme rain': 15,
  'freezing rain': 15,
  'light intensity shower rain': 15,
  'shower rain': 15,
  'heavy intensity shower rain': 15,
  'ragged shower rain': 15,

  // Cloudy conditions
  'broken clouds': 5,
  'overcast clouds': 5,
  'mist': 5,
  'haze': 5,
  'fog': 5,
  'smoke': 5,
  'dust': 5,
  'sand': 5,
  'ash': 5,
  'squalls': 5,
  'tornado': 5,
};

/**
 * Get discount percentage based on weather description
 * @param {string} weatherDescription - The weather description from OpenWeather API
 * @returns {number} Discount percentage (0-15)
 */
export const getWeatherDiscount = (weatherDescription) => {
  if (!weatherDescription) return 0;

  const description = weatherDescription.toLowerCase().trim();

  // Check for exact matches first
  if (WEATHER_DISCOUNTS[description] !== undefined) {
    return WEATHER_DISCOUNTS[description];
  }

  // Check for partial matches
  for (const [condition, discount] of Object.entries(WEATHER_DISCOUNTS)) {
    if (description.includes(condition)) {
      return discount;
    }
  }

  return 0; // No discount for unrecognized weather
};

/**
 * Calculate discounted price
 * @param {number} originalPrice - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {number} Discounted price
 */
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  if (discountPercent <= 0 || discountPercent > 100) return originalPrice;
  return originalPrice * (1 - discountPercent / 100);
};

/**
 * Get discount message for display
 * @param {number} discountPercent - Discount percentage
 * @param {string} weatherDescription - Weather description
 * @returns {string} Discount message
 */
export const getDiscountMessage = (discountPercent, weatherDescription) => {
  if (discountPercent === 0) return null;

  const weatherType = weatherDescription.toLowerCase();
  let condition = 'weather';

  if (weatherType.includes('clear') || weatherType.includes('sun')) {
    condition = 'sunny weather';
  } else if (weatherType.includes('rain') || weatherType.includes('shower') || weatherType.includes('thunderstorm')) {
    condition = 'rainy weather';
  } else if (weatherType.includes('cloud')) {
    condition = 'cloudy weather';
  }

  return `${discountPercent}% off for ${condition}!`;
};