/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

import { DATE_OPTIONS_LOCAL, UNIT_CELCIUS, UNIT_METERS_PER_SECOND, UNIT_KNOTS, UNIT_KILOMETERS, UNIT_HECTOPASCAL } from "../const.js";
import { createSystemMessage, setTrend, setCompass } from '../functions.js';
import { LANGUAGE_SOURCE, LANGUAGE_LAST_UPDATED } from '../language.js';

const ICON_URL = 'https://weerlive.nl/items/img/weericonen/grote_iconen_'
const ID_METRICS_SOURCE_LABEL = 'metrics-source-label';
const ID_METRICS_LAST_UPDATED_LABEL = 'metrics-last-updated-label';
const ID_SUNRISE = 'sunrise-data';
const ID_SUNSET = 'sunset-data';
const ID_LOCATION = 'location-data';
const ID_ICON = 'metrics-icon';
const ID_TEMPERATURE = 'temperature-data';
const ID_TEMPERATURE_FEEL = 'temperature-feel-data';
const ID_WEATHER_WIND = 'wind-data';
const ID_WEATHER_WIND_MS = 'wind-ms-data';
const ID_WEATHER_WIND_KT = 'wind-kt-data';
const ID_TEMPERATURE_TREND = 'temperature-trend';
const ID_WIND_SPEED_TREND = 'wind-trend';
const ID_PRESSURE_TREND = 'pressure-trend';
const ID_VISIBILITY_TREND = 'visibility-trend';
const ID_WEATHER_VISIBILITY = 'visibility-data';
const ID_WEATHER_PRESSURE = 'pressure-data';
const ID_WEATHER_TEXT_SHORT = 'metrics-data';
const ID_WEATHER_FORECAST_SHORT = 'metrics-forecast-data';
const ID_WEATHER_ALERT = 'metrics-alert';
const ID_WEATHER_ALERT_DATA = 'metrics-alert-data';
const ID_LAST_UPDATED = 'metrics-last-updated';
const ID_COMPASS_ARROW = 'compass-arrow-id';
const CLASS_WEATHER_ALERT1 = 'weather-alert1';
const CLASS_WEATHER_ALERT2 = 'weather-alert2';
const CLASS_WEATHER_ALERT3 = 'weather-alert3';
//const UNIT_TIMEZONE = 'CET'; // TODO get timezone from local JavaScript settings

const ICONS = {
	zonnig: 'mdi-weather-sunny',
	bliksem: 'mdi-weather-lightning',
	regen: 'mdi-weather-pouring',
	buien: 'mdi-weather-partly-rainy',
	hagel: 'mdi-weather-hail',
	mist: 'mdi-weather-fog',
	sneeuw: 'mdi-weather-snow',
	bewolkt: 'mdi-weather-cloudy',
	lichtbewolkt: 'mdi-weather-partly-cloudy',
	halfbewolkt: '',
	halfbewolkt_regen: '',
	zwaarbewolkt: 'mdi-weather-cloud',
	nachtmist: '',
	helderenacht: 'mdi-weather-night',
	nachtbewolkt: 'mdi-night-partly-clouded',
};

class Module {
	constructor() {
//		this.api_url = 'https://weerlive.nl/api/json-data-10min.php?key=' + document.config.weerlive.key + '&locatie=' + document.config.location.name;
		this.api_url = 'https://weerlive.nl/api/json-data-10min.php?key=' + document.config.weerlive.key + '&locatie=' + document.config.location.lattitude + ',' + document.config.location.longitude;
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

		var tempdate = new Date();
		this.UNIT_TIMEZONE = tempdate.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL).split(' ')[1];

		/* Set language specific stuff */
		document.getElementById(ID_METRICS_SOURCE_LABEL).innerHTML = LANGUAGE_SOURCE;
		document.getElementById(ID_METRICS_LAST_UPDATED_LABEL).innerHTML = LANGUAGE_LAST_UPDATED;

