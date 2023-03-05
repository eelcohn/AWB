/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

import { DATE_OPTIONS_LOCAL, UNIT_KNOTS, UNIT_CELCIUS, UNIT_FEET, UNIT_HECTOPASCAL, UNIT_KILOMETERS, UNIT_METERS_PER_SECOND } from '../const.js';
import { setTrend, setCompass, windDegreesToDirection } from '../functions.js';

const ID_LAST_UPDATED = 'metrics-last-updated';
const ID_SUNRISE = 'sunrise-data';
const ID_SUNSET = 'sunset-data';
const ID_LOCATION = 'location-data';
const ID_ICON = 'metrics-icon';
const ID_TEMPERATURE = 'temperature-data';
const ID_TEMPERATURE_FEEL = 'temperature-feel-data';
const ID_WEATHER_WIND = 'wind-data';
const ID_WEATHER_WIND_MS = 'wind-ms-data';
const ID_TEMPERATURE_TREND = 'temperature-trend';
const ID_WIND_SPEED_TREND = 'wind-trend';
const ID_PRESSURE_TREND = 'pressure-trend';
const ID_VISIBILITY_TREND = 'visibility-trend';
const ID_WEATHER_VISIBILITY = 'visibility-data';
const ID_WEATHER_PRESSURE = 'pressure-data';
const ID_WEATHER_TEXT_SHORT = 'metrics-data';
const ID_WEATHER_FORECAST_SHORT = 'metrics-forecast-data';
const ID_COMPASS_ARROW = 'compass-arrow-id';

class Module {
	constructor() {
		this.api_url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + document.config.location.lattitude + '&lon=' + document.config.location.longitude + '&units=metric&lang=' + document.config.locale.slice(0, 2) + '&appid=' + document.config.openweathermap.appid;
		this.refreshInterval = 10 * 60 * 1000; // Refresh interval is 10 minutes

		this.valid_from = null
		this.last_updated = null;
		this.location = null;
		this.icon = null;
		this.sunrise = null;
		this.sunset = null;
		this.temperature = null;
		this.temperature_feel = null;
		this.wind_direction = null;
		this.wind_direction_degrees = null;
		this.wind_speed_ms = null;
		this.wind_speed_kt = null;
		this.wind_speed_kmh = null;
		this.wind_speed_bft = null;
		this.visibility = null;
		this.humidity = null;
		this.weather_text = null;
		this.forecast = null;

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		/* Fetch data from the API */
		fetch(
			this.api_url,
			{
				mode: 'cors',
				keepalive: true,
				headers: {
				},
			}
		).then(response => {
			if (response.status == 200) {
				return response.json();	// converting byte data to json
			} else {
				console.warn('Returned HTTP error ' + response.status + ' (' + response.statusText + ')');
				return null;
			}
		}).then(data => {
			if (data != null) {
//				console.log(data);
				if (data !== null) {
					this.last_updated = new Date();

					/* Valid from */
					if (data['dt']) {
						this.sunrise = new Date(data['dt'] * 1000);
					}
					/* Location */
					if (data['name']) {
						this.location = data['name'];
					}
					/* Icon */
					if (data['weather'][0]['icon']) {
						this.icon = data['weather'][0]['icon'];
					}
					/* Sunrise time */
					if (data['sys']['sunrise']) {
						this.sunrise = new Date(data['sys']['sunrise'] * 1000);
					}
					/* Sunset time */
					if (data['sys']['sunset']) {
						this.sunset = new Date(data['sys']['sunset'] * 1000);
					}
					/* Temperature */
					if (data['main']['temp']) {
						var temperature_previous = this.temperature;
						this.temperature = data['main']['temp'];
					}
					/* Temperature feeling */
					if (data['main']['feels_like']) {
						this.temperature_feel = data['main']['feels_like'];
					}
					/* Humidity */
					if (data['main']['humidity']) {
						this.humidity = data['main']['humidity'];
					}
					/* Wind direction in degrees */
					if (data['wind']['deg']) {
						this.wind_direction_degrees = data['wind']['deg'];
						this.wind_direction = windDegreesToDirection(this.wind_direction_degrees);
					}
					/* Wind speed */
					if (data['wind']['speed']) {
						var wind_speed_previous = this.wind_speed;
						this.wind_speed = Math.round(data['wind']['speed']);
					}
					/* Visibility */
					if (data['visibility']) {
						var visibility_previous = this.visibility;
						this.visibility = data['visibility'] / 1000;
					}
					/* Air pressure */
					if (data['main']['pressure']) {
						var pressure_previous = this.pressure;
						this.pressure = data['main']['pressure'];
					}
					/* Weather short */
					if (data['weather'][0]['main']) {
						this.weather = data['weather'][0]['main'];
					}
					/* Forecast */
					if (data['weather'][0]['description']) {
						this.forecast = data['weather'][0]['description'];
					}
				}

				document.getElementById(ID_LAST_UPDATED).innerHTML = this.last_updated.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
				document.getElementById(ID_SUNRISE).innerHTML = this.sunrise.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
				document.getElementById(ID_SUNSET).innerHTML = this.sunset.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
				document.getElementById(ID_LOCATION).innerHTML = this.location;
				document.getElementById(ID_ICON).src = 'https://openweathermap.org/img/wn/' + this.icon + '@2x.png';;
				document.getElementById(ID_TEMPERATURE).innerHTML = Number(this.temperature).toFixed(1) + '&nbsp;' + UNIT_CELCIUS;
				document.getElementById(ID_TEMPERATURE_FEEL).innerHTML = Number(this.temperature_feel).toFixed(1) + '&nbsp;' + UNIT_CELCIUS;
				document.getElementById(ID_WEATHER_WIND).innerHTML = this.wind_direction;
				document.getElementById(ID_WEATHER_WIND_MS).innerHTML = this.wind_speed + '&nbsp;' + UNIT_METERS_PER_SECOND;
				document.getElementById(ID_WEATHER_VISIBILITY).innerHTML = this.visibility + '&nbsp;' + UNIT_KILOMETERS;
				document.getElementById(ID_WEATHER_PRESSURE).innerHTML = Number(this.pressure).toFixed(1) + '&nbsp;' + UNIT_HECTOPASCAL;
				document.getElementById(ID_WEATHER_TEXT_SHORT).innerHTML = this.weather;
				document.getElementById(ID_WEATHER_FORECAST_SHORT).innerHTML = this.forecast;
				setCompass(ID_COMPASS_ARROW, this.wind_direction_degrees);
				setTrend(ID_TEMPERATURE_TREND, this.temperature, temperature_previous);
				setTrend(ID_WIND_SPEED_TREND, this.wind_speed, wind_speed_previous);
				setTrend(ID_PRESSURE_TREND, this.pressure, pressure_previous);
				setTrend(ID_VISIBILITY_TREND, this.visibility, visibility_previous);
			}
		}).catch((error) => {
			console.error(error);
		});
	}
}

export { Module };

