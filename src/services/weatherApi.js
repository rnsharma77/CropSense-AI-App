/* ============================================================
   CropSense AI — Weather Service (OpenWeatherMap)
   Free API key: https://openweathermap.org/api
   Set: REACT_APP_OPENWEATHER_KEY in .env
   ============================================================ */

const OW_KEY = process.env.REACT_APP_OPENWEATHER_KEY || '';

// Farming-specific advisory text based on conditions
const getFarmingAdvisory = (data) => {
  const wind  = data?.wind?.speed ?? 0;
  const humid = data?.main?.humidity ?? 0;
  const rain  = data?.rain?.['1h'] || data?.rain?.['3h'] || 0;
  const temp  = data?.main?.temp ?? 25;
  const desc  = (data?.weather?.[0]?.description || '').toLowerCase();

  if (rain > 5)  return { text: 'Heavy rain expected. Avoid spraying today. Check drainage channels and ensure fields are not waterlogged.', icon: '🌧️', alert: '⚠️ Rain — no spraying' };
  if (rain > 0)  return { text: 'Light rain today. Defer pesticide application. Good natural irrigation for crops.', icon: '🌦️', alert: '🌧️ Mild rain today' };
  if (wind < 5 && humid > 50 && !desc.includes('cloud')) return { text: 'Excellent conditions for spraying. Low wind speed and good humidity ensure optimal foliar absorption.', icon: '✅', alert: '✅ Ideal spray conditions' };
  if (temp < 10) return { text: 'Cold temperatures. Watch for frost damage on tender crops. Apply potassium-based foliar spray to build frost resistance.', icon: '🥶', alert: '❄️ Frost risk tonight' };
  if (humid > 80) return { text: 'High humidity alert. Fungal disease risk is elevated. Inspect crops closely and apply preventive fungicide if needed.', icon: '🍄', alert: '⚠️ High fungal risk' };
  return { text: 'Moderate conditions today. Good day for field inspections, light irrigation, and routine crop monitoring.', icon: '🌤️', alert: '🌤️ Good for field work' };
};

const getWeatherIcon = (code, isNight) => {
  if (!code) return '🌤️';
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌦️';
  if (code >= 500 && code < 600) return code >= 502 ? '🌧️' : '🌦️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return isNight ? '🌙' : '☀️';
  if (code === 801) return '🌤️';
  if (code <= 804) return '☁️';
  return '⛅';
};

export const fetchWeather = async (city = 'Delhi,IN') => {
  if (!OW_KEY) {
    return getMockWeather(city);
  }

  try {
    // Fetch coordinates from Geo API
    const geoResp = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OW_KEY}`);
    const geoData = await geoResp.json();
    if (!geoData.length) return getMockWeather(city);

    const [geo] = geoData;
    const [lat, lon] = [geo.lat, geo.lon];

    // Fetch current weather
    const wResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=metric`);
    const data = await wResp.json();

    // Fetch forecast
    const fResp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=metric`);
    const fData = await fResp.json();

    const isNight = data.dt < data.sys.sunrise || data.dt > data.sys.sunset;
    const advisory = getFarmingAdvisory(data);

    return {
      isReal: true,
      city: geo.name,
      country: geo.country,
      temp:       Math.round(data.main.temp),
      feelsLike:  Math.round(data.main.feels_like),
      humidity:   data.main.humidity,
      windSpeed:  Math.round(data.wind.speed * 3.6), // m/s → km/h
      uvIndex:    null, // needs separate UV endpoint
      condition:  data.weather[0].main,
      description:data.weather[0].description,
      icon:       getWeatherIcon(data.weather[0].id, isNight),
      rain:       data.rain?.['1h'] || 0,
      pressure:   data.main.pressure,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
      sunrise:    new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      sunset:     new Date(data.sys.sunset  * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      advisory,
      forecast: fData.list ? fData.list.slice(0, 5).map(f => ({
        time:  new Date(f.dt * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        temp:  Math.round(f.main.temp),
        icon:  getWeatherIcon(f.weather[0].id),
        rain:  f.pop ? Math.round(f.pop * 100) : 0,
      })) : [],
    };
  } catch (err) {
    console.warn('Weather API error, using mock:', err.message);
    return getMockWeather(city);
  }
};

const getMockWeather = (city) => {
  const cities = {
    'Delhi,IN':     { temp:32, humid:58, wind:16, icon:'⛅', cond:'Partly Cloudy',  feelsLike:35 },
    'Mumbai,IN':    { temp:30, humid:82, wind:22, icon:'🌦️', cond:'Humid',          feelsLike:36 },
    'Chennai,IN':   { temp:34, humid:75, wind:18, icon:'☀️', cond:'Sunny',          feelsLike:40 },
    'Kolkata,IN':   { temp:28, humid:88, wind:12, icon:'🌧️', cond:'Rainy',          feelsLike:32 },
    'Bangalore,IN': { temp:24, humid:65, wind:14, icon:'🌤️', cond:'Pleasant',       feelsLike:25 },
    'Hyderabad,IN': { temp:30, humid:55, wind:20, icon:'🌤️', cond:'Mostly Clear',   feelsLike:33 },
    'Pune,IN':      { temp:27, humid:60, wind:15, icon:'⛅', cond:'Partly Cloudy',  feelsLike:29 },
  };
  const c = cities[city] || cities['Delhi,IN'];
  const advisory = getFarmingAdvisory({ wind:{speed:c.wind/3.6}, main:{humidity:c.humid, temp:c.temp}, weather:[{description:c.cond}] });

  return {
    isReal: false,
    city: city.split(',')[0],
    country: 'IN',
    temp: c.temp, feelsLike: c.feelsLike,
    humidity: c.humid, windSpeed: c.wind,
    uvIndex: 6, condition: c.cond,
    description: c.cond, icon: c.icon,
    rain: 0, pressure: 1012,
    visibility: 10,
    sunrise: '6:05 AM', sunset: '6:42 PM',
    advisory,
    forecast: [
      { time:'12 PM', temp: c.temp + 1, icon: c.icon, rain: 5  },
      { time:'3 PM',  temp: c.temp + 3, icon: '⛅',   rain: 10 },
      { time:'6 PM',  temp: c.temp,     icon: '🌤️',  rain: 5  },
      { time:'9 PM',  temp: c.temp - 3, icon: '🌙',   rain: 0  },
      { time:'12 AM', temp: c.temp - 5, icon: '🌙',   rain: 0  },
    ],
  };
};

export const INDIAN_CITIES = [
  { label: 'Delhi',     value: 'Delhi,IN'     },
  { label: 'Mumbai',    value: 'Mumbai,IN'    },
  { label: 'Chennai',   value: 'Chennai,IN'   },
  { label: 'Kolkata',   value: 'Kolkata,IN'   },
  { label: 'Bangalore', value: 'Bangalore,IN' },
  { label: 'Hyderabad', value: 'Hyderabad,IN' },
  { label: 'Pune',      value: 'Pune,IN'      },
  { label: 'Jaipur',    value: 'Jaipur,IN'    },
  { label: 'Lucknow',   value: 'Lucknow,IN'   },
  { label: 'Nagpur',    value: 'Nagpur,IN'    },
  { label: 'Patna',     value: 'Patna,IN'     },
  { label: 'Bhopal',    value: 'Bhopal,IN'    },
];