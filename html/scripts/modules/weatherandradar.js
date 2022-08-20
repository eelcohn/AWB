/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

class Module {
	constructor(id) {
		this.iframe_id = iframe_id;
		this.iframe_url = 'https://www.weatherandradar.co.uk/weather-map?center=' + document.config.location.lattitude + ',' + document.config.location.longitude + '&zoom=' + document.config.weatherandradar.zoom + '&layer=' + document.config.weatherandradar.layer;
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

