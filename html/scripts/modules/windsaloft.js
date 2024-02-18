/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

import { DATE_OPTIONS_LOCAL, UNIT_DIRECTION, UNIT_KNOTS, UNIT_CELCIUS, UNIT_FEET } from '../const.js';
import { createSystemMessage, removeSystemMessage, setTrend } from '../functions.js';
import { LANGUAGE_SOURCE, LANGUAGE_LAST_UPDATED } from '../language.js';

const SOURCE = 'Windsaloft';

const ID_WINDS_SOURCE_LABEL = 'winds-source-label';
const ID_WINDS_SOURCE_DATA = 'winds-source-data';
const ID_WINDS_LAST_UPDATED_LABEL = 'winds-last-updated-label';
const ID_WINDS_LAST_UPDATED_SPINNER = 'winds-last-updated-spinner';
const ID_WINDS_LAST_UPDATED_WARNING = 'winds-last-updated-warning';
const ID_WIND_DIRECTION = 'wind????-direction';
const ID_WIND_SPEED = 'wind????-speed';
const ID_WIND_TEMPERATURE = 'wind????-temperature';
const ID_FREEZING_ALTITUDE = 'freezing-altitude-data';
const ID_FREEZING_ALTITUDE_TREND = 'freezing-altitude-trend';
const ID_LAST_UPDATED = 'winds-last-updated';
const ID_VALID_FROM = 'winds-valid-from';
const ICON_TREND_DOWN = 'mdi-arrow-bottom-right';
const ICON_TREND_UP = 'mdi-arrow-top-right';
const FREEZING_TEMPERATURE = 0;

class Module {
	constructor() {
//		this.api_url = 'https://markschulze.net/winds/winds.php?lat=' + document.config.location.lattitude + '&lon=' + document.config.location.longitude + '&hourOffset=' + document.config.windsaloft.hourOffset + '&referrer=' + document.config.windsaloft.referrer;
		this.api_url = 'https://windsaloft.us/winds_gfs_1hr.php?lat=' + document.config.location.lattitude + '&lon=' + document.config.location.longitude + '&hourOffset=' + document.config.windsaloft.hourOffset + '&referrer=' + document.config.windsaloft.referrer;
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

		/* Set language specific stuff */
		document.getElementById(ID_WINDS_SOURCE_LABEL).innerHTML = LANGUAGE_SOURCE;
		document.getElementById(ID_WINDS_SOURCE_DATA).innerHTML = SOURCE;
		document.getElementById(ID_WINDS_LAST_UPDATED_LABEL).innerHTML = LANGUAGE_LAST_UPDATED;

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval,
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		/* Disable warning icon */
		document.getElementById(ID_WINDS_LAST_UPDATED_WARNING).style.display = 'none';

		/* Enable spinner icon */
		document.getElementById(ID_WINDS_LAST_UPDATED_SPINNER).style.display = 'block';

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
			/* Disable spinner icon */
			document.getElementById(ID_WINDS_LAST_UPDATED_SPINNER).style.display = 'none';

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
					}
				} catch (error) {
					console.error('WindsAloft: Error parsing JSON data: ' + JSON.stringify(data, null, 4));
					document.getElementById(ID_WINDS_LAST_UPDATED_WARNING).style.display = 'block';
					document.getElementById(ID_WINDS_LAST_UPDATED_SPINNER).style.display = 'none';

				}

				// Calculate freezing level: Get the altitude closest to the freezing level
				var freezing_altitude_previous = this.freezing_altitude;

				for (let x in this.temperature) {
					if (this.temperature[x] <= 0) {
						if (x >= 1000) {
							this.freezing_altitude = x - 1000;

							// Calculate the freezing level when it's not at one of the pre-defined altitudes
							if (this.temperature[this.freezing_altitude] !== FREEZING_TEMPERATURE) {
								var diff = Math.abs(this.temperature[this.freezing_altitude]) + Math.abs(this.temperature[this.freezing_altitude + 1000]);
								this.freezing_altitude += Number((Math.abs(this.temperature[this.freezing_altitude]) / diff * 1000).toFixed(0));
							}
						} else {
							this.freezing_altitude = x;
						}
						break;
					}
				};

				/* Update document */
				for (var i = 0; i < document.config.upperwinds.length; i++) {
					document.getElementById(ID_WIND_DIRECTION.replace('????', document.config.upperwinds[i])).innerHTML = this.wind_direction[document.config.upperwinds[i]] + '&nbsp;' + UNIT_DIRECTION;
					document.getElementById(ID_WIND_SPEED.replace('????', document.config.upperwinds[i])).innerHTML = this.wind_speed[document.config.upperwinds[i]] + '&nbsp;' + UNIT_KNOTS;
					if (this.temperature[document.config.upperwinds[i]] == -272) {
						/* Do not display invalid temperatures */
						document.getElementById(ID_WIND_TEMPERATURE.replace('????', document.config.upperwinds[i])).innerHTML = '-&nbsp;' + UNIT_CELCIUS;
					} else {
						document.getElementById(ID_WIND_TEMPERATURE.replace('????', document.config.upperwinds[i])).innerHTML = this.temperature[document.config.upperwinds[i]] + '&nbsp;' + UNIT_CELCIUS;
					}
				}

				document.getElementById(ID_FREEZING_ALTITUDE).innerHTML = this.freezing_altitude + '&nbsp;' + UNIT_FEET;
				setTrend(ID_FREEZING_ALTITUDE_TREND, this.freezing_altitude, freezing_altitude_previous);

				document.getElementById(ID_VALID_FROM).innerHTML = this.valid_from.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL );
				document.getElementById(ID_LAST_UPDATED).innerHTML = this.last_updated.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL );
			} else {
				// TODO: Old data warning?
//				createSystemMessage('Could not update upper winds from www.windsaloft.us');
//				setTimeout(removeSystemMessage(), 10000);
				for (var i = 0; i < document.config.upperwinds.length; i++) {
					if (this.wind_direction[document.config.upperwinds[i]] === undefined) {
						document.getElementById(ID_WIND_DIRECTION.replace('????', document.config.upperwinds[i])).innerHTML = '-&nbsp;' + UNIT_DIRECTION;
					}
					if (this.wind_speed[document.config.upperwinds[i]] === undefined) {
						document.getElementById(ID_WIND_SPEED.replace('????', document.config.upperwinds[i])).innerHTML = '-&nbsp;' + UNIT_KNOTS;
					}
					if (this.temperature[document.config.upperwinds[i]] === undefined) {
						document.getElementById(ID_WIND_TEMPERATURE.replace('????', document.config.upperwinds[i])).innerHTML = '-&nbsp;' + UNIT_CELCIUS;
					}
				}

				if (this.freezing_altitude === null) {
					document.getElementById(ID_FREEZING_ALTITUDE).innerHTML = '-&nbsp;' + UNIT_FEET;
					setTrend(ID_FREEZING_ALTITUDE_TREND, 0, 0);
				}

				document.getElementById(ID_WINDS_LAST_UPDATED_WARNING).style.display = 'block';
			}

		}).catch((error) => {
			/* Disable spinner icon */
			document.getElementById(ID_WINDS_LAST_UPDATED_SPINNER).style.display = 'none';

			/* Enable warning icon */
			document.getElementById(ID_WINDS_LAST_UPDATED_WARNING).style.display = 'block';

			console.error(error);
		});
	}
}

export { Module };
