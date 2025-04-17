import { getWeatherInfo } from "./getWeatherInfo";

/**
 * 東京の天気情報を取得
 * @param {number} forecastDays 予報日数
 * @param {number} pastDays 過去の日数
 * @returns {Promise<Object>} 天気データ
 */
export const fetchWeatherData = async (forecastDays = 3, pastDays = 1) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=${forecastDays}&past_days=${pastDays}`
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("天気データの取得中エラー", error);

    throw error;
  }
};

/**
 * 日付をフォーマット
 * @param {string} dateString 日付文字列（YYYY-MM-DD形式）
 * @returns {Object} フォーマットされた日付情報
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];

  return {
    month,
    day,
    weekday,
    formatted: `${month}月${day}日(${weekday})`,
  };
};

/**
 * 気温差に関する表示情報を生成
 * @param {number} tempDiff 気温差
 * @returns {Object} 気温差の表示情報
 */
export const formatTempDiff = (tempDiff) => {
  const sign = tempDiff > 0 ? "+" : "";
  const label = tempDiff < 0 ? "マイナス" : tempDiff > 0 ? "プラス" : "";

  return {
    text: `${sign}${tempDiff}`,
    ariaLabel: `前日比${label}${Math.abs(tempDiff)}度`,
  };
};

/**
 * 天気カードを更新
 * @param {Object} weatherData 天気データ
 * @param {Element} cardElement カード要素
 */
export const updateWeatherCard = (weatherData, cardElement) => {
  const {
    weatherCode,
    maxTemp,
    minTemp,
    precipProbability,
    maxTempDiff,
    minTempDiff,
  } = weatherData.data;

  const { label: weatherLabel, icon: weatherIcon } =
    getWeatherInfo(weatherCode);

  // 天気テキスト
  const weatherTelopElement = cardElement.querySelector(".js-weather-telop");
  if (!weatherTelopElement) return;

  weatherTelopElement.textContent = weatherLabel;

  // 天気アイコン
  const weatherIconElement = cardElement.querySelector(".js-weather-icon img");
  if (!weatherIconElement) return;

  weatherIconElement.src = weatherIcon;
  weatherIconElement.width = "50";
  weatherIconElement.height = "34";

  // 最高気温
  const highTempValueElements = cardElement.querySelectorAll(
    ".js-weather-temp-high-value"
  );
  highTempValueElements.forEach((element) => {
    element.textContent = maxTemp.toFixed(1);
  });

  // 最高気温の前日比
  const { text: highDiffText, ariaLabel: highDiffLabel } =
    formatTempDiff(maxTempDiff);
  const highTempDiffElements = cardElement.querySelectorAll(
    ".js-weather-temp-high-diff"
  );
  highTempDiffElements.forEach((element) => {
    element.textContent = highDiffText;
  });

  // 最高気温のaria-label設定
  const highTempDiffWrapper = cardElement.querySelector(
    ".js-weather-temp-high-diff-label"
  );
  if (!highTempDiffWrapper) return;

  highTempDiffWrapper.setAttribute("aria-label", highDiffLabel);

  // 最低気温
  const lowTempValueElements = cardElement.querySelectorAll(
    ".js-weather-temp-low-value"
  );
  lowTempValueElements.forEach((element) => {
    element.textContent = minTemp.toFixed(1);
  });

  // 最低気温の前日比
  const { text: lowDiffText, ariaLabel: lowDiffLabel } =
    formatTempDiff(minTempDiff);
  const lowTempDiffElements = cardElement.querySelectorAll(
    ".js-weather-temp-low-diff"
  );
  lowTempDiffElements.forEach((element) => {
    element.textContent = lowDiffText;
  });

  // 最低気温のaria-label設定
  const lowTempDiffWrapper = cardElement.querySelector(
    ".js-weather-temp-low-diff-label"
  );
  if (!lowTempDiffWrapper) return;

  lowTempDiffWrapper.setAttribute("aria-label", lowDiffLabel);

  // 降水確率
  if (precipProbability !== undefined) {
    const timePeriods = [0, 6, 12, 18];

    timePeriods.forEach((hour) => {
      const precipElement = cardElement.querySelector(
        `.js-weather-precipitation-${hour}`
      );
      if (precipElement) {
        precipElement.textContent = `${precipProbability}%`;
        precipElement.setAttribute(
          "aria-label",
          `降水確率 ${precipProbability}パーセント`
        );
      }
    });
  }
};

/**
 * 週間天気カードを生成
 * @param {Object} weatherData 天気データ
 * @param {HTMLTemplateElement} template テンプレート要素
 * @returns {DocumentFragment} 生成されたカード要素
 */
export const createWeeklyWeatherCard = (weatherData, template) => {
  const newCard = document.importNode(template.content, true);
  const { formatted: formattedDate } = formatDate(weatherData.date);

  // 日付
  const titleElement = newCard.querySelector(".js-weather-title");
  if (!titleElement) return;
  titleElement.textContent = formattedDate;

  // 天気情報
  const { label: weatherLabel, icon: weatherIcon } = getWeatherInfo(
    weatherData.weatherCode
  );

  // 天気テキスト
  const weatherElement = newCard.querySelector(".js-weather-telop");
  if (!weatherElement) return;
  weatherElement.textContent = weatherLabel;

  // 天気アイコン
  const iconElement = newCard.querySelector(".js-weather-icon img");
  if (!iconElement) return;
  iconElement.src = weatherIcon;

  // 最高気温
  const highTempElement = newCard.querySelector(".js-weather-temp-high-value");
  if (!highTempElement) return;
  highTempElement.textContent = weatherData.maxTemp.toFixed(1);

  // 最高気温の前日比
  const { text: highDiffText, ariaLabel: highDiffLabel } = formatTempDiff(
    weatherData.maxTempDiff
  );
  const highTempDiffElement = newCard.querySelector(
    ".js-weather-temp-high-diff"
  );
  if (!highTempDiffElement) return;
  highTempDiffElement.textContent = highDiffText;

  // 最高気温のaria-label設定
  const highTempDiffWrapper = newCard.querySelector(
    ".js-weather-temp-high-diff-label"
  );
  if (!highTempDiffWrapper) return;
  highTempDiffWrapper.setAttribute("aria-label", highDiffLabel);

  // 最低気温
  const lowTempElement = newCard.querySelector(".js-weather-temp-low-value");
  if (!lowTempElement) return;
  lowTempElement.textContent = weatherData.minTemp.toFixed(1);

  // 最低気温の前日比
  const { text: lowDiffText, ariaLabel: lowDiffLabel } = formatTempDiff(
    weatherData.minTempDiff
  );
  const lowTempDiffElement = newCard.querySelector(".js-weather-temp-low-diff");
  if (!lowTempDiffElement) return;
  lowTempDiffElement.textContent = lowDiffText;

  // 最低気温のaria-label設定
  const lowTempDiffWrapper = newCard.querySelector(
    ".js-weather-temp-low-diff-label"
  );
  if (!lowTempDiffWrapper) return;
  lowTempDiffWrapper.setAttribute("aria-label", lowDiffLabel);

  return newCard;
};
