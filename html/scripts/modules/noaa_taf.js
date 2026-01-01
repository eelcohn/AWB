/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

import { DATE_OPTIONS_LOCAL } from '../const.js';

const ID_TAF_CONTENT = 'taf-content';
const ID_TAF_VALID_FROM = 'taf-valid-from';
const ID_TAF_LAST_UPDATED = 'taf-last-updated';

class Module {
	constructor(station) {
		this.station = station
		this.taf_url = `https://tgftp.nws.noaa.gov/data/forecasts/taf/stations/`;
		this.cors_proxy_url = 'cors-proxy.php';
		this.refreshInterval = 10 * 60 * 1000; // Refresh interval is 10 minutes

		this.taf = null;
		this.valid_from = null
		this.last_updated = null;

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		var i, start;

		/* Update NOAA TAF data */
		fetch(
			this.cors_proxy_url,
			{
				headers: {
					'X-Request-Url': this.taf_url + this.station.toUpperCase() + '.TXT',
				},
				keepalive: true,
				mode: 'cors',
				referrerPolicy: 'no-referrer',
			}
		).then(response => {
			if (response.status == 200) {
				return response.text();
			} else {
				console.warn('Returned HTTP error ' + response.status + ' (' + response.statusText + ')');
				return null;
			}
		}).then(data => {
			if (data != null) {
				this.last_updated = new Date();

				this.taf = data.split('\n')[1];

				/* Get day & time when this bulletin was published */
				this.valid_from = new Date();
				start = this.taf.indexOf(this.station) + 5;
				this.valid_from.setDate(
					Number(this.taf.slice(start, start + 2))
				);
				this.valid_from.setHours(
					Number(this.taf.slice(start + 2, start + 4)) - (new Date().getTimezoneOffset() / 60),
					Number(this.taf.slice(start + 4, start + 6)),
					0
				);
				document.getElementById(ID_TAF_CONTENT).innerHTML = this.taf;
				document.getElementById(ID_TAF_VALID_FROM).innerHTML = this.valid_from.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
				document.getElementById(ID_TAF_LAST_UPDATED).innerHTML = this.last_updated.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);				
			}
		}).catch((error) => {
			console.error(error);
		});
	}
}

export { Module };