		if (document.config.weerlive.key === '0000000000') {
			createSystemMessage('Weerlive API key not set. Please edit config.json with the correct value.');
		} else {
			/* Schedule update of document content */
			this.task = setInterval(
				this.updateData.bind(this),
				this.refreshInterval
			);
		}

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
				if (data['liveweer'] && (data['liveweer'].length == 1)) {
					this.last_updated = new Date();

					/* Location */
					if (data['liveweer'][0]['plaats']) {
						this.location = data['liveweer'][0]['plaats'];
					}
					/* Icon */
					if (data['liveweer'][0]['image']) {
						this.icon = ICON_URL + data['liveweer'][0]['image'] + '.png';
					}
					/* Sunrise time */
					if (data['liveweer'][0]['sup']) {
						this.sunrise = data['liveweer'][0]['sup'];
					}
					/* Sunset time */
					if (data['liveweer'][0]['sunder']) {
						this.sunset = data['liveweer'][0]['sunder'];
					}
					/* Temperature */
					if (data['liveweer'][0]['temp']) {
						var temperature_previous = this.temperature;
						this.temperature = data['liveweer'][0]['temp'];
					}
					/* Temperature feeling */
					if (data['liveweer'][0]['gtemp']) {
						this.temperature_feel = data['liveweer'][0]['gtemp'];
					}
					/* Wind direction in degrees */
					if (data['liveweer'][0]['windrgr']) {
						this.wind_direction_degrees = data['liveweer'][0]['windrgr'];
					}
					/* Wind direction */
					if (data['liveweer'][0]['windr']) {
						if (data['liveweer'][0]['windr'].length > 3) {
							this.wind_direction = data['liveweer'][0]['windr'].slice(0, 1);
						} else {
							this.wind_direction = data['liveweer'][0]['windr'];
						}
					}
					/* Dewpoint */
					if (data['liveweer'][0]['dauwp']) {
						this.dewpoint = data['liveweer'][0]['dauwp'];
					}
					/* Wind speed in m/s */
					if (data['liveweer'][0]['windms']) {
						var wind_speed_ms_previous = this.wind_speed_ms;
						this.wind_speed_ms = data['liveweer'][0]['windms'];
					}
					/* Wind speed in kt */
					if (data['liveweer'][0]['windk']) {
						var wind_speed_kt_previous = this.wind_speed_kt;
						this.wind_speed_kt = data['liveweer'][0]['windk'];
					}
					/* Wind speed in km/h */
					if (data['liveweer'][0]['windkmh']) {
						var wind_speed_kmh_previous = this.wind_speed_kmh;
						this.wind_speed_kmh = data['liveweer'][0]['windkmh'];
					}
					/* Wind speed in Beaufort */
					if (data['liveweer'][0]['winds']) {
						var wind_speed_bft_previous = this.wind_speed_bft;
						this.wind_speed_bft = data['liveweer'][0]['winds'];
					}
					/* Visibility */
					if (data['liveweer'][0]['zicht']) {
						var visibility_previous = this.visibility;
						this.visibility = data['liveweer'][0]['zicht'];
					}
					/* Humidity */
					if (data['liveweer'][0]['lv']) {
						this.humidity = data['liveweer'][0]['lv'];
					}
					/* Air pressure */
					if (data['liveweer'][0]['luchtd']) {
						var pressure_previous = this.pressure;
						this.pressure = data['liveweer'][0]['luchtd'];
					}
					/* Weather short */
					if (data['liveweer'][0]['samenv']) {
						this.weather = data['liveweer'][0]['samenv'];
					}
					/* Forecast */
					if (data['liveweer'][0]['verw']) {
						this.forecast = data['liveweer'][0]['verw'];
					}
					/* Weather alert */
					if (data['liveweer'][0]['alarm']) {
						this.alert = Number(data['liveweer'][0]['alarm']);
					} else {
						this.alert = 0;
					}
					/* Weather alert text */
					if ((data['liveweer'][0]['alarmtxt']) && (data['liveweer'][0]['alarmtxt'].length != 0)) {
						this.alerttext = data['liveweer'][0]['alarmtxt'];
					} else {
						this.alerttext = '';
					}
				}

