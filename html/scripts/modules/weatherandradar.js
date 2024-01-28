/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

class Module {
	constructor(iframe_id) {
		this.iframe_id = iframe_id;
		this.iframe_url = 'https://radar.wo-cloud.com/pwa/?zoom=' + document.config.weatherandradar.zoom + '&center=' + document.config.location.lattitude + ',' + document.config.location.longitude + '&tz=' + document.config.weatherandradar.timezone + '&tf=' + document.config.weatherandradar.timeformat + '&tempunit=' + document.config.weatherandradar.tempunit + '&windunit=' + document.config.weatherandradar.windunit + '&lang=' + document.config.locale.substr(0,2) + '&desktop=true&loop=true&hideControls=' + document.config.weatherandradar.hideControls + '&placemark=' + document.config.location.lattitude + ',' + document.config.location.longitude + '&period=' + document.config.weatherandradar.period;
		this.refreshInterval = 5 * 60 * 1000; // Refresh interval is 5 minutes

		/* Schedule update of document content -- not needed since weatherandradar updates itself */
/*
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);
*/

		/* Initial fill of document content */
		this.updateData();
	}


	updateData() {
		document.getElementById(this.iframe_id).innerHTML = '<iframe src=' + this.iframe_url + '></iframe>';
	}
};

export { Module };
