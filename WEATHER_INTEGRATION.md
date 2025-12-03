# Weather API Integration Guide

## Overview
The WeatherWidget component has been integrated into your application to display real-time weather information using the OpenWeather API.

## Setup Instructions

### 1. Get Your OpenWeather API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 2. Configure Environment Variables

**Server Environment** (`server/.env`):
```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

**Client Environment** (`client/.env`):
```
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
```

Note: Replace `your_actual_api_key_here` with your actual OpenWeather API key.

### 3. Using the WeatherWidget Component

Import and use the component in any of your views:

```jsx
import WeatherWidget from './components/WeatherWidget';

// In your component:
<WeatherWidget city="College Station" />
```

### Example Integration in Manager Dashboard

```jsx
import WeatherWidget from './WeatherWidget';

const ManagerDashboard = () => {
  return (
    <div>
      <h1>Manager Dashboard</h1>

      {/* Add the weather widget */}
      <WeatherWidget city="College Station" />

      {/* Rest of your dashboard content */}
    </div>
  );
};
```

### Example Integration in Cashier View

```jsx
import WeatherWidget from './WeatherWidget';

const CashierView = () => {
  return (
    <div>
      {/* Your cashier view content */}

      {/* Add weather widget in a sidebar or corner */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <WeatherWidget city="Houston" />
      </div>
    </div>
  );
};
```

## Features

### 1. Search by City
- Users can search for weather in any city
- Default city is "College Station"
- Simply type a city name and click "Search"

### 2. Geolocation
- Click the 📍 button to get weather for your current location
- Requires browser location permission

### 3. Weather Information Displayed
- Current temperature (°F)
- Feels like temperature
- Weather description
- Humidity percentage
- Wind speed (mph)
- Weather icon

## API Endpoints

### GET `/api/weather`

**Query Parameters:**
- `city` (string): City name (e.g., "College Station")
- `lat` (number): Latitude coordinate
- `lon` (number): Longitude coordinate

**Note:** Provide either `city` OR both `lat` and `lon`.

**Example Requests:**
```
GET /api/weather?city=College%20Station
GET /api/weather?lat=30.6280&lon=-96.3344
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "temperature": 72,
    "feelsLike": 70,
    "humidity": 65,
    "description": "clear sky",
    "icon": "01d",
    "city": "College Station",
    "country": "US",
    "windSpeed": 8
  }
}
```

## Customization

### Changing Default City
```jsx
<WeatherWidget city="Austin" />
```

### Styling
The widget includes built-in styles, but you can customize by:
1. Wrapping it in a container with custom styles
2. Modifying the component's inline styles
3. Using CSS classes to override specific elements

## Troubleshooting

### Weather not loading?
1. Check that your API key is correctly set in both `.env` files
2. Restart both server and client after updating `.env` files
3. Check browser console for error messages
4. Verify your OpenWeather API key is active (new keys can take a few minutes)

### CORS errors?
Make sure your server's CORS configuration allows requests from your client URL.

### Rate Limits
Free OpenWeather API tier allows:
- 60 calls/minute
- 1,000,000 calls/month

For production, consider caching weather data to avoid rate limits.

## Translation Fix

The Google Translate functionality has also been fixed by updating the script URL from HTTP to HTTPS in `client/index.html`:

**Before:**
```html
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

**After:**
```html
<script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

This fixes the issue where modern browsers were blocking the insecure HTTP script.
