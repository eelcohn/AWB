/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

import { loadConfig } from './config.js';
import { createSystemMessage, removeSystemMessage } from './functions.js';
import { Module as KNMI } from './modules/knmi.js';
import { Module as KNMIGafor } from './modules/knmi_gafor.js';
import { Module as NOAAMETAR } from './modules/noaa_metar.js';
import { Module as OpenSkyNetwork } from './modules/openskynetwork.js';
import { Module as OpenWeatherMap } from './modules/openweathermap.js';
import { Module as Sat24 } from './modules/sat24.js';
import { Module as WeatherAndRadar } from './modules/weatherandradar.js';
import { Module as WeerLive } from './modules/weerlive.js';
import { Module as WeerSlag } from './modules/weerslag.js';
import { Module as WindsAloft } from './modules/windsaloft.js';

const APPNAME = 'Skydive Weather Dashboard v0.0.2';
const ID_DATETIME = 'datetime-data';
const ID_IMG_LAYER_MAP = 'img-layer-map-id';
const ID_IMG_LAYER_CLOUD = 'img-layer-cloud-id';
const ID_IMG_LAYER_RAIN = 'img-layer-rain-id';
const ID_IFRAME_RAIN = 'layer-rain';
const ID_UPPERWINDS_TABLE = 'uppper-winds-content-data';
const ID_WEATHER_ALERT = 'weather-alert';
const ID_COMPASS = 'compass';
const ID_METAR = 'metar';
const UNIT_ALTITUDE = 'ft';

class ShowCurrentDateTime {
	constructor(id) {
		this.id = id;
		this.refreshInterval = 1000; // Refresh interval is 1 second

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		var element = document.getElementById(ID_DATETIME);
		var x = new Date();

		element.innerHTML = x.toLocaleString(document.config.locale, document.config.options);
	}
}

class OnlineStatus {
	constructor() {
		this.count = 0;
		this.refreshInterval = 5000; // Refresh interval is 5 second

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateStatus.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateStatus();
	}

	updateStatus() {
		if (window.navigator.onLine === false) {
			this.count++;
			if (this.count === 3) {
				createSystemMessage('Internet connection is down');
				console.warn('Internet connection is down');
			}
		} else {
			if (this.count !== 0) {
				removeSystemMessage();
				console.info('Internet connection is restored');
				this.count = 0;
			}
		}
	}
}



/* Automatically add timestamps to console.log */
var originalLog = console.log;
console.log = function () {
	var args = [].slice.call(arguments);
	originalLog.apply(console.log,[new Date().toISOString() + ' ::'].concat(args));
};

/* Make config available for all modules */
document.config = {};
loadConfig().then(response => {
	/* Enable/disable compass rose */
	if (document.config.compass === true) {
		document.getElementById(ID_COMPASS).style.display = 'block';
	} else {
		document.getElementById(ID_COMPASS).style.display = 'none';
	}

	/* Enable/disable METAR & TAF */
	if (document.config.metar) {
		if (document.config.metar.length == 0) {
			document.getElementById(ID_METAR).style.display = 'none';
		} else {
			document.getElementById(ID_METAR).style.display = 'block';
			var metar = {};
			for (var i = 0; i < document.config.metar.length; i++) {
				metar[document.config.metar[i]] = new NOAAMETAR(document.config.metar[i]);
			}
		}
	}

	/* Set up realtime clock */
	var mod_datetime = new ShowCurrentDateTime(ID_DATETIME);

	/* Set up online/offline status monitor */
	var online_status = new OnlineStatus();

	/* Set up ADS-B module(s) */
	//var airplanes = new OpenSkyNetwork(document.config.airplanes);

	/* Add altitudes to upper winds table */
	if (document.config.upperwinds) {
		for (var i = 0; i < document.config.upperwinds.length; i++) {
			document.getElementById(ID_UPPERWINDS_TABLE).innerHTML += `<tr>
<td><span class="windtext" id="wind` + document.config.upperwinds[i] + `-label">` + document.config.upperwinds[i] + `&nbsp;` + UNIT_ALTITUDE + `</span></td>
<td><span class="winddirection" id="wind` + document.config.upperwinds[i] + `-direction"></span></td>
<td><span class="windspeed" id="wind` + document.config.upperwinds[i] + `-speed"></span></td>
<td><span class="windtemperature" id="wind` + document.config.upperwinds[i] + `-temperature"></span></td>
</tr>`;
		}
	}

	//var knmi = new KNMI(ID_IMG_LAYER_RAIN);
	var knmi_gafor = new KNMIGafor();
	//var sat24 = new Sat24(ID_IMG_LAYER_CLOUD);
	//var weatherandradar = new WeatherAndRadar(config, ID_IFRAME_RAIN);
	//var openweathermap = new OpenWeatherMap();
	var weerlive = new WeerLive();
	var weerslag = new WeerSlag(ID_IMG_LAYER_MAP);
	var windsaloft = new WindsAloft();
})

