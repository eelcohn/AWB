/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

// https://openskynetwork.github.io/opensky-api/rest.html

const PROPERTIES = [
	'icao24',
	'callsign',
	'origin_country',
	'time_positiom',
	'last_contact',
	'longitude',
	'lattitude',
	'baro_altitude',
	'on_ground',
	'velocity',
	'true_track',
	'vertical_rate',
	'sensors',
	'geo_altitude',
	'squawk',
	'spi',
	'position_source',
	'category',
];
const aircraft_category = {
	0: 'No information at all',
	1: 'No ADS-B Emitter Category Information',
	2: 'Light (< 15500 lbs)',
	3: 'Small (15500 to 75000 lbs)',
	4: 'Large (75000 to 300000 lbs)',
	5: 'High Vortex Large (aircraft such as B-757)',
	6: 'Heavy (> 300000 lbs)',
	7: 'High Performance (> 5g acceleration and 400 kts)',
	8: 'Rotorcraft',
	9: 'Glider / sailplane',
	10: 'Lighter-than-air',
	11: 'Parachutist / Skydiver',
	12: 'Ultralight / hang-glider / paraglider',
	13: 'Reserved',
	14: 'Unmanned Aerial Vehicle',
	15: 'Space / Trans-atmospheric vehicle',
	16: 'Surface Vehicle – Emergency Vehicle',
	17: 'Surface Vehicle – Service Vehicle',
	18: 'Point Obstacle (includes tethered balloons)',
	19: 'Cluster Obstacle',
	20: 'Line Obstacle',
};

class Module {
	constructor(icao24s) {
		this.icao24s = icao24s;
		this.api_url = 'https://opensky-network.org/api/states/all?icao24=' + icao24s.join(',') + '&extended=1';
		this.refreshInterval = 5 * 60 * 1000; // Refresh interval is 15 seconds
		this.rate_limit = null;

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		var opensky_data, state, plane;

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
				this.rate_limit = null;
				return response.json();	// converting byte data to json
			} else {
				if (response.status == 429) {
					for (var header of response.headers.entries()) {
//						console.log(header);
						if (header[0] === 'X-Rate-Limit-Retry-After-Seconds') {
							this.rate_limit = header[1];
						}
					}
				} else {
					console.warn('Returned HTTP error ' + response.status + ' (' + response.statusText + ')');
				}
				return null;
			}
		}).then(data => {
			opensky_data = [];
			if (data == null) {
				if (this.rate_limit != null) {
					console.log('Rate limited. Retry in ' + this.rate_limit + ' seconds.');
				}
			} else {
				if (data['states']) {
					for (state in data['states']) {
						plane = {};
						if (state.length !== 0) {
	//						console.log(state);
							state.forEach(function(item, index) {
								plane[PROPERTIES[index]] = item;
							});
						}
						opensky_data[plane['icao24']] = plane;
					}
				}
				for (plane in this.icao24s) {
					if (!opensky_data[plane]) {
						opensky_data[plane] = {};
						PROPERTIES.forEach(function(item) {
							opensky_data[plane][item] = null;
						});
					}
				}
			}
//			console.log(opensky_data);
		}).catch((error) => {
			console.error(error);
		});
	}
}

export { Module };

