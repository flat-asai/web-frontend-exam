import { fetchWeatherData, updateWeatherCard } from "./hooks/weatherUtils";

const fetchTodayAndTomorrowWeather = async () => {
  const weatherData = await fetchWeatherData(3, 1);

  const yesterdayIndex = 0;
  const todayIndex = 1;
  const tomorrowIndex = 2;

  const weatherInfo = [
    {
      label: "今日の天気",
      data: {
        date: weatherData.daily.time[todayIndex],
        weatherCode: weatherData.daily.weathercode[todayIndex],
        maxTemp: weatherData.daily.temperature_2m_max[todayIndex],
        minTemp: weatherData.daily.temperature_2m_min[todayIndex],
        precipProbability:
          weatherData.daily.precipitation_probability_max[todayIndex],

        // 前日との気温差
        maxTempDiff: Math.round(
          weatherData.daily.temperature_2m_max[todayIndex] -
            weatherData.daily.temperature_2m_max[yesterdayIndex]
        ),
        minTempDiff: Math.round(
          weatherData.daily.temperature_2m_min[todayIndex] -
            weatherData.daily.temperature_2m_min[yesterdayIndex]
        ),
      },
      selector: '[data-period="today"]',
    },
    {
      label: "明日の天気",
      data: {
        date: weatherData.daily.time[tomorrowIndex],
        weatherCode: weatherData.daily.weathercode[tomorrowIndex],
        maxTemp: weatherData.daily.temperature_2m_max[tomorrowIndex],
        minTemp: weatherData.daily.temperature_2m_min[tomorrowIndex],
        precipProbability:
          weatherData.daily.precipitation_probability_max[tomorrowIndex],
        // 前日（今日）との気温差
        maxTempDiff: Math.round(
          weatherData.daily.temperature_2m_max[tomorrowIndex] -
            weatherData.daily.temperature_2m_max[todayIndex]
        ),
        minTempDiff: Math.round(
          weatherData.daily.temperature_2m_min[tomorrowIndex] -
            weatherData.daily.temperature_2m_min[todayIndex]
        ),
      },
      selector: '[data-period="tomorrow"]',
    },
  ];

  const todayWeatherCard = document.querySelector(
    ".js-weather-card[data-period='today']"
  );

  if (!todayWeatherCard) return;

  const tomorrowWeatherCard = document.querySelector(
    ".js-weather-card[data-period='tomorrow']"
  );

  if (!tomorrowWeatherCard) return;

  const todayWeather = weatherInfo[0];
  const tomorrowWeather = weatherInfo[1];

  updateWeatherCard(todayWeather, todayWeatherCard);
  updateWeatherCard(tomorrowWeather, tomorrowWeatherCard);
};

export const todayAndTomorrowWeather = () => {
  fetchTodayAndTomorrowWeather();
};
