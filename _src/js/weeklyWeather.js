import {
  fetchWeatherData,
  createWeeklyWeatherCard,
} from "./hooks/weatherUtils";

const fetchWeeklyWeather = async () => {
  const weatherData = await fetchWeatherData(7, 0);

  // 今日と明日を除いた5日分のデータを取得（3日目〜7日目）
  const weeklyWeatherData = [];

  // 最初の2日（今日と明日）はスキップし、残りの5日分を取得
  for (let i = 2; i < 7; i++) {
    const prevDayIndex = i - 1;

    weeklyWeatherData.push({
      date: weatherData.daily.time[i],
      weatherCode: weatherData.daily.weathercode[i],
      maxTemp: weatherData.daily.temperature_2m_max[i],
      minTemp: weatherData.daily.temperature_2m_min[i],
      precipProbability: weatherData.daily.precipitation_probability_max[i],
      // 前日との気温差
      maxTempDiff: Math.round(
        weatherData.daily.temperature_2m_max[i] -
          weatherData.daily.temperature_2m_max[prevDayIndex]
      ),
      minTempDiff: Math.round(
        weatherData.daily.temperature_2m_min[i] -
          weatherData.daily.temperature_2m_min[prevDayIndex]
      ),
    });
  }

  const weeklyContainer = document.getElementById(
    "js-weekly-weather-container"
  );
  if (!weeklyContainer) return;

  const template = document.getElementById("js-weekly-weather-template");
  if (!template) return;

  weeklyContainer.innerHTML = "";

  weeklyWeatherData.forEach((weatherData) => {
    const card = createWeeklyWeatherCard(weatherData, template);
    weeklyContainer.appendChild(card);
  });
};

export const weeklyWeather = () => {
  fetchWeeklyWeather();
};