				document.getElementById(ID_SUNRISE).innerHTML = this.sunrise + '&nbsp;' + this.UNIT_TIMEZONE; // TODO make this a Date()
				document.getElementById(ID_SUNSET).innerHTML = this.sunset + '&nbsp;' + this.UNIT_TIMEZONE; // TODO make this a Date()
				document.getElementById(ID_LOCATION).innerHTML = this.location;
				document.getElementById(ID_ICON).src = this.icon;
				document.getElementById(ID_TEMPERATURE).innerHTML = Number(this.temperature).toFixed(1) + '&nbsp;' + UNIT_CELCIUS;
				document.getElementById(ID_TEMPERATURE_FEEL).innerHTML = Number(this.temperature_feel).toFixed(1) + '&nbsp;' + UNIT_CELCIUS;
				document.getElementById(ID_WEATHER_WIND).innerHTML = this.wind_direction;
				document.getElementById(ID_WEATHER_WIND_MS).innerHTML = this.wind_speed_ms + '&nbsp;' + UNIT_METERS_PER_SECOND;
//				document.getElementById(ID_WEATHER_WIND_KT).innerHTML = this.wind_speed_kt + '&nbsp;' + UNIT_KNOTS;
				document.getElementById(ID_WEATHER_VISIBILITY).innerHTML = this.visibility + '&nbsp;' + UNIT_KILOMETERS;
				document.getElementById(ID_WEATHER_PRESSURE).innerHTML = Number(this.pressure).toFixed(1) + '&nbsp;' + UNIT_HECTOPASCAL;
				document.getElementById(ID_WEATHER_TEXT_SHORT).innerHTML = this.weather;
				document.getElementById(ID_WEATHER_FORECAST_SHORT).innerHTML = this.forecast;
				setCompass(ID_COMPASS_ARROW, this.wind_direction_degrees);
				setTrend(ID_TEMPERATURE_TREND, this.temperature, temperature_previous);
				setTrend(ID_WIND_SPEED_TREND, this.wind_speed_ms, wind_speed_ms_previous);
				setTrend(ID_PRESSURE_TREND, this.pressure, pressure_previous);
				setTrend(ID_VISIBILITY_TREND, this.visibility, visibility_previous);
				if (document.config.alerts.enabled === true) {
					document.getElementById(ID_WEATHER_ALERT_DATA).innerHTML = this.alerttext;
					switch (this.alert) {
						case 1 :
							document.getElementById(ID_WEATHER_ALERT).style.display = 'block';
							document.getElementById(ID_WEATHER_ALERT).classList.add(CLASS_WEATHER_ALERT1);
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT2);
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT3);
							break;
						case 2 :
							document.getElementById(ID_WEATHER_ALERT).style.display = 'block';
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT1);
							document.getElementById(ID_WEATHER_ALERT).classList.add(CLASS_WEATHER_ALERT2);
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT3);
							break;
						case 3 :
							document.getElementById(ID_WEATHER_ALERT).style.display = 'block';
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT1);
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT2);
							document.getElementById(ID_WEATHER_ALERT).classList.add(CLASS_WEATHER_ALERT3);
							break;
						default :
							document.getElementById(ID_WEATHER_ALERT).style.display = 'none';
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT1);
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT2);
							document.getElementById(ID_WEATHER_ALERT).classList.remove(CLASS_WEATHER_ALERT3);
							break;
					}
				}
				document.getElementById(ID_LAST_UPDATED).innerHTML = this.last_updated.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
			}
		}).catch((error) => {
			console.error(error);
		});
	}
}

export { Module };
