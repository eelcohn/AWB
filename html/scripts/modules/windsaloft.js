/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

import { setTrend } from '../functions.js';

const ID_WIND_DIRECTION = 'wind????-direction';
const ID_WIND_SPEED = 'wind????-speed';
const ID_WIND_TEMPERATURE = 'wind????-temperature';
const ID_FREEZING_ALTITUDE = 'freezing-altitude-data';
const ID_FREEZING_ALTITUDE_TREND = 'freezing-altitude-trend';
const ID_LAST_UPDATED = 'winds-last-updated';
const ID_VALID_FROM = 'winds-valid-from';
const ICON_TREND_DOWN = 'mdi-arrow-bottom-right';
const ICON_TREND_UP = 'mdi-arrow-top-right';
const UNIT_DIRECTION = '°';
const UNIT_SPEED = 'kt';
const UNIT_TEMPERATURE = '°C';
const UNIT_ALTITUDE = 'ft';
const FREEZING_TEMPERATURE = 0;

class Module {
	constructor() {
		this.api_url = 'https://markschulze.net/winds/winds.php?lat=' + document.config.location.lattitude + '&lon=' + document.config.location.longitude + '&hourOffset=' + document.config.windsaloft.hourOffset + '&referrer=' + document.config.windsaloft.referrer;
		this.cors_proxy_url = 'cors-proxy.php';
		this.refreshInterval = 10 * 60 * 1000; // Refresh interval is 10 minutes
		this.last_updated = null;
		this.valid_from = null;
		this.wind_direction = {};
		this.wind_speed = {}
		this.temperature = {};
		this.freezing_altitude = null;
		this.qfe = null;
		this.qnh = null;

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval,
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		/* Fetch data from the API */
		fetch(
			this.cors_proxy_url,
			{
				cache: "no-store",
				headers: {
					Accept: 'application/json',
					'X-Request-Url': this.api_url,
//					'X-Request-Url': this.api_url + '&r=' + Math.random(),
				},
				keepalive: true,
				referrerPolicy: 'no-referrer',
			}
		).then(response => {
			if (response.ok === true) {
				return response.json();	// converting byte data to json
			} else {
				console.warn('Returned HTTP error ' + response.status + ' (' + response.statusText + ')');
				return null;
			}
		}).then(data => {
			if (data != null) {
				try {
					// Update the data
					var valid_from = new Date();
//					var daylightSavingsOffset = (new Date('2022-01-01').getTimezoneOffset() - new Date('2022-07-01').getTimezoneOffset()) / 60;
					valid_from.setHours(data['validtime'] - (new Date().getTimezoneOffset() / 60), 0, 0);
					if (+this.valid_from !== +valid_from) {
						this.last_updated = new Date();
						this.valid_from = valid_from;
						this.wind_direction = data['direction'];
						this.wind_speed = data['speed'];
						this.temperature = data['temp'];
						this.qfe = Number(data['QFE']).toFixed(1);
						this.qnh = Number(data['QNH']).toFixed(1);

						// Calculate freezing level: Get the altitude closest to the freezing level
						var freezing_altitude_previous = this.freezing_altitude;
						var closest = Object.values(this.temperature).reduce((a, b) => {
							return Math.abs(b - FREEZING_TEMPERATURE) < Math.abs(a - FREEZING_TEMPERATURE) ? b : a;
						});
						this.freezing_altitude = Number(Object.keys(this.temperature).find(key => this.temperature[key] === closest));
						// Calculate freezing level: Calculate the freezing level when it's not at one of the pre-defined altitudes
						if (this.temperature[this.freezing_altitude] !== FREEZING_TEMPERATURE) {
							var diff = Math.abs(this.temperature[this.freezing_altitude]) + Math.abs(this.temperature[this.freezing_altitude + 1000]);
							this.freezing_altitude += Number((Math.abs(this.temperature[this.freezing_altitude]) / diff * 1000).toFixed(0));
						}

						/* Update document */
						for (var i = 0; i < document.config.upperwinds.length; i++) {
							document.getElementById(ID_WIND_DIRECTION.replace('????', document.config.upperwinds[i])).innerHTML = this.wind_direction[document.config.upperwinds[i]] + '&nbsp;' + UNIT_DIRECTION;
							document.getElementById(ID_WIND_SPEED.replace('????', document.config.upperwinds[i])).innerHTML = this.wind_speed[document.config.upperwinds[i]] + '&nbsp;' + UNIT_SPEED;
							document.getElementById(ID_WIND_TEMPERATURE.replace('????', document.config.upperwinds[i])).innerHTML = this.temperature[document.config.upperwinds[i]] + '&nbsp;' + UNIT_TEMPERATURE;
						}

						document.getElementById(ID_FREEZING_ALTITUDE).innerHTML = this.freezing_altitude + '&nbsp;' + UNIT_ALTITUDE;
						setTrend(ID_FREEZING_ALTITUDE_TREND, this.freezing_altitude, freezing_altitude_previous);

						document.getElementById(ID_VALID_FROM).innerHTML = this.valid_from.toLocaleString(document.config.locale, { timeZoneName: 'short', hour12: false, hour: '2-digit', minute: '2-digit'} );
						document.getElementById(ID_LAST_UPDATED).innerHTML = this.last_updated.toLocaleString(document.config.locale, { timeZoneName: 'short', hour12: false, hour: '2-digit', minute: '2-digit'} );
					}
				} catch (error) {
					console.error('WindsAloft: Error parsing JSON data: ' + JSON.stringify(data, null, 4));
				}
			} else {
//				Old data warning?
			}
		});
	}
}

export { Module };

