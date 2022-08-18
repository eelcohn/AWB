/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

class Module {
	constructor(config, id) {
		this.iframe_id = iframe_id;
		this.iframe_url = 'https://www.weatherandradar.co.uk/weather-map?center=' + config.location.lattitude + ',' + config.location.longitude + '&zoom=' + config.weatherandradar.zoom + '&layer=' + config.weatherandradar.layer;
		this.refreshInterval = 5 * 60 * 1000; // Refresh interval is 5 minutes

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}


	updateData() {
		document.getElementById(this.iframe_id).innerHTML = '<iframe src=' + this.iframe_url + '></iframe>';
	}
};

export { Module };

