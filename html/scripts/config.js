/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

import { createSystemMessage } from './functions.js';

const CONFIG_URL = './config.json';

function loadConfig() {
	/* Fetch data from the API */
	fetch(
		CONFIG_URL,
		{
			headers: {
				Accept: 'application/json',
			},
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
			return data;
		} else {
			createSystemMessage('Could not load configuration file.');
		}
	});
}

const config = {
	location: {
		lattitude: 52.73238107767711,
		longitude: 6.521150287956746,
		name: 'Hoogeveen',
	},
	locale: 'nl-NL',
	options: {
		timeZoneName: 'short',
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	},
	compass: true,
	metar: [
		'EHGG',
	],
	upperwinds: [
		1000,
		2000,
		3000,
		5000,
		10000,
		15000,
	],
	airplanes: [
		'48488d',
		'4ca92d',
		'7816a1',
	],
	alerts: {
		enabled: false,
	},
	knmi_gafor: [
		'Geldig',
		'Situatie',
		'Significant weer',
		'Wind',
		'Bewolking',
		'Thermiek',
		'Vooruitzichten',
	],
	openweathermap: {
		appid: '00000000000000000000000000000000',
	},
	sat24: {
		image_size: '3',
		timezone: 'W_dot_%20Europe%20Standard%20Time',
		location: '8115883',
	},
	weatherandradar: {
		'zoom': 8,
		'layer': 'wr',
	},
	weerlive: {
		key: '1234567890',
	},
	windsaloft: {
		hourOffset: '0',
		referrer: 'MSWA',
	},
};

export { config, loadConfig };

