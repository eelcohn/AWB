/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

import { createSystemMessage } from './functions.js';

const CONFIG_URL = './config.json';

async function loadConfig(location) {
    if (location === null) {
        var url = CONFIG_URL;
    } else {
        var url = './config-' + location + '.json';
    }
	/* Fetch data from the API */
	document.config = await fetch(
		url,
		{
			headers: {
				Accept: 'application/json',
			},
		}
	).then(response => {
		if (response.ok === true) {
			return response.json();
		} else {
			console.warn('Returned HTTP error ' + response.status + ' (' + response.statusText + ')');
			return null;
		}
	}).then(data => {
		if (data === null) {
			createSystemMessage('Configuration file not found.');
		}
		return data;
	}).catch((error) => {
		console.error(error);
		createSystemMessage('Could not load configuration file.');
	});
}

export { loadConfig };
